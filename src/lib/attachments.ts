import { ATTACHMENTS_BUCKET_ID, createStorage, newId } from "./appwrite";
export async function uploadAttachment(_userId: string, file: File): Promise<string> {
  const storage = createStorage();
  const created = await storage.createFile(ATTACHMENTS_BUCKET_ID, newId(), file);
  return created.$id;
}

export function attachmentViewUrl(fileId: string): string {
  const storage = createStorage();
  return String(storage.getFileView(ATTACHMENTS_BUCKET_ID, fileId));
}

export function attachmentDownloadUrl(fileId: string): string {
  const storage = createStorage();
  return String(storage.getFileDownload(ATTACHMENTS_BUCKET_ID, fileId));
}

export async function deleteAttachment(fileId: string): Promise<void> {
  if (!fileId) return;
  const storage = createStorage();
  await storage.deleteFile(ATTACHMENTS_BUCKET_ID, fileId);
}