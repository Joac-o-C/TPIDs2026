import { z } from "zod";
import { api } from "../api-client";
import type { ToolDef } from "../tool-factory";

export default [
  {
    name: "list_products",
    description:
      "Lista productos con filtro por nombre, orden y paginación (GET /products)",
    inputSchema: {
      name: z.string().optional(),
      sortBy: z.enum(["id", "name", "price", "stock"]).optional(),
      order: z.enum(["asc", "desc", "ASC", "DESC"]).optional(),
      page: z.number().int().positive().optional(),
      limit: z.number().int().positive().optional(),
    },
    handler: async (params: any) => api.get("/products", { params }),
  },
  {
    name: "get_product",
    description: "Obtiene el detalle de un producto por id (GET /products/:id)",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.get(`/products/${id}`),
  },
  {
    name: "create_product",
    description: "Crea un producto (POST /products, requiere Admin)",
    inputSchema: {
      name: z.string().min(2).max(100),
      price: z.number().positive(),
      stock: z.number().int().nonnegative(),
      categoryId: z.number().int().positive(),
    },
    handler: async (body: any) => api.post("/products", body),
  },
  {
    name: "update_product",
    description: "Actualiza un producto (PUT /products/:id, requiere Admin)",
    inputSchema: {
      id: z.number().int().positive(),
      name: z.string().min(2).max(100).optional(),
      price: z.number().positive().optional(),
      stock: z.number().int().nonnegative().optional(),
      categoryId: z.number().int().positive().optional(),
    },
    handler: async ({ id, ...body }: any) => api.put(`/products/${id}`, body),
  },
  {
    name: "delete_product",
    description: "Elimina un producto (DELETE /products/:id, requiere Admin)",
    inputSchema: { id: z.number().int().positive() },
    handler: async ({ id }: any) => api.del(`/products/${id}`),
  },
] as ToolDef[];
