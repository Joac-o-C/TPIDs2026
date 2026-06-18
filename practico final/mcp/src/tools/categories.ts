import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_categories",
    description: "Lista todas las categorías (GET /categories)",
    handler: async () => api.get("/categories"),
  },
  {
    name: "get_category",
    description: "Obtiene el detalle de una categoría por id (GET /categories/:id)",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.get(`/categories/${id}`),
  },
  {
    name: "create_category",
    description: "Crea una categoría (POST /categories, requiere Admin)",
    inputSchema: { name: z.string().min(2).max(100) },
    handler: async (body: any) => api.post("/categories", body),
  },
  {
    name: "update_category",
    description: "Actualiza una categoría (PUT /categories/:id, requiere Admin)",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().min(2).max(100),
    },
    handler: async ({ id, ...body }: any) => api.put(`/categories/${id}`, body),
  },
  {
    name: "delete_category",
    description: "Elimina una categoría (DELETE /categories/:id, requiere Admin)",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.del(`/categories/${id}`),
  },
] as ToolDef[];
