// Shared user-account type — the admin "Users management" screen
// (/dashboard/admin/users) and any future user-related views read this.
// Shape mirrors the documents in the `user` collection (better-auth managed).

import type { Role } from "./dashboard"

export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  /** Pro-plan flag written by the payment flow. */
  premium?: boolean;
  createdAt: string;
  updatedAt: string;
}
