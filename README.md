# Electronic Vote

Sistema de votación electrónica construido con Nuxt 4, Nuxt UI 4 y PostgreSQL. Permite administrar elecciones, gestionar candidatos y registrar votos de forma segura con autenticación JWT.

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## Descripción

Electronic Vote es una aplicación web completa que facilita la organización y gestión de procesos electorales. Diseñado para instituciones educativas, organizaciones o cualquier entidad que requiera un sistema de votación electrónico seguro y fácil de usar.

El sistema cuenta con gestión de usuarios por roles, administración de elecciones y candidatos, un sistema de votación protegido contra votos duplicados, y visualización de resultados en tiempo real.

## Tecnologías

| Componente | Tecnología |
|------------|------------|
| Framework | Nuxt 4 |
| UI Library | Nuxt UI 4 |
| Base de datos | PostgreSQL |
| ORM | Drizzle ORM |
| Autenticación | nuxt-auth-utils (JWT) |
| Estilos | TailwindCSS 4 |
| Iconos | Lucide Icons |
| Hashing de passwords | bcrypt |
| Contenedor | Docker Compose |

## Características

### Sistema de Autenticación
- Registro e inicio de sesión con email y password
- Sesiones JWT con duración de 1 hora
- Cambio de contraseña con verificación de password actual
- Rate limiting en login (5 intentos por cada 15 minutos) para prevenir ataques de fuerza bruta
- Middleware global de autenticación que protege las rutas
- Control de acceso basado en roles (RBAC)

### Roles y Permisos

| Rol | Descripción |
|-----|-------------|
| Voter | Puede ver elecciones activas y votar |
| Advisor | + Acceso al dashboard |
| Admin | + Acceso a gestión de elecciones y candidatos |
| Dev | Acceso completo al sistema |

### Sistema de Votación
- Lista de elecciones activas con información relevante (fechas, candidato/s)
- Detalle de elección con visualización de candidatos
- Selección visual de candidato antes de confirmar el voto
- Modal de confirmación para evitar votos accidentales
- Prevención de doble voto por usuario/elección
- Verificación de estado de elección (solo activas aceptan votos)
- Página de resultados con gráfico de barras y porcentaje de votos

### Gestión de Elecciones y Candidatos
- CRUD completo de elecciones (crear, editar, eliminar)
- CRUD completo de candidatos
- Asociación de candidatos a elecciones específicas
- Importación masiva de candidatos desde archivos CSV
- Validación de fechas (la fecha de fin debe ser posterior al inicio)
- Estados de elección: Borrador, Activa, Finalizada

### API REST
Endpoints organizados por recurso:

**Autenticación**
- `POST /api/auth/register` - Registro de nuevo usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/change-password` - Cambiar contraseña

**Elecciones**
- `GET /api/elections` - Listar todas las elecciones
- `POST /api/elections` - Crear elección
- `GET /api/elections/active` - Listar elecciones activas
- `GET /api/elections/:id` - Obtener detalles de una elección
- `PUT /api/elections/:id` - Actualizar elección
- `DELETE /api/elections/:id` - Eliminar elección
- `GET /api/elections/:id/results` - Obtener resultados de una elección

**Candidatos**
- `GET /api/candidates` - Listar todos los candidatos
- `POST /api/candidates` - Crear candidato
- `GET /api/candidates/:id` - Obtener detalles de un candidato
- `PUT /api/candidates/:id` - Actualizar candidato
- `DELETE /api/candidates/:id` - Eliminar candidato
- `POST /api/candidates/import` - Importar candidatos desde CSV

**Votos**
- `POST /api/votes` - Registrar un voto
- `GET /api/votes/status` - Obtener estado de votos del usuario

### Base de Datos

Esquema relacional optimizado con las siguientes tablas:

- **users** - Usuarios del sistema con roles diferenciados
- **elections** - Elecciones con fechas y estados
- **candidates** - Candidatos independientes de elecciones
- **election_candidates** - Tabla de relación many-to-many
- **votes** - Votos con constraint de único por usuario/elección

## Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm (preferido) o npm
- Docker (para PostgreSQL)

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd electronic-vote

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env  # si existe
# Editar .env con la URL de la base de datos

# Iniciar PostgreSQL con Docker
docker compose up -d

# Generar migraciones de base de datos
pnpm db:generate

# Empujar esquema a la base de datos
pnpm db:push

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Comandos Disponibles

| Comando | Descripción |
|---------|------------|
| `pnpm dev` | Iniciar servidor de desarrollo |
| `pnpm build` | Construir para producción |
| `pnpm preview` | Previsualizar build de producción |
| `pnpm lint` | Ejecutar ESLint |
| `pnpm lint:fix` | Ejecutar ESLint con correcciones automáticas |
| `pnpm typecheck` | Verificar tipos TypeScript |
| `pnpm db:generate` | Generar migraciones Drizzle |
| `pnpm db:push` | Empujar esquema a la base de datos |
| `pnpm db:studio` | Abrir Drizzle Studio (GUI de base de datos) |

### Docker

Para solo iniciar la base de datos PostgreSQL:

```bash
docker compose up -d
```

Para detenerla:

```bash
docker compose down
```

## Estructura del Proyecto

```
electronic-vote/
├── app/
│   ├── components/       # Componentes Vue reutilizables
│   ├── composables/       # Lógica compartida (useAuth, usePermissions)
│   ├── layouts/           # Plantillas de página (default, auth, authenticated)
│   ├── middleware/        # Middleware de rutas (auth.global, role)
│   ├── pages/            # Páginas de la aplicación
│   │   ├── auth/          # Páginas de autenticación
│   │   ├── dashboard/    # Dashboard
│   │   ├── management/   # Administración
│   │   ├── profile/       # Perfil de usuario
│   │   └── vote/          # Votación y resultados
│   └── types/             # Definiciones de tipos TypeScript
├── server/
│   ├── api/              # Endpoints de la API
│   │   ├── auth/          # Endpoints de autenticación
│   │   ├── candidates/    # Endpoints de candidatos
│   │   ├── elections/     # Endpoints de elecciones
│   │   └── votes/         # Endpoints de votos
│   ├── database/          # Esquema y conexión de Drizzle
│   └── utils/             # Utilidades del servidor
├── public/                # Assets estáticos públicos
├── docker-compose.yaml    # Configuración de PostgreSQL
├── drizzle.config.ts     # Configuración de Drizzle ORM
└── nuxt.config.ts         # Configuración de Nuxt
```

## Seguridad

- **Passwords**: Hashing con bcrypt (10 rounds de sal)
- **Autenticación**: Tokens JWT en sesiones HTTP-only
- **Rate Limiting**: Prevención de ataques de fuerza bruta en login
- **SQL Injection**: Prevención mediante Drizzle ORM (consultas parametrizadas)
- **RBAC**: Verificación de roles en cada endpoint protegido
- **CSRF**: Protección integrada de Nuxt

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

Construido con [Nuxt](https://nuxt.com/) y [Nuxt UI](https://ui.nuxt.com/)
