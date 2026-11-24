import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockTablesDB } from "../test/mockTablesDb";

const mock = createMockTablesDB();

vi.mock("./appwrite", () => ({
  TODO_DATABASE_ID: "todo",
  TASKS_TABLE_ID: "tasks",
  newId: () => "generated-row-id",
  createTablesDB: () => mock.db,
}));

import {
  createTask,
  deleteTask,
  listTasksForUser,
  toggleTaskStatus,
  updateTask,
} from "./tasks";

describe("tasks TablesDB contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mock.calls.createRow.length = 0;
    mock.calls.updateRow.length = 0;
  });

  it("SC-todo-P0-01 createRow includes databaseId tableId rowId", async () => {
    await createTask("u1", { title: "Ship" });
    expect(mock.calls.createRow[0]).toMatchObject({
      databaseId: "todo",
      tableId: "tasks",
      rowId: "generated-row-id",
    });
  });

  it("SC-todo-P0-01 updateRow includes rowId", async () => {
    await updateTask("u1", "task-abc", { title: "Updated" });
    expect(mock.calls.updateRow[0]).toMatchObject({
      databaseId: "todo",
      tableId: "tasks",
      rowId: "task-abc",
    });
  });

  it("SC-todo-P0-02 rejects missing task id on update", async () => {
    await expect(updateTask("u1", undefined, { title: "x" })).rejects.toThrow(/Missing task id/);
    expect(mock.calls.updateRow).toHaveLength(0);
  });

  it("SC-todo-P0-03 rejects delete for other user", async () => {
    mock.db.getRow.mockResolvedValueOnce({ $id: "t1", userId: "other", title: "X", status: "open" });
    await expect(deleteTask("u1", "t1")).rejects.toThrow(/Not allowed/);
  });

  it("SC-todo-P1-04 falls back to contains when fulltext search fails", async () => {
    mock.db.listRows
      .mockRejectedValueOnce(new Error('Searching by attribute "title" requires a fulltext index'))
      .mockResolvedValueOnce({ rows: [{ $id: "1", title: "Task 1" } as never], total: 1 });

    const rows = await listTasksForUser("u1", { search: "Task" });
    expect(rows).toHaveLength(1);
    expect(mock.db.listRows).toHaveBeenCalledTimes(2);
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