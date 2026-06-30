# TPIDs2026
trabajo práctico integrador desarrollo de software 2026 - grupo x

En este repositorio se encuentra el MVP de **Frontend API**: una aplicación de gestión básica de stock de productos con envío de emails y una capa MCP para operar la API desde un asistente de IA LLM de manera más natural.

## 1. Arquitectura general

```
practico final/
├── back/     API REST — NestJS 11 + TypeORM + PostgreSQL
├── front/    SPA — Angular 21 (standalone components)
├── mcp/      Servidor MCP (herramientas sobre la API)
└── docs/     Documentación
```
## 2. Endpoints

### `/auth`

| Método | Ruta | Auth |
|--------|------|------|
| POST | `/auth/register` | público |
| POST | `/auth/login` | público |
| GET | `/auth/me` | JWT |
| POST | `/auth/verify-email` | público |
| POST | `/auth/resend-verification` | JWT |
| POST | `/auth/forgot-password` | público |
| POST | `/auth/reset-password` | público |

---

### `/users`

Todos requieren **JWT**:

| Método | Ruta | Rol |
|--------|------|-----|
| DELETE | `/users/me` | user |
| PATCH | `/users/me/password` | user |
| PATCH | `/users/me/email` | user |
| GET | `/users` | **admin** |
| PATCH/PUT | `/users/:id/role` | **admin** |

---

### `/products`

| Operación | Auth |
|-----------|------|
| `GET /products?name=&sortBy=&order=&page=&limit=` (listado paginado) | público |
| `GET /products/:id` | público |
| `PATCH /products/:id/stock` (descuenta stock validando disponibilidad) | público |
| `POST` / `PUT` / `DELETE /products/:id` | **admin** (JWT + rol admin → 403 para user) |

> El listado paginado responde `{ items, total, page, limit, totalPages }`.

### `/categories`

Todas las rutas requieren **JWT** (sin token → 401):

| Operación | Auth |
|-----------|------|
| `GET /categories` · `GET /categories/:id` · `GET /categories/:id/products` (paginado) | JWT |
| `POST` / `PUT` / `DELETE /categories/:id` | **admin** (→ 403 para user) |

- `POST /categories` con nombre duplicado → **409**.
- `DELETE /categories/:id` → **200**: desasocia sus productos (`categoryId = null`, no los elimina) y borra la categoría.

> `GET /auth/me` incluye `createdAt` del usuario.
> `PATCH/PUT /users/:id/role` → **403** si un admin intenta cambiar su propio rol.

---

## 3. Cómo levantar el proyecto

```bash
# 1. Base de datos
cd "practico final/back"
docker compose up -d        # Postgres en localhost:5433

# 2. Backend
npm install
npm run seed                # datos de prueba (opcional)
npm start                   # API en http://localhost:3000

# 3. Frontend
cd ../front
npm install && npm start    # SPA en http://localhost:4200
```

> `back/.env` debe tener **`DB_PORT=5433`** (el compose mapea `5433:5432`).

---

## 4. Datos de prueba — `npm run seed`

4 categorías · 9 productos · 2 usuarios verificados (idempotente)

| Email | Password | Rol |
|-------|----------|-----|
| `admin@tpids.local` | `Admin123!` | admin |
| `user@tpids.local` | `User123!` | user |

---

## 5. Variables de entorno (`back/.env`)

| Variable | Descripción |
|----------|-------------|
| `BCRYPT_COST` | Rounds de bcrypt (default 12) |
| `DB_HOST/PORT/USER/PASSWORD/NAME` | Conexión Postgres (`DB_PORT=5433` con Docker) |
| `JWT_SECRET` | Secreto de firma JWT (obligatorio) |
| `JWT_EXPIRES_SEC` | Expiración del token (default 3600) |
| `CORS_ORIGIN` / `FRONTEND_URL` | Origen del front / base para emails |
| `MAIL_HOST/PORT/USER/PASS/FROM` | SMTP (Mailtrap sandbox) |

---

Documentación completa en `docs/INFORME-PROYECTO.md`


