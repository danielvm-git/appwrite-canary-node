// story: e01s02
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";
import { useSession } from "../hooks/useSession";
import { useShellView } from "../hooks/useShellView";
import { appwriteConfigured, createAccount, newId } from "../lib/appwrite";

export function LandingPage() {
  useShellView("landing");

  return (
    <div className="view-landing">
      <div className="landing-layout">
        <div className="landing-pane landing-pane--main">
          <main className="landing-hero">
            <h1>Todo app</h1>
            <p className="lead">
              Appwrite Canaries — Node reference app with Auth, TablesDB, and Storage.
            </p>
            <ul className="landing-bullets">
              <li>Tasks and lists with owner-only permissions</li>
              <li>File attachments per task</li>
              <li>Hosted at node.danielvm.net</li>
            </ul>
          </main>
          <footer className="site-footer" aria-label="Marketing links">
            <div className="footer-grid">
              <div>
                <h4>Product</h4>
                <ul>
                  <li>
                    <Link to="/tasks">Tasks</Link>
                  </li>
                  <li>
                    <Link to="/lists">Lists</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
          <AppFooter testId="landing-app-footer" />
        </div>
        <aside className="landing-pane landing-pane--auth" aria-label="Sign in">
          <LoginCard />
        </aside>
      </div>
    </div>
  );
}

function LoginCard() {
  const navigate = useNavigate();
  const { user, loading, refresh } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) navigate("/tasks", { replace: true });
  }, [loading, user, navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!appwriteConfigured()) {
      setMessage("Appwrite is not configured");
      return;
    }
    const account = createAccount();
    try {
      if (register) await account.create(newId(), email, password);
      await account.createEmailPasswordSession(email, password);
      await refresh();
      navigate("/tasks");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Sign in failed";
      setMessage(msg.includes("Invalid credentials") ? "Invalid email or password" : msg);
    }
  }

  return (
    <div className="card login-card">
      <h2 className="card-title-text">{register ? "Create account" : "Welcome back"}</h2>
      <p className="login-sub">
        Sign in to <strong>Scaffold</strong> on <span className="mono">appwrite.danielvm.net</span>
      </p>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <label className="input-label" htmlFor="landing-email">
            Email
          </label>
          <input
            className="input"
            id="landing-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="landing-password">
            Password
          </label>
          <input
            className="input"
            id="landing-password"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {register ? "Create account" : "Sign in"}
        </button>
      </form>
      {message && <p className="mono">{message}</p>}
      <p className="login-toggle">
        {register ? "Have an account? " : "New here? "}
        <button type="button" className="btn-link" onClick={() => setRegister(!register)}>
          {register ? "Sign in" : "Create account"}
        </button>
      </p>
    </div>
  );
}