// story: e01s03
import { Account, Client, Databases, ID, Storage } from "appwrite";

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

export function createDatabases(): Databases {
  return new Databases(createClient());
}

export function createStorage(): Storage {
  return new Storage(createClient());
}

export const CANARY_DATABASE_ID = "canary";
export const CANARY_COLLECTION_ID = "items";
export const CANARY_BUCKET_ID = "canary-files";

export function newId(): string {
  return ID.unique();
}