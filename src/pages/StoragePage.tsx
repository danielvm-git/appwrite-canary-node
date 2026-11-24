// story: e01s03
import { FormEvent, useState } from "react";
import { CANARY_BUCKET_ID, appwriteConfigured, createStorage } from "../lib/appwrite";

export function StoragePage() {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!appwriteConfigured()) {
      setError("Appwrite env not configured");
      return;
    }
    const storage = createStorage();
    const created = await storage.createFile(CANARY_BUCKET_ID, "unique()", file);
    const view = storage.getFileView(CANARY_BUCKET_ID, created.$id);
    setUrl(String(view));
  }

  return (
    <section>
      <h1>Storage</h1>
      <form onSubmit={onUpload} className="stack">
        <input name="file" type="file" />
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
      {url && (
        <p>
          URL:{" "}
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </p>
      )}
      {error && <p className="mono">{error}</p>}
    </section>
  );
}