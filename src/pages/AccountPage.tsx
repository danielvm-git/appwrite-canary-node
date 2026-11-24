import { useNavigate } from "react-router-dom";
import { useSession } from "../hooks/useSession";

export function AccountPage() {
  const { user, signOut } = useSession();
  const navigate = useNavigate();

  if (!user) return null;

  async function onSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <section>
      <h1 className="page-title ds-h1">Account</h1>
      <p className="page-desc">Signed in with Appwrite Auth (email and password).</p>
      <div className="card form-stack" style={{ padding: "var(--space-6)" }}>
        <div className="input-group">
          <span className="input-label">Name</span>
          <p>{user.name || "—"}</p>
        </div>
        <div className="input-group">
          <span className="input-label">Email</span>
          <p className="mono">{user.email}</p>
        </div>
        <div className="input-group">
          <span className="input-label">User ID</span>
          <p className="mono">{user.$id}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => void onSignOut()}>
          Sign out everywhere
        </button>
      </div>
    </section>
  );
}