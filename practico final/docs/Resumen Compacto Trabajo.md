# Resumen Compacto: Trabajo Práctico Final Full-Stack & MCP

## 1. Contexto y Arquitectura
* **Backend:** NestJS + PostgreSQL (`http://localhost:3000`). Usa `class-validator` y tokens con `crypto.randomUUID()`.
* **Frontend:** Angular 17+ (`http://localhost:4200`). Componentes *standalone*, inyección vía `inject()`, estados con *Signals*, y Bootstrap 5.
* **MCP (Model Context Protocol):** Protocolo abierto (JSON-RPC 2.0) sobre `stdio` o `SSE`. El servidor expone la API de NestJS como herramientas (*tools*) validadas con `zod` para entornos como *opencode*.

---

## 2. Requerimientos para Aprobar (Flujos de Auth & Perfil)

### 2.1 Verificación de Email
* **Backend:**
  * Extender `UserEntity` con `isVerified: boolean (default false)` y `verificationToken: string | null`.
  * `POST /auth/register`: Genera token, guarda y envía link (`http://localhost:4200/verify-email?token=<token>`) sin retornar el token en la respuesta.
  * `POST /auth/verify-email`: Body `{ token }`. Valida, cambia a `true` y limpia el token.
  * `POST /auth/resend-verification` (Protegido JWT): Regenera y reenvía.
  * `GET /auth/me`: Incluir `isVerified`.
* **Frontend:**
  * Vista `/verify-pending`: Cartel de aviso y botón de reenvío. Redirigir aquí tras registrarse.
  * Vista `/verify-email`: Lee token de la URL, impacta al backend, muestra éxito (link a `/login`) o error.
  * `profile.html`: Badge de estado. Si no está verificado, habilitar reenvío.

### 2.2 Recuperación de Contraseña
* **Backend:**
  * Agregar `resetPasswordToken: string | null` y `resetPasswordExpires: Date | null` a la entidad.
  * `POST /auth/forgot-password`: Body `{ email }`. Si existe, genera token y expira en 1 hora. Envía link (`http://localhost:4200/reset-password?token=<token>`). Respuesta genérica opaca por seguridad.
  * `POST /auth/reset-password`: Body `{ token, password }`. Verifica expiración, hashea y limpia campos.
* **Frontend:**
  * Vista `/forgot-password`: Input de email y envío. Link desde el login.
  * Vista `/reset-password`: Formulario con nueva contraseña y confirmación (mínimo 8 caracteres).

### 2.3 Perfil y Toasts
* **Modificaciones en Perfil:** Formularios para cambiar contraseña (`PATCH /users/me/password`) y cambiar email (`PATCH /users/me/email`). Ambos requieren ingresar contraseña actual.
* **Notificaciones:** Crear `toast.service.ts` y componente auto-destructible para alertar éxitos y errores en todos los flujos sustituyendo los mensajes locales.
* **Servicio de Email:** Configurar `back/.env` con proveedor real (`RESEND_API_KEY` o SMTP de Mailtrap). Prohibido usar mocks o consola.

---

## 3. Requerimientos para Promocionar (Servidor MCP)
Implementar herramientas en `mcp/src/tools/` usando la estructura base compartida y exportarlas en el índice:

### 3.1 Herramientas a Desarrollar (Estructura Objeto: `name`, `description`, `inputSchema`, `handler`)
1. **`products.ts` (CRUD):**
   * `list_products` (`GET /products` | Filtros: `name`, `sortBy`, `order`, `page`, `limit`)
   * `get_product` (`GET /products/:id`)
   * `create_product` (`POST /products` | Requiere Admin)
   * `update_product` (`PUT /products/:id` | Requiere Admin)
   * `delete_product` (`DELETE /products/:id` | Requiere Admin)
2. **`categories.ts` (CRUD):**
   * `list_categories` (`GET /categories`)
   * `get_category` (`GET /categories/:id`)
   * `create_category` (`POST /categories` | Requiere Admin)
   * `update_category` (`PUT /categories/:id` | Requiere Admin)
   * `delete_category` (`DELETE /categories/:id` | Requiere Admin)
3. **`users.ts`:**
   * `list_users` (`GET /users` | Requiere Admin)
   * `update_user_role` (`PATCH /users/:id/role` | Requiere Admin)
   * `update_my_password` (`PATCH /users/me/password`)
   * `update_my_email` (`PATCH /users/me/email`)

### 3.2 Configuración de opencode (`opencode.json`)
```json
"mcp": {
  "back": {
    "type": "local",
    "command": ["npx", "tsx", "mcp/src/index.ts"],
    "enabled": true,
    "environment": {
      "API_C_URL": "http://localhost:3000",
      "API_C_EMAIL": "admin@mail.com",
      "API_C_PASSWORD": "12345678"
    }
  }
}
## 4. Especificación Técnica de Endpoints (API)
4.1 Products

    GET /products: Retorna lista paginada. Params: name (string), sortBy (string), order (ASC|DESC), page (number), limit (number).

    GET /products/:id: Retorna detalle de producto o 404.

    POST /products: Body { name, description, price, stock, categoryId }. (Admin)

    PUT /products/:id: Body parcial de actualización. (Admin)

    DELETE /products/:id: Eliminación física/lógica. (Admin)

4.2 Categories

    GET /categories: Lista todas las categorías de la DB.

    GET /categories/:id: Detalle de categoría.

    POST /categories: Body { name, description }. (Admin)

    PUT /categories/:id: Modifica campos. (Admin)

    DELETE /categories/:id: Remueve categoría. (Admin)

4.3 Users & Me

    GET /users: Lista de usuarios registrados. (Admin)

    PATCH /users/:id/role: Body { role: 'admin' | 'user' }. (Admin)

    PATCH /users/me/password: Body { currentPassword, newPassword }. (Auth)

    PATCH /users/me/email: Body { currentPassword, newEmail }. (Auth)

5. Estructura de Entrega (desarrollo-N.zip)

    back/ (NestJS modificado)

    front/ (Angular modificado)

    mcp/ (Servidor MCP completo, solo si promociona)

    Nota: Excluir siempre node_modules/, dist/ y archivos .env.
