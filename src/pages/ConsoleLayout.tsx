// story: e01s02
import { NavLink, Outlet } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";
import { useShellView } from "../hooks/useShellView";

type NavItem = { to: string; label: string; end?: boolean; stub?: boolean };

const groups: { label: string; items: NavItem[] }[] = [
  { label: "Overview", items: [{ to: "/console", label: "Overview", end: true }] },
  {
    label: "Build",
    items: [
      { to: "/console/auth", label: "Auth" },
      { to: "/console/database", label: "Databases" },
      { to: "/console/storage", label: "Storage" },
      { to: "/console/messaging", label: "Messaging", stub: true },
      { to: "/console/functions", label: "Functions", stub: true },
    ],
  },
  { label: "Deploy", items: [{ to: "/console/sites", label: "Sites" }] },
];

function navClass({ isActive }: { isActive: boolean }, stub?: boolean) {
  return ["nav-item", isActive ? "active" : "", stub ? "stub" : ""].filter(Boolean).join(" ");
}

export function ConsoleLayout() {
  useShellView("console");
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6b04b29a…5784";

  return (
    <div className="view-console">
      <header className="console-topbar">
        <div className="console-brand">
          <span className="app-footer-logo" aria-hidden="true">
            B
          </span>
          <span>Canaries</span>
        </div>
        <div className="console-crumb">
          <b>Node scaffold</b> · Scaffold
        </div>
        <div className="top-icons">
          <span className="chip mono" title="Project ID">
            {projectId.length > 14 ? `${projectId.slice(0, 8)}…${projectId.slice(-4)}` : projectId}
          </span>
        </div>
      </header>
      <div className="shell">
        <nav className="sidebar" aria-label="Console">
          <div className="sidebar-nav-scroll">
            {groups.map((group) => (
              <div className="nav-group" key={group.label}>
                <div className="nav-label">{group.label}</div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={(s) => navClass(s, item.stub)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
          <div className="sidebar-settings">
            <NavLink to="/console/settings" className={(s) => navClass(s)}>
              Settings
            </NavLink>
          </div>
        </nav>
        <div className="main">
          <div className="main-scroll">
            <div className="main-inner">
              <Outlet />
            </div>
          </div>
          <AppFooter testId="console-app-footer" />
        </div>
      </div>
    </div>
  );
}