import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(new URL("..", import.meta.url)));
const dist = path.join(root, "dist");
let version = "dev";
try {
  version = fs.readFileSync(path.join(root, "VERSION"), "utf-8").trim();
} catch {
  /* optional at dev time */
}
fs.mkdirSync(dist, { recursive: true });
const body = JSON.stringify({ status: "ok", version });
fs.writeFileSync(path.join(dist, "health"), body);
fs.writeFileSync(path.join(dist, "health.json"), body);