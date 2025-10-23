# NPM Scripts Reference

## Development Commands

### Start All Applications

```bash
pnpm dev
# or
pnpm dev:all
```

Runs both frontend and backend in parallel. This is the main command you'll use for development.

### Start Individual Applications

```bash
# Frontend only (React + Vite)
pnpm dev:frontend

# Backend only (NestJS)
pnpm dev:backend
```

---

## Build Commands

### Build All Applications

```bash
pnpm build
# or
pnpm build:all
```

Builds both frontend and backend for production in parallel.

### Build Individual Applications

```bash
# Frontend only
pnpm build:frontend

# Backend only
pnpm build:backend
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

# Backend tests
pnpm test:backend
```

### End-to-End Tests

```bash
# Run all E2E tests
pnpm e2e

# Frontend E2E (Playwright)
pnpm e2e:frontend

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
pnpm lint:backend
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
