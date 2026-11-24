// story: todo-app
import { Account, Client, ID, Storage, TablesDB } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";

export function appwriteConfigured(): boolean {
  return Boolean(endpoint && projectId);
}

export function createClient(): Client {
  const client = new Client();
  client.setEndpoint(endpoint).setProject(projectId);
  return client;
}

export function createAccount(): Account {
  return new Account(createClient());
}

export function createTablesDB(): TablesDB {
  return new TablesDB(createClient());
}

export function createStorage(): Storage {
  return new Storage(createClient());
}

export const TODO_DATABASE_ID = "todo";
export const LISTS_TABLE_ID = "lists";
export const TASKS_TABLE_ID = "tasks";
export const ATTACHMENTS_BUCKET_ID = "task-attachments";

/** @deprecated legacy canary slice — kept for smoke history */
export const CANARY_DATABASE_ID = "canary";
export const CANARY_COLLECTION_ID = "items";
export const CANARY_BUCKET_ID = "canary-files";

export function newId(): string {
  return ID.unique();
}