import { useEffect, useState } from "react";

const THEME_KEY = "bigbase-theme";

const canaryHosts = [
  { name: "Node", url: "https://node.danielvm.net" },
  { name: "Python", url: "https://python.danielvm.net" },
  { name: "PHP", url: "https://php.danielvm.net" },
  { name: "Go", url: "https://go.danielvm.net" },
];

export function SettingsPage() {
  const [theme, setTheme] = useState("canary");

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) setTheme(saved);
  }, []);

  function onChange(next: string) {
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    document.documentElement.dataset.accent = next === "default" ? "indigo" : next;
  }

  return (
    <section>
      <h1 className="page-title ds-h1">Settings</h1>
      <p className="page-desc">Shell accent and deploy targets for the canary program.</p>
      <div className="input-group form-stack">
        <label className="input-label" htmlFor="theme-accent">
          Theme accent
        </label>
        <select className="input" id="theme-accent" value={theme} onChange={(e) => onChange(e.target.value)}>
          <option value="canary">canary</option>
          <option value="default">default (indigo)</option>
        </select>
      </div>
      <h2 className="card-title-text" style={{ marginTop: "var(--space-8)" }}>
        Canary sites
      </h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Runtime</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {canaryHosts.map((h) => (
              <tr key={h.url}>
                <td>{h.name}</td>
                <td>
                  <a href={h.url} target="_blank" rel="noreferrer">
                    {h.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="page-desc mono" style={{ marginTop: "var(--space-6)" }}>
        TablesDB: todo/lists, todo/tasks · Storage: task-attachments
      </p>
    </section>
  );
}