# NPM Scripts Reference

## Development Commands

### Start All Applications

```bash
pnpm dev              # Both frontend + backend
# or
pnpm dev:all
```

Runs both frontend and backend in parallel. This is the main command you'll use for development.

### Start Individual Applications

```bash
# Frontend only (React + Vite)
pnpm dev:frontend
nx serve frontend     # Frontend only (direct Nx command)

# Backend only (NestJS)
pnpm dev:backend
nx serve backend      # Backend only (direct Nx command)
```

---

## Build Commands

### Build All Applications

```bash
pnpm build           # Both (convenience script)
# or
pnpm build:all
```

Builds both frontend and backend for production in parallel.

### Build Individual Applications

```bash
# Frontend only
pnpm build:frontend
nx build frontend

# Backend only
pnpm build:backend
nx build backend
```

---

## Testing Commands

### Run All Tests

```bash
pnpm test
```

Runs tests for all projects.

### Test Individual Applications

```bash
# Frontend tests
pnpm test:frontend
nx test frontend

# Backend tests
pnpm test:backend
nx test backend
```

### End-to-End Tests

```bash
# Run all E2E tests
pnpm e2e

# Frontend E2E (Playwright)
pnpm e2e:frontend
nx e2e frontend-e2e

# Backend E2E
pnpm e2e:backend
```

---

## Code Quality Commands

### Linting

```bash
# Lint all projects
pnpm lint

# Lint specific project
pnpm lint:frontend
nx lint frontend

pnpm lint:backend
nx lint backend
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting without modifying
pnpm format:check
```

### Type Checking

```bash
# Type check all projects
pnpm typecheck
```

---

## Database Commands

### Prisma Operations

```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to database (prototyping only)
pnpm db:push

# Create migration (use on Neon dev branch)
pnpm db:migrate

# Deploy migrations (automatic on production deploy)
pnpm db:migrate:deploy

# Open Prisma Studio (database GUI)
pnpm db:studio

# Seed database with example data
pnpm db:seed
```

**Note:** Always test migrations on a Neon development branch before deploying to production. See [Database Setup Guide](database-setup.md) for the complete migration workflow.

---

## Utility Commands

### View Project Graph

```bash
pnpm graph
```

Opens an interactive visualization of your project dependencies.

### Clean Build Artifacts

```bash
pnpm clean
```

Removes `dist`, `node_modules`, and Nx cache. Useful for troubleshooting.

### Generate VAPID Keys

```bash
pnpm generate:vapid
```

Generates VAPID keys for web push notifications. See [Web Push Setup](web-push-setup.md) for details.

**Example output:**

```
🔐 Generating VAPID keys for Web Push...
✅ VAPID keys generated successfully!
```

### Hash Password

```bash
pnpm hash:password "your-password"
```

Hashes a password using Argon2 (the same algorithm used in the application). Useful for:

- Generating the `ADMIN_PASSWORD_HASH` environment variable
- Testing authentication flows

**Example:**

```bash
pnpm hash:password "MySecurePassword123"

# Output:
# 🔐 Hashing password with Argon2...
# ✅ Password hashed successfully!
# 📋 Hashed password:
# $argon2id$v=19$m=65536,t=3,p=4$randomsalt$hashvalue...
```

**Common Use Cases:**

**1. Generate Admin Password Hash (for environment variables):**

```bash
# Generate hash for your admin password
pnpm hash:password "YourSecureAdminPassword"

# Copy the output hash and add to .env:
ADMIN_PASSWORD_HASH="$argon2id$v=19$m=65536,t=3,p=4$..."
```

**Security Note:** Argon2 is a memory-hard password hashing algorithm that's resistant to GPU-based attacks. Each hash includes a random salt, so the same password will generate different hashes each time.

---

## Quick Reference Table

| Command               | Description                 |
| --------------------- | --------------------------- |
| `pnpm dev`            | 🚀 Start frontend + backend |
| `pnpm dev:frontend`   | Start frontend only         |
| `pnpm dev:backend`    | Start backend only          |
| `pnpm build`          | 📦 Build frontend + backend |
| `pnpm build:frontend` | Build frontend only         |
| `pnpm build:backend`  | Build backend only          |
| `pnpm test`           | ✅ Run all tests            |
| `pnpm e2e`            | 🧪 Run E2E tests            |
| `pnpm lint`           | 🔍 Lint all code            |
| `pnpm format`         | 💅 Format all code          |
| `pnpm typecheck`      | 🔤 Type check TypeScript    |
| `pnpm db:generate`    | 🗄️ Generate Prisma Client   |
| `pnpm db:studio`      | 📊 Open database GUI        |
| `pnpm db:seed`        | 🌱 Seed database            |
| `pnpm generate:vapid` | 🔑 Generate VAPID keys      |
| `pnpm hash:password`  | 🔐 Hash password (Argon2)   |
| `pnpm graph`          | 📊 View project graph       |
| `pnpm clean`          | 🧹 Clean build artifacts    |

---

## Development Workflow

### Typical Development Session

```bash
# 1. Start development servers
pnpm dev

# Frontend: http://localhost:4200
# Backend: http://localhost:3000 (or configured port)

# 2. Make changes to your code
# Both servers will auto-reload on file changes

# 3. Before committing
pnpm lint          # Check for linting errors
pnpm typecheck     # Check for type errors
pnpm format        # Format code
```

### Production Build

```bash
# Build for production
pnpm build

# Output will be in:
# - dist/apps/frontend/
# - dist/apps/backend/
```

---

## Nx-Specific Commands

If you need more control, you can use Nx commands directly:

```bash
# Run any target for a specific project
pnpm nx <target> <project>

# Examples:
pnpm nx serve frontend
pnpm nx build backend
pnpm nx test types

# Run a target for multiple projects
pnpm nx run-many -t build --projects=frontend,backend

# Affected commands (only run on changed projects)
pnpm nx affected -t test
pnpm nx affected -t build

# Show project details
pnpm nx show project frontend
```

---

## Tips

- Use `pnpm dev` for most development work (runs both frontend and backend)
- The `--parallel` flag runs multiple tasks simultaneously for faster execution
- Nx caches build outputs, so subsequent builds are much faster
- Use `pnpm clean` if you encounter strange build issues
