# Análisis de estado del proyecto — TPIDs2026

> Fecha del análisis: 2026-06-17
> Alcance: backend `api-c` (NestJS) y su contrato con `front` (Angular) y `mcp`.
> Documento de diagnóstico para acción futura.

## Actualización 2026-06-18

- **Base de datos migrada a PostgreSQL** (antes SQLite). Driver `pg`, config por
  `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME`, `docker-compose.yml` para levantarla.
- **Bugs de contrato #1 a #7: RESUELTOS y verificados** (login con user, `GET /auth/me`,
  `PUT /categories/:id`, `GET /categories` como array, `sortBy`+orden case-insensitive,
  `DELETE /users/me`, y categorías persistidas en Postgres).

El veredicto original (abajo) queda como registro histórico del diagnóstico del 2026-06-17.

## Actualización 2026-06-18 (flujos de auth/perfil + MCP)

### Aprobar — COMPLETO

- **2.1 Verificación de email** y **2.2 Recuperación de contraseña**: entidad con
  `isVerified`/`verificationToken`/`resetPasswordToken`/`resetPasswordExpires`; endpoints
  `POST /auth/verify-email | resend-verification (JWT) | forgot-password (respuesta opaca) |
  reset-password (token expira en 1h)`; `MailModule`/`MailService` (nodemailer SMTP vía
  Mailtrap sandbox). `GET /auth/me` incluye `isVerified`. Front: vistas `/verify-pending`,
  `/verify-email`, `/forgot-password`, `/reset-password`; register redirige a `/verify-pending`;
  badge + reenvío en el perfil.
- **2.3 Perfil + Toasts**:
  - Backend: `PATCH /users/me/password` y `PATCH /users/me/email` (ambos validan
    `currentPassword` con bcrypt). El cambio de email **re-verifica** (`isVerified=false`,
    nuevo `verificationToken`) y manda verificación al nuevo correo; el envío va en try/catch
    para ser resiliente al rate-limit de Mailtrap (el email ya quedó cambiado → responde 200).
    `UsersController` inyecta `MailService` (se agregó `MailModule` a `users.module.ts`).
  - Front: `shared/toast/` (`toast.service` con signal + `toast-container` Bootstrap
    auto-destructible, montado en `app.html`); formularios de cambio de password/email en el
    perfil; migrados a toasts login, register, forgot/reset-password, verify-pending, profile,
    admin-users, categories y products. `verify-email` mantiene su UI de página de 3 estados;
    `forgot/reset-password` conservan su panel de éxito persistente.

### Promocionar (MCP) — COMPLETO

- Servidor MCP en `mcp/` (TypeScript, `@modelcontextprotocol/sdk`, axios singleton con
  auto-login admin por env, `registerToolSet`/`ToolDef` con **zod**). Tools en
  `mcp/src/tools/`: `auth.ts` (login/register/me/delete_my_account), `products.ts` y
  `categories.ts` (CRUD), `users.ts` (`list_users`, `update_user_role`, `update_my_password`,
  `update_my_email`) — **18 tools** registradas en `tools/index.ts`. Config en `opencode.json`
  (auto-login `admin@mail.com`/`12345678`). Se agregó `mcp/.gitignore` (node_modules, dist, .env).
- Verificado por stdio: auto-login OK, `tools/list` = 18, y calls a `list_categories`,
  `list_products` (paginado + `sortBy`/`order`) y `list_users` responden correctamente.

### Pendiente para la entrega (no funcional, packaging)

- [ ] Renombrar `api-c/` → `back/` al armar el zip (la consigna §5 pide `back/`, `front/`, `mcp/`).
- [ ] Excluir `node_modules/`, `dist/` y `.env` del zip (ya cubierto por los `.gitignore`).
- [ ] (Opcional) Alinear el nombre del MCP en `opencode.json` (`api-productos`) con el `back`
      sugerido en la consigna §3.2 — es cosmético, no afecta el funcionamiento.

## Veredicto

**El proyecto NO está terminado end-to-end.**

El backend `api-c` **compila y arranca** correctamente, y cada módulo está completo de
forma aislada (controllers, services y validaciones presentes; sin TODOs, código
comentado ni métodos sin implementar). Sin embargo, el **contrato entre el front
Angular y el backend tiene varias roturas**: el front llama endpoints y usa parámetros
o formas de respuesta que el backend no expone tal cual. Conectados, fallarían varias
funciones (restaurar sesión, login, editar/listar categorías, ordenar productos).

## Stack

- **Backend (`api-c`)**: NestJS 11 + TypeORM + **PostgreSQL** (driver `pg`), Passport-JWT,
  bcrypt, class-validator. Puerto `3000`. `synchronize: true` (sin migraciones).
  Variables de entorno: `BCRYPT_COST`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`,
  `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_SEC`. Postgres vía `docker-compose.yml`.
- **Front**: Angular (standalone). URL base `http://localhost:3000` (`environment.ts`).
- **MCP**: servidor MCP en TypeScript. URL base `API_C_URL` (default `http://localhost:3000`).

## Estado por módulo (backend)

