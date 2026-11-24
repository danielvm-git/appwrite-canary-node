// story: e01s02
export function AppFooter({ testId }: { testId: string }) {
  const version = __APP_VERSION__;
  return (
    <footer className="app-footer" data-testid={testId}>
      <div className="app-footer-brand">
        <span className="app-footer-logo" aria-hidden="true">
          B
        </span>
        <span>© 2026 Appwrite Canaries · MIT</span>
      </div>
      <div className="app-footer-meta">
        <span className="mono version-tag">v{version}</span>
        <span className="app-footer-sep" aria-hidden="true" />
        <span>
          Built with{" "}
          <a href="https://github.com/danielvm-git/bigpowers" target="_blank" rel="noreferrer">
            BigPowers
          </a>{" "}
          by{" "}
          <a href="https://github.com/danielvm-git" target="_blank" rel="noreferrer">
            danielvm-git
          </a>
        </span>
        <span className="app-footer-sep" aria-hidden="true" />
        <a href="https://github.com/danielvm-git/appwrite-canary-node" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}