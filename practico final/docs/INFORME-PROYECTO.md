# Informe del Proyecto — TPIDS

Tienda / catálogo full-stack con autenticación. Aplicación de gestión de **productos**, **categorías** y **usuarios** con registro, login por JWT, verificación de email y recuperación de contraseña.

## 1. Arquitectura general

```
practico final/
├── back/     API REST — NestJS 11 + TypeORM + PostgreSQL
├── front/    SPA — Angular 21 (standalone components)
├── mcp/      Servidor MCP (herramientas sobre la API)
└── docs/     Documentación
```

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| Frontend | Angular 21 (`ng serve`) | 4200 |
| Backend | NestJS 11 (Express) | 3000 |
| Base de datos | PostgreSQL 16 (Docker) | 5433 → 5432 |

El front habla con el back vía HTTP (`environment.apiUrl = http://localhost:3000`), el back persiste en Postgres, y la autenticación es por **JWT en `Authorization: Bearer`**.

---

## 2. Backend (NestJS + TypeORM + Postgres)

### Stack
- **NestJS** ^11 (platform-express), **TypeORM** + driver **pg**
- **Auth**: `@nestjs/jwt` + `@nestjs/passport` + `passport-jwt`
- **Hash**: `bcrypt` (rounds configurable `BCRYPT_COST`, default 12)
- **Mail**: `nodemailer` (SMTP, configurado para Mailtrap sandbox)
- **Validación**: `class-validator` + `class-transformer` con `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`)

