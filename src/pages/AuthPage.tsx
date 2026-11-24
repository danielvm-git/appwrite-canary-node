// story: e01s03
import { FormEvent, useState } from "react";
import { createAccount, appwriteConfigured } from "../lib/appwrite";

export function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!appwriteConfigured()) {
      setMessage("Set VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID");
      return;
    }
    const account = createAccount();
    try {
      await account.createEmailPasswordSession(email, password);
      setMessage("Session created");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Auth failed";
      setMessage(msg.includes("Invalid credentials") ? "Invalid email or password" : msg);
    }
  }

  async function logout() {
    if (!appwriteConfigured()) return;
    const account = createAccount();
    await account.deleteSession("current");
    setMessage("Logged out");
  }

  return (
    <section>
      <h1 className="page-title ds-h1">Auth</h1>
      <p className="page-desc">Email/password session against project Scaffold.</p>
      <form onSubmit={onSubmit} className="form-stack">
        <div className="input-group">
          <label className="input-label" htmlFor="auth-email">
            Email
          </label>
          <input
            className="input"
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="auth-password">
            Password
          </label>
          <input
            className="input"
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="row">
          <button type="submit" className="btn btn-primary">
            Sign in
          </button>
          <button type="button" className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </form>
      {message && <p className="mono">{message}</p>}
    </section>
  );
}