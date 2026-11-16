import type { User } from "@/lib/types/user"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

// Get every registered user — the admin "Users management" screen reads this.
export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/users`)

  if (!response.ok) return []

  return response.json()
}

// Update user role
export const updateUserRole = async (id: string, role: string) => {
  const response = await fetch(`${BASE_URL}/users/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  return response.json();
};
