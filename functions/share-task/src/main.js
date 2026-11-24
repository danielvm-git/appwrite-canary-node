import { Client, Query, TablesDB, Users } from "node-appwrite";
import { ShareError, shareTask } from "./share.js";

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  try {
    return JSON.parse(req.bodyText || "{}");
  } catch {
    return {};
  }
}

export default async ({ req, res, log, error }) => {
  if (req.method !== "POST") {
    return res.json({ ok: false, code: "method", message: "Use POST." }, 405);
  }

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers["x-appwrite-key"] ?? "");
  const db = new TablesDB(client);
  const users = new Users(client);
  const body = readBody(req);

  try {
    const result = await shareTask({
      callerId: req.headers["x-appwrite-user-id"],
      taskId: body.taskId,
      email: body.email,
      db,
      findUserByEmail: async (email) => {
        const found = await users.list({ queries: [Query.equal("email", [email]), Query.limit(1)] });
        return found.users[0] ?? null;
      },
    });
    log(JSON.stringify({ level: "info", message: "task shared", taskId: body.taskId }));
    return res.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof ShareError) {
      return res.json({ ok: false, code: err.code, message: err.message }, err.status);
    }
    error(JSON.stringify({ level: "error", message: "share failed", taskId: body.taskId, err: String(err) }));
    return res.json({ ok: false, code: "internal", message: "Could not share the task." }, 500);
  }
};
