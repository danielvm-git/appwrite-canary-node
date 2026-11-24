import { Query } from "appwrite";
import {
  TASKS_TABLE_ID,
  TODO_DATABASE_ID,
  createTablesDB,
  newId,
} from "./appwrite";

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

export async function listTasksForUser(
  userId: string,
  opts?: { listId?: string; status?: TaskStatus; search?: string },
): Promise<Task[]> {
  const queries = [Query.equal("userId", userId), Query.orderDesc("$createdAt")];
  if (opts?.listId) queries.push(Query.equal("listId", opts.listId));
  if (opts?.status) queries.push(Query.equal("status", opts.status));
  if (opts?.search?.trim()) queries.push(Query.search("title", opts.search.trim()));

  const db = createTablesDB();
  const result = await db.listRows({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    queries,
  });
  return result.rows as unknown as Task[];
}

export async function getTask(taskId: string): Promise<Task> {
  const db = createTablesDB();
  return (await db.getRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: taskId,
  })) as unknown as Task;
}

export async function createTask(userId: string, input: TaskInput): Promise<Task> {
  const db = createTablesDB();
  const row = await db.createRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: newId(),
    data: {
      title: input.title,
      notes: input.notes ?? "",
      status: input.status ?? "open",
      dueDate: input.dueDate ?? null,
      listId: input.listId ?? "",
      userId,
      attachmentId: input.attachmentId ?? "",
    },
  });
  return row as unknown as Task;
}

export async function updateTask(userId: string, taskId: string, patch: Partial<TaskInput>): Promise<Task> {
  const existing = await getTask(taskId);
  if (existing.userId !== userId) throw new Error("Not allowed");
  const db = createTablesDB();
  const row = await db.updateRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: taskId,
    data: {
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.dueDate !== undefined ? { dueDate: patch.dueDate || null } : {}),
      ...(patch.listId !== undefined ? { listId: patch.listId } : {}),
      ...(patch.attachmentId !== undefined ? { attachmentId: patch.attachmentId } : {}),
    },
  });
  return row as unknown as Task;
}

export async function toggleTaskStatus(userId: string, task: Task): Promise<Task> {
  const next: TaskStatus = task.status === "done" ? "open" : "done";
  return updateTask(userId, task.$id, { status: next });
}

export async function deleteTask(userId: string, taskId: string): Promise<void> {
  const existing = await getTask(taskId);
  if (existing.userId !== userId) throw new Error("Not allowed");
  const db = createTablesDB();
  await db.deleteRow({
    databaseId: TODO_DATABASE_ID,
    tableId: TASKS_TABLE_ID,
    rowId: taskId,
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