import { useLayoutEffect } from "react";

export function useShellView(view: "console" | "landing") {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-accent", "canary");
    root.setAttribute("data-theme", "dark");
    document.body.setAttribute("data-view", view);
    return () => {
      document.body.removeAttribute("data-view");
    };
  }, [view]);
}