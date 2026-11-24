// story: e01s02
const REPO = "https://github.com/danielvm-git/appwrite-canary-node";

export function AppFooter({ testId }: { testId: string }) {
  const version = __APP_VERSION__;
  return (
    <footer className="app-footer" data-testid={testId}>
      <span>© 2026 Tasks · Todo API</span>
      <div className="app-footer-meta">
        <span>v{version}</span>
        <span>
          Built with{" "}
          <a className="strong" href="https://github.com/danielvm-git/BigPowers" target="_blank" rel="noreferrer">
            BigPowers
          </a>{" "}
          by{" "}
          <a className="strong" href="https://github.com/danielvm-git" target="_blank" rel="noreferrer">
            danielvm-git
          </a>
        </span>
        <a href={REPO} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={`${REPO}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">
          Changelog
        </a>
      </div>
    </footer>
  );
}
