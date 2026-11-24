// story: e01s03
import { FormEvent, useEffect, useState } from "react";
import {
  CANARY_COLLECTION_ID,
  CANARY_DATABASE_ID,
  appwriteConfigured,
  createDatabases,
  newId,
} from "../lib/appwrite";

type Row = { $id: string; title: string };

export function DatabasePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!appwriteConfigured()) return;
    const db = createDatabases();
    try {
      const list = await db.listDocuments(CANARY_DATABASE_ID, CANARY_COLLECTION_ID);
      setRows(list.documents as unknown as Row[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "List failed");
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    if (!appwriteConfigured()) {
      setError("Appwrite env not configured");
      return;
    }
    const db = createDatabases();
    await db.createDocument(CANARY_DATABASE_ID, CANARY_COLLECTION_ID, newId(), { title });
    setTitle("");
    await load();
  }

  return (
    <section>
      <h1 className="page-title ds-h1">Database</h1>
      <p className="page-desc">Collection canary / items.</p>
      <form onSubmit={onCreate} className="form-stack">
        <div className="input-group">
          <label className="input-label" htmlFor="db-title">
            Title
          </label>
          <input
            className="input"
            id="db-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Item title"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create row
        </button>
      </form>
      <ul className="landing-bullets" style={{ marginTop: "var(--space-8)" }}>
        {rows.map((row) => (
          <li key={row.$id} className="mono">
            {row.title}
          </li>
        ))}
      </ul>
      {error && <p className="mono">{error}</p>}
    </section>
  );
}