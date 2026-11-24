import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { listListsForUser, type TodoList } from "../lib/lists";
import { clientLog } from "../lib/log";
import {
  countTasksByStatus,
  deleteTask,
  listTasksForUser,
  toggleTaskStatus,
  type Task,
  type TaskStatus,
} from "../lib/tasks";

export function TasksPage() {
  const { listId: listIdParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading } = useSession();
  const userId = user?.$id ?? "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [counts, setCounts] = useState({ open: 0, done: 0 });
  const [error, setError] = useState<string | null>(null);

  const statusFilter = (searchParams.get("status") as TaskStatus | null) ?? undefined;
  const search = searchParams.get("q") ?? "";
  const listId = listIdParam ?? searchParams.get("listId") ?? undefined;

  const listName = useMemo(
    () => lists.find((l) => l.$id === listId)?.name,
    [lists, listId],
  );

  async function reload() {
    if (!userId) return;
    try {
      const [taskRows, listRows, statusCounts] = await Promise.all([
        listTasksForUser(userId, { listId, status: statusFilter, search }),
        listListsForUser(userId),
        countTasksByStatus(userId),
      ]);
      setTasks(taskRows);
      setLists(listRows);
      setCounts(statusCounts);
      setError(null);
    } catch (err) {
      clientLog.error("tasks list failed", err, { operation: "listTasksForUser" });
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    }
  }

  useEffect(() => {
    if (!userId) return;
    void reload();
  }, [userId, listId, statusFilter, search]);

  function onFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = new URLSearchParams();
    const q = String(data.get("q") ?? "").trim();
    const status = String(data.get("status") ?? "");
    const list = String(data.get("listId") ?? "");
    if (q) next.set("q", q);
    if (status) next.set("status", status);
    if (list && !listIdParam) next.set("listId", list);
    setSearchParams(next);
  }

  async function onToggle(task: Task) {
    await toggleTaskStatus(userId, task);
    await reload();
  }

  async function onDelete(task: Task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await deleteTask(userId, task.$id);
    await reload();
  }

  const heading = listIdParam && listName ? `Tasks in ${listName}` : "All tasks";

  if (loading || !user) return null;

  return (
    <section>
      <h1 className="page-title ds-h1">{heading}</h1>
      <p className="page-desc">Your tasks stored in Appwrite TablesDB (owner-only row permissions).</p>

      <div className="stats" style={{ marginBottom: "var(--space-8)" }}>
        <div className="stat card">
          <span className="stat-label">Open</span>
          <span className="stat-value">{counts.open}</span>
        </div>
        <div className="stat card">
          <span className="stat-label">Done</span>
          <span className="stat-value">{counts.done}</span>
        </div>
        <div className="stat card">
          <span className="stat-label">Lists</span>
          <span className="stat-value">{lists.length}</span>
        </div>
      </div>

      <form onSubmit={onFilter} className="form-stack" style={{ marginBottom: "var(--space-8)" }}>
        <div className="row" style={{ flexWrap: "wrap", gap: "var(--space-4)" }}>
          <div className="input-group" style={{ flex: "1 1 200px" }}>
            <label className="input-label" htmlFor="task-search">
              Search
            </label>
            <input
              className="input"
              id="task-search"
              name="q"
              defaultValue={search}
              placeholder="Title…"
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="task-status">
              Status
            </label>
            <select className="input" id="task-status" name="status" defaultValue={statusFilter ?? ""}>
              <option value="">Any</option>
              <option value="open">Open</option>
              <option value="done">Done</option>
            </select>
          </div>
          {!listIdParam && (
            <div className="input-group">
              <label className="input-label" htmlFor="task-list">
                List
              </label>
              <select className="input" id="task-list" name="listId" defaultValue={listId ?? ""}>
                <option value="">All lists</option>
                {lists.map((l) => (
                  <option key={l.$id} value={l.$id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button type="submit" className="btn btn-secondary" style={{ alignSelf: "flex-end" }}>
            Apply
          </button>
          <Link className="btn btn-primary" style={{ alignSelf: "flex-end" }} to="/tasks/new">
            New task
          </Link>
        </div>
      </form>

      {tasks.length === 0 ? (
        <div className="card">
          <p className="page-desc">No tasks yet. Create one or pick another filter.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>List</th>
                <th>Due</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.$id}>
                  <td>
                    {task.$id ? (
                      <Link to={`/tasks/${task.$id}`}>{task.title}</Link>
                    ) : (
                      <span>{task.title}</span>
                    )}
                  </td>
                  <td>{task.status}</td>
                  <td className="mono">{task.listId || "—"}</td>
                  <td className="mono">{task.dueDate ? task.dueDate.slice(0, 10) : "—"}</td>
                  <td>
                    <button type="button" className="btn btn-ghost" onClick={() => void onToggle(task)}>
                      {task.status === "done" ? "Reopen" : "Done"}
                    </button>
                    <button type="button" className="btn btn-ghost" onClick={() => void onDelete(task)}>
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