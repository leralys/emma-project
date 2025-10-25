# Emma Project

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern full-stack monorepo powered by [Nx](https://nx.dev), featuring a React frontend and NestJS backend.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development servers (frontend + backend)
pnpm dev

# Build for production
pnpm build
```

## 📁 Project Structure

```
emma-project/
├── apps/
│   ├── frontend/              # React + Vite frontend
│   ├── frontend-e2e/          # Frontend E2E tests (Playwright)
│   ├── src/                   # NestJS backend
│   └── [backend config]
├── apps-e2e/                  # Backend E2E tests
├── libs/
│   └── types/                 # Shared TypeScript types
├── docs/                      # Project documentation
└── dist/                      # Build outputs
```

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool & dev server
- **PWA Support** - Progressive Web App with offline capabilities
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Sonner** - Toast notifications
- **React Icons** - Icon library
- **React Dropzone** - File upload
- **date-fns** - Date utilities

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM
- **Neon** - Serverless Postgres database
- **Argon2** - Secure password hashing
- **Web Push** - Push notifications
- **Cloudflare R2** - Object storage (S3-compatible)

### Development Tools

- **Nx** - Monorepo build system
- **ESLint** - Code linting
- **Prettier** - Code formatting (with auto-organize imports & Tailwind class sorting)
- **Husky** - Git hooks for code quality
- **Playwright** - E2E testing
- **pnpm** - Fast package manager

## 📜 Available Scripts

### Development

```bash
pnpm dev              # Start both frontend & backend
pnpm dev:frontend     # Start frontend only
pnpm dev:backend      # Start backend only
```

### Build

```bash
pnpm build            # Build both applications
pnpm build:frontend   # Build frontend only
pnpm build:backend    # Build backend only
```

### Testing

```bash
pnpm test             # Run all tests
pnpm test:frontend    # Test frontend
pnpm test:backend     # Test backend
pnpm e2e              # Run E2E tests
```

### Code Quality

```bash
pnpm lint             # Lint all code
pnpm format           # Format all code
pnpm typecheck        # Type check TypeScript
```

### Database

```bash
pnpm db:generate      # Generate Prisma Client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create migration
pnpm db:studio        # Open database GUI
pnpm db:seed          # Seed with example data
```

### Utilities

```bash
pnpm graph            # View project dependency graph
pnpm clean            # Clean build artifacts
pnpm generate:vapid   # Generate VAPID keys for Web Push
pnpm hash:password    # Hash password with Argon2 (for ADMIN_PASSWORD_HASH)
```

See [docs/npm-scripts.md](docs/npm-scripts.md) for detailed documentation.

## 📚 Documentation

### Getting Started

- [Setup & Installation Guide](docs/setup-installation.md) - **Start here!** Complete setup instructions
- [NPM Scripts Reference](docs/npm-scripts.md)
- [Database Setup](docs/database-setup.md) - Neon + Prisma configuration

### Features & Configuration

- [Cloudflare R2 Setup](docs/cloudflare-r2-setup.md) - Object storage with zero egress fees
- [Web Push Setup](docs/web-push-setup.md) - Push notifications with VAPID
- [PWA Setup](docs/pwa-setup.md) - Progressive Web App configuration

### Development Workflow

- [Code Quality Setup](docs/code-quality-setup.md) - Prettier, Husky, lint-staged
- [Pre-commit Workflow](docs/pre-commit-workflow.md) - How git hooks work
- [Git Commands Cheatsheet](docs/git-commands-cheatsheet.md) - Quick reference

### Deployment

- [Vercel Deployment](docs/vercel-deployment.md) - Deploy frontend (recommended)
- [Render Deployment](docs/render-deployment.md) - Deploy backend
- [Secrets Management](docs/secrets-management.md) - Environment variables & secrets
- [Shared Types Library](libs/types/README.md)

## 🏗️ Development

### Adding a New Feature

1. Create shared types in `libs/types/src/lib/types.ts`
2. Implement backend API in `apps/src/`
3. Build frontend UI in `apps/frontend/src/`
4. Use shared types: `import { ... } from '@emma-project/types'`

### Project Commands

```bash
# Generate new library
pnpm nx g @nx/js:library my-lib --directory=libs/my-lib

# Show project details
pnpm nx show project frontend

# Run affected projects only
pnpm nx affected -t test
```

## 🌐 Default Ports

- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:3000

## 🔧 Configuration

- **Nx**: `nx.json`
- **TypeScript**: `tsconfig.base.json`
- **ESLint**: `eslint.config.mjs`
- **Prettier**: `.prettierrc`
- **Tailwind**: `apps/frontend/tailwind.config.js`

## 📦 Shared Libraries

### @emma-project/types

Shared TypeScript types and interfaces used across frontend and backend.

```typescript
import { User, ApiResponse } from '@emma-project/types';
```

See [libs/types/README.md](libs/types/README.md) for details.

## 🚢 Deployment

### Recommended Setup (Free Forever)

- **Frontend:** Deploy to [Vercel](https://vercel.com) - See [docs/vercel-deployment.md](docs/vercel-deployment.md)
  - ✅ Global CDN, preview deployments, analytics
  - ✅ 100 GB bandwidth/month
  - ✅ Never sleeps, always fast

- **Backend:** Deploy to [Render](https://render.com) - See [docs/render-deployment.md](docs/render-deployment.md)
  - ✅ 750 hours/month
  - ⚠️ Sleeps after 15 min inactivity

Build artifacts are generated in the `dist/` directory:

```bash
# Build for production
pnpm build

# Outputs:
# - dist/apps/frontend/    (Static files for frontend)
# - dist/apps/             (Compiled backend)
```

## 📖 Learn More

- [Nx Documentation](https://nx.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run `pnpm lint` and `pnpm typecheck`
4. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
5. Submit a pull request

## 📄 License

MIT
