// story: e01s02
import { Link } from "react-router-dom";
import { appwriteConfigured } from "../lib/appwrite";

export function OverviewPage() {
  const configured = appwriteConfigured();
  return (
    <section>
      <h1 className="page-title ds-h1">Overview</h1>
      <p className="page-desc">
        Canary Node — layout “pelado” com integrações Appwrite mínimas (MVP A).
      </p>
      <div className="stats">
        <div className="stat">
          <label>Version</label>
          <strong className="mono">v{__APP_VERSION__}</strong>
        </div>
        <div className="stat">
          <label>Appwrite</label>
          <strong>{configured ? "configured" : "not configured"}</strong>
        </div>
        <div className="stat">
          <label>Deploy target</label>
          <strong style={{ fontSize: 13 }}>node.danielvm.net</strong>
        </div>
        <div className="stat">
          <label>Runtime</label>
          <strong>Node</strong>
        </div>
      </div>
      <div className="card">
        <h3>Get started</h3>
        <p className="page-desc">
          Use a sidebar para Auth, Databases e Storage (live). Messaging e Functions são stubs.
        </p>
        <div className="row">
          <Link className="btn btn-primary" to="/console/auth">
            Open Auth
          </Link>
          <Link className="btn btn-secondary" to="/console/database">
            Open Databases
          </Link>
        </div>
      </div>
    </section>
  );
}