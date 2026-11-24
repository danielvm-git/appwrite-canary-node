// story: e01s02
import { appwriteConfigured } from "../lib/appwrite";

export function OverviewPage() {
  const configured = appwriteConfigured();
  return (
    <section>
      <h1>Overview</h1>
      <p className="mono">Site version: v{__APP_VERSION__}</p>
      <p className="text-muted">Appwrite: {configured ? "configured" : "not configured"}</p>
      {configured && (
        <p className="text-muted">Slices: auth, database (canary/items), storage (canary-files)</p>
      )}
      <p className="text-muted">Shell pin: public/shell/SHELL_PIN</p>
    </section>
  );
}