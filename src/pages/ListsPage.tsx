import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { createList, deleteList, listListsForUser, type TodoList } from "../lib/lists";

export function ListsPage() {
  const { user, loading } = useSession();
  const userId = user?.$id ?? "";
  const [lists, setLists] = useState<TodoList[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      setLists(await listListsForUser(userId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lists");
    }
  }

  useEffect(() => {
    if (!userId) return;
    void reload();
  }, [userId]);

  async function onCreate(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    await createList(userId, trimmed);
    setName("");
    await reload();
  }

  async function onDelete(list: TodoList) {
    if (!confirm(`Delete list "${list.name}"? Tasks keep their rows but lose the list link.`)) return;
    await deleteList(userId, list.$id);
    await reload();
  }

  if (loading || !user) return null;

  return (
    <section>
      <h1 className="page-title ds-h1">Lists</h1>
      <p className="page-desc">Group tasks by list. Each list is private to your account.</p>

      <form onSubmit={onCreate} className="form-stack card" style={{ padding: "var(--space-6)", marginBottom: "var(--space-8)" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="list-name">
            New list name
          </label>
          <input
            className="input"
            id="list-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Personal"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create list
        </button>
      </form>

      {lists.length === 0 ? (
        <div className="card">
          <p className="page-desc">No lists yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => (
                <tr key={list.$id}>
                  <td>
                    <Link to={`/lists/${list.$id}`}>{list.name}</Link>
                  </td>
                  <td className="mono">{list.$id}</td>
                  <td>
                    <button type="button" className="btn btn-ghost" onClick={() => void onDelete(list)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <p className="mono">{error}</p>}
    </section>
  );
}