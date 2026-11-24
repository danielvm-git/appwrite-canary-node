// story: e01s02
import { useEffect, useState } from "react";

const THEME_KEY = "bigbase-theme";

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
      <h1>Settings</h1>
      <label>
        Theme
        <select value={theme} onChange={(e) => onChange(e.target.value)}>
          <option value="canary">canary</option>
          <option value="default">default (indigo)</option>
        </select>
      </label>
    </section>
  );
}