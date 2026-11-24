// story: todo-app
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";
import { RequireAuth } from "../components/RequireAuth";
import { useSession } from "../hooks/useSession";
import { useShellView } from "../hooks/useShellView";

type NavItem = { to: string; label: string; end?: boolean };

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Tasks",
    items: [
      { to: "/tasks", label: "All tasks", end: true },
      { to: "/lists", label: "Lists" },
    ],
  },
  {
    label: "Account",
    items: [{ to: "/account", label: "Account" }],
  },
];

function navClass({ isActive }: { isActive: boolean }) {
  return ["nav-item", isActive ? "active" : ""].filter(Boolean).join(" ");
}

export function AppLayout() {
  useShellView("console");
  const navigate = useNavigate();
  const { user, signOut } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6b04b29a00127bf05784";

  const name = user?.name || user?.email || "User";
  const initial = name.charAt(0).toUpperCase();

  async function onSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <RequireAuth>
      <div className="view-console">
        <header className="console-topbar">
          <div className="console-brand">
            <span className="app-footer-logo" aria-hidden="true">
              B
            </span>
            <span>Todo</span>
          </div>
          <div className="console-crumb">
            <b>Node canary</b> · Appwrite
          </div>
          <div className="top-icons">
            <span className="chip mono" title="Project ID">
              {projectId.length > 14 ? `${projectId.slice(0, 8)}…${projectId.slice(-4)}` : projectId}
            </span>
            <div className="profile-wrap">
              <button
                type="button"
                className={`profile-trigger${menuOpen ? " open" : ""}`}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <span className="avatar" aria-hidden="true">
                  {initial}
                </span>
                <span className="profile-name">{name}</span>
                <span className="profile-chev">▼</span>
              </button>
              <div className={`profile-menu${menuOpen ? " open" : ""}`} role="menu">
                <div className="profile-menu-head">
                  <span className="avatar">{initial}</span>
                  <div>
                    <strong>{name}</strong>
                    <span>{user?.email ?? ""}</span>
                  </div>
                </div>
                <button type="button" className="menu-item" role="menuitem" onClick={() => navigate("/account")}>
                  Account
                </button>
                <button type="button" className="menu-item menu-signout" role="menuitem" onClick={onSignOut}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="shell">
          <nav className="sidebar" aria-label="Main">
            <div className="sidebar-nav-scroll">
              {groups.map((group) => (
                <div className="nav-group" key={group.label}>
                  <div className="nav-label">{group.label}</div>
                  {group.items.map((item) => (
                    <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
            <div className="sidebar-settings">
              <NavLink to="/settings" className={navClass}>
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
            <AppFooter testId="app-footer" />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}