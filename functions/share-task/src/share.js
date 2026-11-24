export class ShareError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const EMAIL = /^\S+@\S+\.\S+$/;

function ownerPermissions(userId) {
  return [`read("user:${userId}")`, `update("user:${userId}")`, `delete("user:${userId}")`];
}

/**
 * Share a task row with another user by email.
 * Clients cannot grant `user:<other>` permissions, so this runs with a server key.
 */
export async function shareTask({
  callerId,
  taskId,
  email,
  db,
  findUserByEmail,
  databaseId = "todo",
  tableId = "tasks",
}) {
  if (!callerId) throw new ShareError("unauthorized", "Sign in to share tasks.", 401);
  const target = String(email ?? "").trim().toLowerCase();
  if (!taskId) throw new ShareError("invalid", "Missing task id.");
  if (!EMAIL.test(target)) throw new ShareError("invalid", "Enter a valid email.");

  let row;
  try {
    row = await db.getRow({ databaseId, tableId, rowId: taskId });
  } catch (err) {
    if (err?.code === 404) throw new ShareError("not_found", "Task not found.", 404);
    throw err;
  }
  if (row.userId !== callerId) {
    throw new ShareError("forbidden", "Only the owner can share this task.", 403);
  }

  const user = await findUserByEmail(target);
  if (!user) throw new ShareError("no_user", "No user with that email.", 404);
  if (user.$id === callerId) throw new ShareError("self", "That’s you.");

  const sharedWith = row.sharedWith ?? [];
  if (sharedWith.includes(user.$id)) throw new ShareError("already", "Already shared.", 409);

  const nextWith = [...sharedWith, user.$id];
  const nextNames = [...(row.sharedNames ?? []), user.name || target.split("@")[0]];
  const permissions = [
    ...new Set([
      ...(row.$permissions ?? []),
      ...ownerPermissions(row.userId),
      `read("user:${user.$id}")`,
      `update("user:${user.$id}")`,
    ]),
  ];

  await db.updateRow({
    databaseId,
    tableId,
    rowId: taskId,
    data: { sharedWith: nextWith, sharedNames: nextNames },
    permissions,
  });
  return { sharedWith: nextWith, sharedNames: nextNames };
}
