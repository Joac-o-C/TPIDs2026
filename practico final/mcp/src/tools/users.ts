import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_users",
    description: "Lista los usuarios registrados (GET /users, requiere Admin)",
    handler: async () => api.get("/users"),
  },
  {
    name: "update_user_role",
    description:
      "Cambia el rol de un usuario (PATCH /users/:id/role, requiere Admin)",
    inputSchema: {
      id: z.string().uuid(),
      role: z.enum(["user", "admin"]),
    },
    handler: async ({ id, role }: any) =>
      api.patch(`/users/${id}/role`, { role }),
  },
  {
    name: "update_my_password",
    description:
      "Cambia la contraseña del usuario autenticado (PATCH /users/me/password)",
    inputSchema: {
      currentPassword: z.string(),
      newPassword: z.string().min(8),
    },
    handler: async (body: any) => api.patch("/users/me/password", body),
  },
  {
    name: "update_my_email",
    description:
      "Cambia el email del usuario autenticado (PATCH /users/me/email)",
    inputSchema: {
      currentPassword: z.string(),
      newEmail: z.string().email(),
    },
    handler: async (body: any) => api.patch("/users/me/email", body),
  },
] as ToolDef[];
