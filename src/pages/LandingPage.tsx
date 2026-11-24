// story: e01s02
import { Link } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";

export function LandingPage() {
  return (
    <div className="landing-shell">
      <div className="landing-pane landing-pane--marketing">
        <main className="landing-hero">
          <h1>Hello World</h1>
          <p className="lead">Appwrite Canaries — Node pilot on Appwrite Sites.</p>
          <ul>
            <li>Deploy at node.danielvm.net</li>
            <li>Shared shell from appwrite-canary-shell</li>
          </ul>
        </main>
        <footer className="site-footer" aria-label="Marketing links">
          <div className="footer-grid">
            <div>
              <h4>Product</h4>
              <ul>
                <li>
                  <Link to="/console/auth">Auth</Link>
                </li>
                <li>
                  <Link to="/console/database">Database</Link>
                </li>
                <li>
                  <Link to="/console/storage">Storage</Link>
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
  );
}

function LoginCard() {
  return (
    <div className="card login-card">
      <h2>Sign in</h2>
      <p className="text-muted">Mock on landing — use console after enter.</p>
      <Link className="btn btn-primary btn-block" to="/console">
        Enter console
      </Link>
    </div>
  );
}