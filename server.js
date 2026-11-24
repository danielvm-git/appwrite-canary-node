// story: e01s04
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pino from "pino";
import pinoHttp from "pino-http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const app = express();
app.use(pinoHttp({ logger }));

function readVersion() {
  try {
    return fs.readFileSync(path.join(__dirname, "VERSION"), "utf-8").trim();
  } catch {
    return "dev";
  }
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: readVersion() });
});

const dist = path.join(__dirname, "dist");
app.use(express.static(dist));
app.get(/^(?!\/health).*/, (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => logger.info({ port, version: readVersion() }, "listening"));