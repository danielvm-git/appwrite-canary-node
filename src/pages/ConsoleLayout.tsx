// story: e01s02
import { NavLink, Outlet } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";

const nav = [
  { to: "/console", label: "Overview", end: true },
  { to: "/console/auth", label: "Auth" },
  { to: "/console/database", label: "Database" },
  { to: "/console/storage", label: "Storage" },
  { to: "/console/messaging", label: "Messaging" },
  { to: "/console/functions", label: "Functions" },
  { to: "/console/sites", label: "Sites" },
  { to: "/console/settings", label: "Settings" },
];

export function ConsoleLayout() {
  return (
    <div className="console-shell">
      <header className="topbar">
        <span className="topbar-title">Scaffold · Node</span>
      </header>
      <div className="console-body">
        <nav className="sidebar" aria-label="Console">
          <ul className="sidebar-nav">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <MainPanel />
      </div>
    </div>
  );
}

function MainPanel() {
  return (
    <div className="layout-body">
      <main className="content">
        <Outlet />
      </main>
      <AppFooter testId="console-app-footer" />
    </div>
  );
}