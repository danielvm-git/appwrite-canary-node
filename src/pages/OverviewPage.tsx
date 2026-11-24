// story: e01s02
export function OverviewPage() {
  const shellPin =
    typeof fetch !== "undefined"
      ? "public/shell/SHELL_PIN"
      : "";
  return (
    <section>
      <h1>Overview</h1>
      <p className="mono">Site version: v{__APP_VERSION__}</p>
      <p className="text-muted">Endpoint: {import.meta.env.VITE_APPWRITE_ENDPOINT || "not configured"}</p>
      <p className="text-muted">Shell pin file: {shellPin}</p>
    </section>
  );
}