| Módulo | Estado | Notas |
|--------|--------|-------|
| auth | Completo | register, login, JWT strategy, guards y roles. |
| users | Completo | CRUD, hash bcrypt, gestión de rol (GET/PATCH/PUT). Primer usuario = ADMIN. |
| products | Completo | CRUD, búsqueda por nombre, orden, paginación, reduce stock. |
| categories | Completo | CRUD persistido en Postgres vía `TypeOrmCategoriesRepository` (#7 resuelto). |
| placeholder-users | Completo | Gateway pattern (local / jsonplaceholder por `USERS_SOURCE`). |
| common | Completo | Utilidades de paginación, middlewares de logging y timing. |

Sin discrepancias front↔back: register, products CRUD, users (GET / PATCH role),
placeholder-users.

## Problemas confirmados

Verificado leyendo los archivos directamente.

| # | Problema | Evidencia | Severidad |
|---|----------|-----------|-----------|
| 1 | `GET /auth/me` no existe en el backend. El front lo llama al iniciar para restaurar sesión, y el MCP también lo usa. → 404 | front `auth.service.ts:22,39`; backend `auth.controller.ts` (solo register/login) | Crítica |
| 2 | `login` del backend devuelve solo `{access_token}`, pero el front hace `this.user.set(res.user)` → tras login el usuario queda `undefined`. | backend `auth.service.ts:21-27`; front `auth.service.ts:33-34,62-65` | Crítica |
| 3 | `PUT /categories/:id` no existe en el backend; el front lo usa para editar categorías. → 404 | front `categories.service.ts:25-26`; backend `categories.controller.ts` (solo GET/POST/DELETE) | Alta |
| 4 | `GET /categories` devuelve `PaginatedResult<Category>` (objeto `{data, meta}`) pero el front lo tipa y consume como `Category[]`. → listado roto | backend `categories.controller.ts` (findAll); front `categories.service.ts:13-14` | Alta |
| 5 | Parámetro de orden: el front manda `sortBy`, el backend lee `orderBy` → el orden se ignora. | front `products.service.ts:23`; backend products controller (`orderBy`) | Media |
| 6 | `DELETE /users/me` no existe; lo usa el tool `delete_my_account` del MCP. → 404 | mcp `tools/auth.ts:35`; backend `users.controller.ts` | Media (solo MCP) |
| 7 | Categories vive en memoria (`InMemoryCategoriesRepository`), no en SQLite → se pierde al reiniciar; products puede quedar con `categoryId` huérfano. | `app.module.ts` (no registra `CategoryEntity`); `categories.module.ts` | Media |

### Otras observaciones (no bloqueantes)

- Sin Swagger/OpenAPI.
- Sin `app.enableCors()` explícito en `main.ts` (puede hacer falta con el front separado).
- Sin unit tests (solo un smoke e2e de `GET /`).
- Sin seed de datos iniciales.

## Soluciones (checklist — estado al 2026-06-18)

Ruta seguida: **arreglar el backend** para respetar lo que el front ya espera.

- [x] **#1 `/auth/me`** — agregado `GET /auth/me` en `auth.controller.ts` con
  `@UseGuards(JwtAuthGuard)`, devuelve `req.user` (`{id, email, role}`).
- [x] **#2 login con user** — `auth.service.ts` (`login`) ahora devuelve
  `{ user, access_token }` igual que `register`.
- [x] **#3 `PUT /categories/:id`** — agregado `update` en `categories.controller.ts`,
  `categories.service.ts`, la interfaz del repo y `in-memory-categories.repository.ts`
  (+ `UpdateCategoryInput` en `category.types.ts`).
- [x] **#4 forma de categorías** — `GET /categories` ahora devuelve **array plano**
  (`Category[]`, todas), que es lo que el front ya consumía. Se eliminó el cap de 10.
- [x] **#5 `sortBy`/`orderBy`** — unificado en **`sortBy`** (alineado a la consigna y al
  front), soportando `id|name|price|stock` y `order` case-insensitive (`asc/ASC/desc/DESC`).
- [x] **#6 `DELETE /users/me`** — agregado en `users.controller.ts` (solo `JwtAuthGuard`,
  los guards de Admin pasaron a nivel de método) + `remove` en `users.service.ts`.
- [x] **#7 persistir categorías** — creados `CategoryEntity` y `TypeOrmCategoriesRepository`,
  registrada la entidad en `app.module.ts` y cableado el provider en `categories.module.ts`.
  La interfaz del repo, `CategoriesService` (incl. `exists()`) y sus llamadores en
  `products.service.ts` pasaron a `async`. Verificado: las categorías sobreviven al reinicio.
  (No se agregó `@ManyToOne` en `ProductEntity`; `categoryId` sigue como entero plano.)

> Bonus detectado y corregido fuera de la lista original: el front leía la paginación de
> productos como `{items,total,...}` pero el backend devuelve `{data,meta}`. Se mapea ahora
> en `front/.../services/products.service.ts`.

## Cómo verificar (cuando se hagan los arreglos)

1. `cd "practico final/api-c" && npm run build` (debe compilar).
2. Levantar backend: `npm run start:dev` (puerto 3000).
3. Smoke con curl: `POST /auth/register` → guardar token → `GET /auth/me` con
   `Authorization: Bearer <token>` (debe devolver el user) → `POST /categories` →
   `PUT /categories/:id` → `GET /categories` → `GET /products?sortBy=price&order=asc`.
4. Levantar front (`cd ../front && npm install && npm start`), loguearse y verificar:
   usuario seteado tras login, listado de categorías visible, edición de categoría OK.
5. `npm run test:e2e` en `api-c` (smoke test existente).
