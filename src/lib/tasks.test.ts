import { describe, expect, it, vi } from "vitest";

vi.mock("./appwrite", () => ({
  TODO_DATABASE_ID: "todo",
  TASKS_TABLE_ID: "tasks",
  newId: () => "row1",
  createTablesDB: () => ({
    createRow: vi.fn(async ({ data, permissions }) => ({ $id: "row1", ...data, permissions })),
    updateRow: vi.fn(async ({ data }) => ({ $id: "t1", ...data })),
    getRow: vi.fn(async () => ({ $id: "t1", userId: "u1", title: "Test", status: "open" })),
    deleteRow: vi.fn(),
    listRows: vi.fn(async () => ({ rows: [], total: 0 })),
  }),
}));

import { createTask, toggleTaskStatus } from "./tasks";

describe("tasks", () => {
  it("creates with open status by default", async () => {
    const task = await createTask("u1", { title: "Ship" });
    expect(task.title).toBe("Ship");
    expect(task.status).toBe("open");
  });

  it("toggles status", async () => {
    const task = await toggleTaskStatus("u1", {
      $id: "t1",
      title: "Test",
      status: "open",
      userId: "u1",
    });
    expect(task.status).toBe("done");
  });
});