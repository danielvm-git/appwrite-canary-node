import { describe, expect, it, vi } from "vitest";
import { ShareError, shareTask } from "./share.js";

function setup(row = {}) {
  const task = {
    $id: "t1",
    userId: "owner",
    title: "Ship",
    sharedWith: [],
    sharedNames: [],
    $permissions: ['read("user:owner")', 'update("user:owner")', 'delete("user:owner")'],
    ...row,
  };
  const db = {
    getRow: vi.fn(async () => task),
    updateRow: vi.fn(async (params) => ({ ...task, ...params.data, $permissions: params.permissions })),
  };
  const people = {
    "ben@desk.dev": { $id: "ben", name: "Ben Lima", email: "ben@desk.dev" },
    "owner@desk.dev": { $id: "owner", name: "Ana Souza", email: "owner@desk.dev" },
  };
  const findUserByEmail = vi.fn(async (email) => people[email] ?? null);
  return { db, findUserByEmail, task };
}

async function expectCode(promise, code) {
  await expect(promise).rejects.toBeInstanceOf(ShareError);
  await promise.catch((err) => expect(err.code).toBe(code));
}

describe("SC-todo-share share-task function", () => {
  it("grants read and update to the invited user and records the name", async () => {
    const { db, findUserByEmail } = setup();
    const result = await shareTask({ callerId: "owner", taskId: "t1", email: " Ben@Desk.dev ", db, findUserByEmail });

    expect(findUserByEmail).toHaveBeenCalledWith("ben@desk.dev");
    expect(result).toEqual({ sharedWith: ["ben"], sharedNames: ["Ben Lima"] });
    const update = db.updateRow.mock.calls[0][0];
    expect(update).toMatchObject({ databaseId: "todo", tableId: "tasks", rowId: "t1" });
    expect(update.permissions).toEqual(
      expect.arrayContaining(['read("user:ben")', 'update("user:ben")', 'delete("user:owner")']),
    );
    expect(update.permissions).not.toContain('delete("user:ben")');
  });

  it("adds owner permissions when the row has none", async () => {
    const { db, findUserByEmail } = setup({ $permissions: [] });
    await shareTask({ callerId: "owner", taskId: "t1", email: "ben@desk.dev", db, findUserByEmail });
    expect(db.updateRow.mock.calls[0][0].permissions).toEqual(
      expect.arrayContaining(['read("user:owner")', 'update("user:owner")', 'delete("user:owner")']),
    );
  });

  it("rejects anonymous callers", async () => {
    const { db, findUserByEmail } = setup();
    await expectCode(shareTask({ callerId: "", taskId: "t1", email: "ben@desk.dev", db, findUserByEmail }), "unauthorized");
  });

  it("rejects an invalid email before touching the database", async () => {
    const { db, findUserByEmail } = setup();
    await expectCode(shareTask({ callerId: "owner", taskId: "t1", email: "ben", db, findUserByEmail }), "invalid");
    expect(db.getRow).not.toHaveBeenCalled();
  });

  it("only lets the owner share", async () => {
    const { db, findUserByEmail } = setup();
    await expectCode(shareTask({ callerId: "ben", taskId: "t1", email: "owner@desk.dev", db, findUserByEmail }), "forbidden");
    expect(db.updateRow).not.toHaveBeenCalled();
  });

  it("maps a missing row to not_found", async () => {
    const { db, findUserByEmail } = setup();
    db.getRow.mockRejectedValueOnce(Object.assign(new Error("Row not found"), { code: 404 }));
    await expectCode(shareTask({ callerId: "owner", taskId: "nope", email: "ben@desk.dev", db, findUserByEmail }), "not_found");
  });

  it("reports unknown, self and duplicate invites", async () => {
    const a = setup();
    await expectCode(shareTask({ callerId: "owner", taskId: "t1", email: "zoe@desk.dev", ...a }), "no_user");
    const b = setup();
    await expectCode(shareTask({ callerId: "owner", taskId: "t1", email: "owner@desk.dev", ...b }), "self");
    const c = setup({ sharedWith: ["ben"], sharedNames: ["Ben Lima"] });
    await expectCode(shareTask({ callerId: "owner", taskId: "t1", email: "ben@desk.dev", ...c }), "already");
  });
});