### Módulos (`back/src/`)
- **auth/** — registro, login, verificación de email, reset de password. Estrategia JWT con Passport, guards y decorador `@Roles`.
- **users/** — operaciones de cuenta propia (borrar, cambiar password/email) y administración de roles (admin).
- **products/** — CRUD de productos + filtros, orden y paginación. Patrón Repository inyectado.
- **categories/** — CRUD de categorías + listado de productos por categoría.
- **placeholder-users/** — consume datos externos (JSONPlaceholder) o locales según `USERS_SOURCE`.
- **mail/** — servicio interno de envío de emails (verificación / reset).
- **common/** — middlewares `LoggerMiddleware` (log de requests) y `TimingMiddleware` (header `X-Response-Time`), helpers de paginación.

### Modelo de datos
- **users**: `id (uuid)`, `email (único, normalizado)`, `passwordHash (select:false)`, `role (user|admin)`, `isVerified`, y tokens de verificación/reset (`select:false`). El **primer usuario registrado queda como ADMIN**.
- **categories**: `id`, `name`.
- **products**: `id`, `name`, `price (real)`, `stock (int, default 0)`, `categoryId` → **ManyToOne** a `categories` (`eager: true`).

### Endpoints

**`/auth`**
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | público | Registro + envía email de verificación |
| POST | `/auth/login` | público | Devuelve `access_token` + user |
| GET | `/auth/me` | JWT | Usuario actual |
| POST | `/auth/verify-email` | público | Verifica email con token |
| POST | `/auth/resend-verification` | JWT | Reenvía email de verificación |
| POST | `/auth/forgot-password` | público | Solicita reset (respuesta opaca) |
| POST | `/auth/reset-password` | público | Resetea password con token |

**`/users`** (todos requieren JWT)
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| DELETE | `/users/me` | user | Elimina cuenta propia |
| PATCH | `/users/me/password` | user | Cambia password (valida actual) |
| PATCH | `/users/me/email` | user | Cambia email (re-verifica) |
| GET | `/users` | **admin** | Lista usuarios |
| PATCH/PUT | `/users/:id/role` | **admin** | Cambia rol |

**`/products`** y **`/categories`** (públicos, sin guard): CRUD completo. Productos soporta `?name=&sortBy=&order=&page=&limit=`; `GET /categories/:id/products` devuelve productos paginados; `PATCH /products/:id/stock` descuenta stock validando disponibilidad. `DELETE /categories/:id` falla si tiene productos asociados.

### Autenticación (flujo)
- **Registro** → hash bcrypt, genera `verificationToken`, envía email. Primer user = ADMIN.
- **Login** → `bcrypt.compare`, firma JWT con payload `{ sub, role }`, expira en `JWT_EXPIRES_SEC` (1h).
- **JwtStrategy** extrae el Bearer, valida el secret y recarga el usuario desde la DB.
- **Reset password** → token con expiración de 1h enviado por email a `FRONTEND_URL/reset-password?token=...`.
- **Cambio de email** logueado → marca `isVerified=false` y re-envía verificación.

### Mail
`MailService` (Nodemailer/SMTP, env `MAIL_*`). Métodos `sendVerificationEmail` y `sendPasswordResetEmail`. Los fallos de SMTP se loguean **sin** romper el request (permite reintentar desde el front). `forgot-password` nunca revela si el email existe.

### Configuración notable
- **`synchronize: true`** → TypeORM crea/actualiza el esquema en cada arranque (las tablas se generan solas).
- CORS restringido a `CORS_ORIGIN` (default `http://localhost:4200`), `credentials: true`.
- Campos sensibles excluidos por defecto con `select: false`.
- Paginación: `{ data, meta: { page, limit, total, totalPages } }`, limit default 10 / máx 50.

---

## 3. Frontend (Angular 21)

### Stack
- **Angular 21**, **standalone components** con lazy loading (`loadComponent`).
- **Bootstrap 5.3** para estilos, **RxJS**, formularios reactivos.
- Estado por **signals** (sin NgRx/Akita); todo local o en servicios.

### Estructura (`front/src/app/`)
- **pages/** — `home`, `login`, `register`, `forgot-password`, `reset-password`, `verify-email`, `verify-pending`, `profile`, `products`, `product-detail`, `categories`, `admin-users`.
- **services/** — `auth`, `products`, `categories`, `users` (HttpClient contra `apiUrl`).
- **guards/** — `authGuard`, `adminGuard`.
- **interceptors/** — `jwtInterceptor`.
- **shared/** — `navbar`, `bottom-nav`, `footer`, `toast` (service + container), `bottom-sheet` (modal genérico).

### Rutas
| Ruta | Guard | Descripción |
|------|-------|-------------|
| `/` | — | Home (muestra conteos si está logueado) |
| `/login`, `/register` | — | Acceso |
| `/verify-pending` | authGuard | Espera de verificación, botón reenviar |
| `/verify-email` | — | Verifica con `?token=` |
| `/forgot-password`, `/reset-password` | — | Recuperación de password |
| `/profile` | authGuard | Cambiar password/email, reenviar verificación |
| `/products`, `/products/:id` | authGuard | Listado/CRUD y detalle |
| `/categories` | authGuard | Listado/CRUD |
| `/admin/users` | authGuard + adminGuard | Gestión de roles |

### Auth en el front
- **AuthService** guarda el JWT en `localStorage` (`access_token`) y mantiene `user = signal<SafeUser|null>`. En el constructor, si hay token, llama `me()` para hidratar el usuario.
- **jwtInterceptor** agrega `Authorization: Bearer <token>` a toda request hacia `apiUrl`.
- **authGuard** → redirige a `/login` si no hay sesión. **adminGuard** → redirige a `/` si no es admin.
- CRUD de productos/categorías visible para todos, pero **solo admin** puede crear/editar/borrar (vía bottom-sheet).

### UX
- **ToastService** (signals) con tipos `success | error | info`, auto-dismiss 4s.
- Manejo de errores por página: `firstValueFrom()` + `try/catch` mostrando `err.error?.message` en un toast (no hay interceptor de errores global).

---

## 4. Servidor MCP (`mcp/`)

Servidor **Model Context Protocol** que expone la API del backend como **herramientas (tools)** para que un cliente MCP (p. ej. un asistente LLM) opere la tienda en lenguaje natural. Es un *bridge* fino sobre los mismos endpoints REST.

### Stack
- **`@modelcontextprotocol/sdk`** (`McpServer` + `StdioServerTransport` — transporte por stdio).
- **axios** como cliente HTTP, **tsx** para ejecutar TypeScript (`npm start` → `tsx src/index.ts`).

### Estructura (`mcp/src/`)
- **index.ts** — crea el `McpServer` (`api-c-bridge`), registra las tools, intenta **auto-login** con credenciales de env y conecta por stdio.
- **api-client.ts** — `ApiClient` (singleton `api`) sobre axios: base `API_C_URL` (default `http://localhost:3000`), guarda el JWT en memoria y lo inyecta como `Bearer` vía interceptor. Métodos `get/post/put/patch/del`, `login`, `register`, `autoLogin`.
- **tool-factory.ts** — `registerToolSet`: registra cada tool con su `inputSchema` (validado con **zod**), serializa la respuesta a JSON y mapea errores a `isError`.
- **tools/** — definiciones agrupadas por dominio (`auth`, `products`, `categories`, `users`), unificadas en `tools/index.ts`.

### Herramientas expuestas
| Grupo | Tools |
|-------|-------|
| **auth** | `auth_login`, `auth_register`, `auth_me`, `delete_my_account` |
| **products** | `list_products`, `get_product`, `create_product`, `update_product`, `delete_product` |
| **categories** | `list_categories`, `get_category`, `create_category`, `update_category`, `delete_category` |
| **users** | `list_users`, `update_user_role`, `update_my_password`, `update_my_email` |

### Autenticación
- Si se definen `API_C_EMAIL` / `API_C_PASSWORD`, hace **auto-login** al arrancar y guarda el token para las llamadas autenticadas.
- Sin esas variables, arranca igual y se puede autenticar en runtime con la tool `auth_login`.
- El token se mantiene **en memoria** (no se persiste) y se envía como `Authorization: Bearer` en cada request.

### Variables de entorno (`mcp/`)
| Variable | Descripción |
|----------|-------------|
| `API_C_URL` | Base de la API (default `http://localhost:3000`) |
| `API_C_EMAIL` / `API_C_PASSWORD` | Credenciales para auto-login (opcionales) |

> El servidor habla por **stdio**, así que se ejecuta a través de un cliente MCP (config en `opencode.json` u otro host MCP), no como un servicio HTTP independiente. Requiere el backend corriendo en `API_C_URL`.

---

## 5. Cómo levantar el proyecto

```bash
# 1. Base de datos
cd "practico final/back"
docker compose up -d            # Postgres en localhost:5433

# 2. Backend
npm install
npm run seed                    # datos de prueba (opcional)
npm start                       # API en http://localhost:3000

# 3. Frontend
cd ../front
npm install
npm start                       # SPA en http://localhost:4200
```

> **Importante**: `back/.env` debe tener `DB_PORT=5433` para apuntar al Postgres del Docker (el compose mapea `5433:5432`).

### Datos de prueba (`npm run seed`)
Carga 4 categorías, 9 productos y 2 usuarios ya verificados (idempotente):

| Email | Password | Rol |
|-------|----------|-----|
| `admin@tpids.local` | `Admin123!` | admin |
| `user@tpids.local` | `User123!` | user |

---

## 6. Variables de entorno (`back/.env`)

| Variable | Descripción |
|----------|-------------|
| `BCRYPT_COST` | Rounds de bcrypt (default 12) |
| `DB_HOST/PORT/USER/PASSWORD/NAME` | Conexión Postgres (`DB_PORT=5433` con Docker) |
| `JWT_SECRET` | Secreto de firma JWT (obligatorio) |
| `JWT_EXPIRES_SEC` | Expiración del token (default 3600) |
| `CORS_ORIGIN` / `FRONTEND_URL` | Origen del front / base para enlaces de email |
| `MAIL_HOST/PORT/USER/PASS/FROM` | SMTP (Mailtrap sandbox) |
