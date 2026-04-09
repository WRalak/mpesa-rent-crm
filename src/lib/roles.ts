export const roles = ["ADMIN", "LANDLORD"] as const;
export type AppRole = (typeof roles)[number];

export function isAdmin(role?: string | null) {
  return role === "ADMIN";
}
