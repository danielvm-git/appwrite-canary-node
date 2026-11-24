import { Query } from "appwrite";
import {
  TASKS_TABLE_ID,
  TODO_DATABASE_ID,
  createTablesDB,
  newId,
} from "./appwrite";
import { buildTaskPatch, buildTaskRowData } from "./taskPayload";

export type TaskStatus = "open" | "done";

export type Task = {
  $id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  dueDate?: string;
  listId?: string;
  userId: string;
  attachmentId?: string;
};

export type TaskInput = {
  title: string;
  notes?: string;
  status?: TaskStatus;
  dueDate?: string;
  listId?: string;
  attachmentId?: string;
};

function requireTaskId(taskId: string | undefined): string {
  const id = taskId?.trim();
  if (!id || id === "new") throw new Error("Missing task id");
  return id;
}

export async function listTasksForUser(
  userId: string,
  opts?: { listId?: string; status?: TaskStatus; search?: string },
): Promise<Task[]> {
  const queries = [Query.equal("userId", userId), Query.orderDesc("$createdAt")];
  if (opts?.listId) queries.push(Query.equal("listId", opts.listId));
  if (opts?.status) queries.push(Query.equal("status", opts.status));

  const db = createTablesDB();
  const search = opts?.search?.trim();

  if (search) {
    try {
      const result = await db.listRows({
        databaseId: TODO_DATABASE_ID,
        tableId: TASKS_TABLE_ID,
        queries: [...queries, Query.search("title", search)],
      });
      return result.rows as unknown as Task[];
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!message.includes("fulltext")) throw err;
      const result = await db.listRows({
        databaseId: TODO_DATABASE_ID,
        tableId: TASKS_TABLE_ID,
        queries: [...queries, Query.contains("title", search)],
      });
      return result.rows as unknown as Task[];
    }
  }

  const result = await db.listRows({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    queries,
  });
  return result.rows as unknown as Task[];
}

export async function getTask(taskId: string): Promise<Task> {
  const id = requireTaskId(taskId);
  const db = createTablesDB();
  return (await db.getRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: id,
  })) as unknown as Task;
}

export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  const rowId = newId();
  const db = createTablesDB();
  const row = await db.createRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId,
    data: buildTaskRowData(userId, input),
  });
  return row as unknown as Task;
}

export async function updateTask(
  userId: string,
  taskId: string | undefined,
  patch: Partial<TaskInput>,
): Promise<Task> {
  const id = requireTaskId(taskId);
  const existing = await getTask(id);
  if (existing.userId !== userId) throw new Error("Not allowed");
  const db = createTablesDB();
  const row = await db.updateRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: id,
    data: buildTaskPatch(patch),
  });
  return row as unknown as Task;
}

export async function toggleTaskStatus(userId: string, task: Task): Promise<Task> {
  const next: TaskStatus = task.status === "done" ? "open" : "done";
  return updateTask(userId, task.$id, { status: next });
}

export async function deleteTask(userId: string, taskId: string | undefined): Promise<void> {
  const id = requireTaskId(taskId);
  const existing = await getTask(id);
  if (existing.userId !== userId) throw new Error("Not allowed");
  const db = createTablesDB();
  await db.deleteRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: id,
  });
}

export async function countTasksByStatus(userId: string): Promise<{ open: number; done: number }> {
  const db = createTablesDB();
  const [openList, doneList] = await Promise.all([
    db.listRows({
      databaseId: TODO_DATABASE_ID,
      tableId: TASKS_TABLE_ID,
      queries: [Query.equal("userId", userId), Query.equal("status", "open")],
    }),
    db.listRows({
      databaseId: TODO_DATABASE_ID,
      tableId: TASKS_TABLE_ID,
      queries: [Query.equal("userId", userId), Query.equal("status", "done")],
    }),
  ]);
  return { open: openList.total, done: doneList.total };
}