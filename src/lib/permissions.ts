import { isAdmin } from "@/lib/roles";

export type Permission =
  | "tenants:read"
  | "tenants:write"
  | "payments:read"
  | "payments:write"
  | "reports:read"
  | "admin:read";

const landlordPermissions: Permission[] = [
  "tenants:read",
  "tenants:write",
  "payments:read",
  "payments:write",
  "reports:read",
];

const adminPermissions: Permission[] = [...landlordPermissions, "admin:read"];

export function getPermissions(role?: string | null): Permission[] {
  return isAdmin(role) ? adminPermissions : landlordPermissions;
}

export function hasPermission(role: string | null | undefined, permission: Permission) {
  return getPermissions(role).includes(permission);
}
