import { describe, expect, it } from "vitest";
import { ownerPermissions } from "./permissions";

describe("ownerPermissions", () => {
  it("grants read update delete for the user role", () => {
    const perms = ownerPermissions("abc123");
    expect(perms).toHaveLength(3);
    expect(perms.every((p) => p.includes("user:abc123"))).toBe(true);
  });
});