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
      <h1>Auth</h1>
      <form onSubmit={onSubmit} className="stack">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Sign in
        </button>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </form>
      {message && <p className="mono">{message}</p>}
    </section>
  );
}