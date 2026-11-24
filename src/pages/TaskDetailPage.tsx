import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSession } from "../hooks/useSession";
import {
  attachmentDownloadUrl,
  deleteAttachment,
  uploadAttachment,
} from "../lib/attachments";
import { listListsForUser, type TodoList } from "../lib/lists";
import { createTask, getTask, updateTask, type Task, type TaskStatus } from "../lib/tasks";

export function TaskDetailPage() {
  const { taskId } = useParams();
  const isNew = taskId === "new";
  const navigate = useNavigate();
  const { user, loading } = useSession();
  const userId = user?.$id ?? "";

  const [lists, setLists] = useState<TodoList[]>([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<TaskStatus>("open");
  const [dueDate, setDueDate] = useState("");
  const [listId, setListId] = useState("");
  const [attachmentId, setAttachmentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    void listListsForUser(userId).then(setLists);
  }, [userId]);

  useEffect(() => {
    if (isNew || !taskId) return;
    void (async () => {
      try {
        const task = await getTask(taskId);
        if (task.userId !== userId) {
          setError("Not found");
          return;
        }
        setTitle(task.title);
        setNotes(task.notes ?? "");
        setStatus(task.status ?? "open");
        setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
        setListId(task.listId ?? "");
        setAttachmentId(task.attachmentId ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load task");
      }
    })();
  }, [isNew, taskId, userId]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: title.trim(),
        notes,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : "",
        listId,
        attachmentId,
      };
      let task: Task;
      if (isNew) {
        task = await createTask(userId, payload);
      } else {
        if (!taskId || taskId === "new") {
          setError("Missing task id");
          return;
        }
        task = await updateTask(userId, taskId, payload);
      }
      const savedId = task.$id;
      if (!savedId) {
        setError("Task saved but id is missing in response");
        return;
      }
      navigate(`/tasks/${savedId}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("file") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || isNew) return;
    try {
      if (attachmentId) await deleteAttachment(attachmentId);
      const fileId = await uploadAttachment(userId, file);
      if (!taskId || taskId === "new") return;
      await updateTask(userId, taskId, { attachmentId: fileId });
      setAttachmentId(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  }

  async function onRemoveAttachment() {
    if (!attachmentId || isNew) return;
    try {
      await deleteAttachment(attachmentId);
      if (!taskId || taskId === "new") return;
      await updateTask(userId, taskId, { attachmentId: "" });
      setAttachmentId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    }
  }

  if (loading || !user) return null;

  return (
    <section>
      <h1 className="page-title ds-h1">{isNew ? "New task" : "Edit task"}</h1>
      <p className="page-desc">
        <Link to="/tasks">Back to tasks</Link>
      </p>
      <form onSubmit={onSubmit} className="form-stack card" style={{ padding: "var(--space-6)" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="task-title">
            Title
          </label>
          <input
            className="input"
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="task-notes">
            Notes
          </label>
          <textarea
            className="input"
            id="task-notes"
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="task-status">
            Status
          </label>
          <select className="input" id="task-status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="task-due">
            Due date
          </label>
          <input
            className="input"
            id="task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="task-list">
            List
          </label>
          <select className="input" id="task-list" value={listId} onChange={(e) => setListId(e.target.value)}>
            <option value="">Inbox</option>
            {lists.map((l) => (
              <option key={l.$id} value={l.$id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </form>

      {!isNew && (
        <div className="card form-stack">
          <h3 className="card-title-text">Attachment</h3>
          {attachmentId ? (
            <p className="page-desc">
              <a href={attachmentDownloadUrl(attachmentId)} target="_blank" rel="noreferrer">
                Download file
              </a>
              <button type="button" className="btn btn-ghost" onClick={() => void onRemoveAttachment()}>
                Remove
              </button>
            </p>
          ) : (
            <p className="page-desc">No file attached (pdf, png, jpg, txt up to 5 MB).</p>
          )}
          <form onSubmit={onUpload} className="form-stack">
            <input className="input" name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" />
            <button type="submit" className="btn btn-secondary">
              Upload
            </button>
          </form>
        </div>
      )}

      {error && <p className="mono">{error}</p>}
    </section>
  );
}