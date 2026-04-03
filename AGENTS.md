# AGENTS.md - Electronic Vote Project

## Project Overview
Electronic voting application built with Nuxt 4, Nuxt UI 4, PostgreSQL, Drizzle ORM, and nuxt-auth-utils.

---

## Commands

### Development
```bash
pnpm dev          # Start development server (http://localhost:3000)
pnpm build        # Build for production
pnpm preview      # Preview production build
```

### Quality Assurance
```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Run ESLint with auto-fix
pnpm typecheck    # Run TypeScript type checking
```

### Database (Docker)
```bash
docker compose up -d     # Start PostgreSQL
docker compose down       # Stop PostgreSQL
```

### Database Migrations (Drizzle)
```bash
pnpm db:generate   # Generate migration from schema changes
pnpm db:push       # Push schema changes to database
pnpm db:studio     # Open Drizzle Studio (database GUI)
```

### Single File Linting
```bash
pnpm eslint app/pages/index.vue --fix
pnpm eslint app/pages/auth/index.vue --fix
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Nuxt 4 |
| UI Library | Nuxt UI 4 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Auth | nuxt-auth-utils (JWT) |
| Styling | TailwindCSS 4 |

---

## Code Style Guidelines

### Formatting
- **Indent**: 2 spaces (no tabs)
- **Line endings**: LF
- **Charset**: UTF-8
- **Trailing whitespace**: Trimmed (except in .md files)
- **Final newline**: Required

### Vue/TypeScript Conventions

#### Component Structure (Vue SFC)
```vue
<template>
  <!-- Template content -->
</template>

<script lang="ts" setup>
// Logic here
</script>

<style>
/* Scoped styles if needed */
</style>
```

#### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserProfile.vue`, `AppLogo.vue` |
| Pages | kebab-case | `user-profile.vue`, `change-password.vue` |
| Composables | camelCase, use `use` prefix | `useAuth.ts`, `useVoting.ts` |
| Types/Interfaces | PascalCase | `UserData`, `VoteResult` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_VOTES`, `API_URL` |
| CSS classes | kebab-case | `text-primary`, `bg-neutral` |

#### Imports
- Use `~` alias for `app/` directory: `~/components/`, `~/composables/`
- Use `~~` for root project path (for server imports from app)
- Use relative imports for server code: `../../database`, `../utils`
- Use `@` for node_modules

#### TypeScript
- Use strict typing; avoid `any`
- Use `defineProps` with typed props in Vue components
- Use TypeScript interfaces for complex objects

#### Vue Best Practices
- Use `<script setup>` syntax
- Use `definePageMeta` for page-specific config
- Use `composables/` for reusable logic
- Prefer composition API over options API

---

## Project Structure

```
electronic-vote/
├── app/
│   ├── components/           # Shared components
│   ├── composables/          # Vue composables (useAuth, usePermissions)
│   ├── layouts/              # Page layouts (default, auth, authenticated)
│   ├── middleware/           # Route middleware (auth.global, role)
│   ├── pages/                # Route pages
│   │   ├── auth/             # Auth pages (login, register, change-password)
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── management/        # Management pages
│   │   └── profile/          # Profile pages
│   ├── types/                # TypeScript type declarations
│   ├── assets/               # Static assets
│   ├── app.vue               # Root component
│   └── app.config.ts         # App configuration
├── server/                    # Server-side code (Nuxt Nitro)
│   ├── api/
│   │   └── auth/             # Auth API endpoints
│   │       ├── login.post.ts
│   │       ├── logout.post.ts
│   │       ├── me.get.ts
│   │       └── register.post.ts
│   ├── database/              # Drizzle schema and connection
│   │   ├── index.ts
│   │   └── schema.ts
│   └── utils/                # Server utilities
│       ├── password.ts
│       └── validation.ts
├── public/                   # Static public assets
├── docker-compose.yaml       # PostgreSQL setup
├── drizzle.config.ts         # Drizzle ORM configuration
├── nuxt.config.ts            # Nuxt configuration
└── package.json             # Dependencies
```

---

## Authentication System

### Roles and Permissions

| Role | Home | Auth | Profile | Dashboard | Management |
|------|:----:|:----:|:-------:|:--------:|:---------:|
| voter | ✓ | ✓ | ✓ | ✗ | ✗ |
| advisor | ✓ | ✓ | ✓ | ✓ | ✗ |
| admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| dev | ✓ | ✓ | ✓ | ✓ | ✓ |

### User Schema (Drizzle)
```typescript
users: {
  id: serial primaryKey
  identification: varchar(50) unique notNull
  email: varchar(255) unique notNull
  passwordHash: varchar(255) notNull
  name: varchar(100) notNull
  role: varchar(20) default 'voter'
  createdAt: timestamp default now()
  updatedAt: timestamp default now()
}
```

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Composables
- `useAuth()` - Authentication state and methods (login, register, logout)
- `usePermissions()` - Role-based access control (hasRole, canAccess, isAdmin)

### Middleware
- `auth.global.ts` - Protects all routes except `/`, `/auth`, and `/api/*`
- `role.ts` - Checks if user has required role (via `definePageMeta({ roles: [...] })`)

### Session Configuration
- JWT-based sessions
- Session expires after 1 hour (3600 seconds)

---

## Error Handling

- Use proper error boundaries in Vue components
- Handle async errors with try/catch in composables
- Display user-friendly error messages via Nuxt UI toasts
- Log errors appropriately (avoid exposing sensitive data)
- API errors use HTTP status codes and return `{ message: string }`

---

## Nuxt UI Usage

- Use Nuxt UI components: `UButton`, `UContainer`, `UHeader`, etc.
- Color palette: Primary (green), Neutral (slate) - see `app.config.ts`
- Use `@iconify-json/lucide` for icons: `icon="i-lucide-plus"`
- Follow TailwindCSS utility classes for styling

---

## Testing

*Note: Test infrastructure not yet configured. When adding tests:*
- Use Vitest for unit/component tests
- Use Playwright for E2E tests
- Run single test: `pnpm vitest run --filter ComponentName`

---

## Git Workflow

- Commit messages: Conventional commits (feat, fix, docs, etc.)
- Never commit `.env` files with real credentials
- Run `pnpm lint` and `pnpm typecheck` before committing

---

## Known Issues

- **Login redirect delay**: After successful login, there's approximately a 4-second delay before redirecting to `/dashboard`. This is a known behavior that could be optimized in the future.
