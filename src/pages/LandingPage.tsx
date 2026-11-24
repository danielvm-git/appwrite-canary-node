// story: e01s02
import { Link } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";
import { useShellView } from "../hooks/useShellView";

export function LandingPage() {
  useShellView("landing");

  return (
    <div className="view-landing">
      <div className="landing-layout">
        <div className="landing-pane landing-pane--main">
          <main className="landing-hero">
            <h1>Hello World</h1>
            <p className="lead">
              Appwrite Canaries — Node pilot (staging at node-staging.danielvm.net).
            </p>
            <ul className="landing-bullets">
              <li>Production: node.danielvm.net</li>
              <li>Staging: node-staging.danielvm.net</li>
              <li>Console: Auth, Database, Storage slices</li>
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
    </div>
  );
}

function LoginCard() {
  return (
    <div className="card login-card">
      <h2 className="card-title-text">Sign in</h2>
      <p className="login-sub">Mock on landing — use console after enter.</p>
      <Link className="btn btn-primary btn-block" to="/console">
        Enter console
      </Link>
    </div>
  );
}