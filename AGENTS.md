# AGENTS.md - Electronic Vote Project

## Project Overview
Electronic voting application built with Nuxt 4, Nuxt UI 4, and PostgreSQL.

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
docker compose down     # Stop PostgreSQL
```

### Single File Linting
```bash
pnpm eslint app/pages/index.vue --fix
pnpm eslint layers/auth/pages/auth.vue --fix
```

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
- Use `~` alias for `src/` directory: `~/components/`, `~/composables/`
- Use `@` for node_modules
- Group imports: 1) Vue/Nuxt 2) External 3) Internal

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
├── app/                    # Main application
│   ├── components/          # Shared components
│   ├── composables/         # Vue composables
│   ├── layouts/             # Page layouts
│   ├── pages/               # Route pages
│   ├── assets/              # Static assets (css, images)
│   ├── app.vue              # Root component
│   └── app.config.ts        # App configuration
├── layers/                  # Feature layers (extendable modules)
│   ├── auth/                # Authentication feature
│   ├── dashboard/           # Dashboard feature
│   ├── home/                # Home feature
│   ├── management/          # Management feature
│   └── profile/             # User profile feature
├── public/                  # Static public assets
├── docker-compose.yaml      # PostgreSQL setup
├── nuxt.config.ts           # Nuxt configuration
└── package.json             # Dependencies
```

---

## Error Handling

- Use proper error boundaries in Vue components
- Handle async errors with try/catch in composables
- Display user-friendly error messages via Nuxt UI toasts
- Log errors appropriately (avoid exposing sensitive data)

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
