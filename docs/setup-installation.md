# Setup & Installation Guide

Complete guide for setting up the Emma Project on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Installing Dependencies](#installing-dependencies)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Verify Installation](#verify-installation)
- [Adding New Dependencies](#adding-new-dependencies)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

Before you begin, ensure you have the following installed:

#### 1. Node.js

**Recommended version:** Node.js 20.x or higher

Check your Node.js version:

```bash
node --version
```

If you need to install or update Node.js:

- **Official installer:** [nodejs.org](https://nodejs.org/)
- **Using nvm (recommended):**

  ```bash
  # Install nvm (Node Version Manager)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

  # Install Node.js 20
  nvm install 20
  nvm use 20
  ```

#### 2. pnpm

**This project uses pnpm** as the package manager (not npm or yarn).

Check if pnpm is installed:

```bash
pnpm --version
```

If not installed, install pnpm globally:

```bash
# Using npm (comes with Node.js)
npm install -g pnpm

# Or using Homebrew (macOS)
brew install pnpm

# Or using Corepack (built into Node.js 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

#### 3. Git

Check if Git is installed:

```bash
git --version
```

Install Git if needed: [git-scm.com](https://git-scm.com/)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd emma-project
```

### 2. Verify Project Structure

Ensure you're in the correct directory:

```bash
ls
# You should see: apps/ libs/ docs/ package.json nx.json etc.
```

## Installing Dependencies

### Install All Dependencies

Run the following command in the project root:

```bash
pnpm install
```

This will:

- Install all dependencies defined in `package.json`
- Create/update `pnpm-lock.yaml`
- Set up Git hooks (Husky)
- Run the `prepare` script automatically

**Expected output:**

```
Packages: +1703
Progress: resolved 1703, reused 1701, downloaded 0, added 1703, done

> @emma-project/source@0.0.0 prepare
> husky

Done in 7.2s
```

### What Gets Installed?

- **Frontend dependencies:** React, Vite, Tailwind CSS, React Router, etc.
- **Backend dependencies:** NestJS, Prisma, Argon2, Web Push, etc.
- **Development tools:** ESLint, Prettier, Playwright, TypeScript, etc.
- **Nx workspace tools:** Build system and monorepo management

## Database Setup

After installing dependencies, set up your database:

### 1. Create `.env` file

Copy the example environment file:

```bash
cp .env.example .env
```

This will create a `.env` file with all required and optional environment variables.

### 2. Configure Database Connection

Edit `.env` and add your Neon PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

See [database-setup.md](./database-setup.md) for detailed instructions.

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

### 4. Run Database Migrations

```bash
pnpm db:push
```

Or for production:

```bash
pnpm db:migrate:deploy
```

### 5. (Optional) Seed Database

```bash
pnpm db:seed
```

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Backend
NODE_ENV="development"
JWT_SECRET="your-jwt-secret"

# Admin Authentication
ADMIN_PASSWORD_HASH="$argon2id$v=19$m=65536,t=3,p=4$..."

# Cloudflare R2 (optional)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket-name"

# Web Push (optional)
VAPID_PUBLIC_KEY="your-public-key"
VAPID_PRIVATE_KEY="your-private-key"
VAPID_SUBJECT="mailto:your-email@example.com"
```

### Generate Admin Password Hash

To generate the `ADMIN_PASSWORD_HASH`:

```bash
# Generate hash for your admin password
pnpm hash:password "YourSecureAdminPassword"

# Copy the output and add to .env:
ADMIN_PASSWORD_HASH="$argon2id$v=19$m=65536,t=3,p=4$..."
```

See [secrets-management.md](./secrets-management.md) for detailed information.

## Verify Installation

### 1. Run Development Servers

Start both frontend and backend:

```bash
pnpm dev
```

Or start them separately:

```bash
# Terminal 1 - Frontend
pnpm dev:frontend

# Terminal 2 - Backend
pnpm dev:backend
```

### 2. Check URLs

- **Frontend:** http://localhost:4200
- **Backend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api

### 3. Verify Frontend

Open http://localhost:4200 in your browser. You should see the application running.

### 4. Verify Backend

Test the API:

```bash
curl http://localhost:3000/api
```

### 5. Run Tests (Optional)

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

## Adding New Dependencies

### ⚠️ Important: Always Use pnpm

**DO NOT use `npm install` or `yarn add`**. This project uses **pnpm** exclusively.

### Add a Production Dependency

```bash
pnpm add <package-name>
```

Example:

```bash
pnpm add axios
pnpm add lodash
```

### Add a Development Dependency

```bash
pnpm add -D <package-name>
```

Example:

```bash
pnpm add -D @types/node
pnpm add -D eslint-plugin-react
```

### Add Dependency to Specific Workspace

```bash
pnpm add <package-name> --filter <workspace-name>
```

Example:

```bash
# Add to frontend only
pnpm add axios --filter frontend

# Add to backend only
pnpm add express --filter backend
```

### Remove a Dependency

```bash
pnpm remove <package-name>
```

### Update Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update <package-name>

# Update to latest versions (interactive)
pnpm up --interactive --latest
```

## Troubleshooting

### Issue: "Command not found: pnpm"

**Solution:** Install pnpm globally:

```bash
npm install -g pnpm
```

### Issue: Corrupted Nx Cache

**Symptoms:**

```
Error: dlopen(.../.nx/cache/18.3.5-nx.darwin-arm64.node, 0x0001):
segment '__TEXT' load command content extends beyond end of file
```

**Solution:**

```bash
# Remove corrupted cache
rm -rf .nx/cache

# Remove node_modules
rm -rf node_modules

# Clean npm cache (if you accidentally used npm)
npm cache clean --force

# Reinstall with pnpm
pnpm install
```

### Issue: "package-lock.json" or "yarn.lock" Present

**Problem:** These files indicate the wrong package manager was used.

**Solution:**

```bash
# Remove wrong lock files
rm -f package-lock.json yarn.lock

# Remove node_modules
rm -rf node_modules

# Reinstall with pnpm
pnpm install
```

### Issue: Permission Errors During Installation

**Symptoms:**

```
npm error syscall open
npm error errno EPERM
```

**Solution:**

```bash
# Clean npm cache
npm cache clean --force

# Or fix npm cache permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Then reinstall
pnpm install
```

### Issue: Husky Git Hooks Not Working

**Symptoms:** Pre-commit hooks don't run when committing.

**Solution:**

```bash
# Reinstall Husky
pnpm install

# Or manually set up Husky
pnpm exec husky install
```

### Issue: Database Connection Errors

**Symptoms:**

```
PrismaClientInitializationError: Can't reach database server
```

**Solution:**

1. Verify your `DATABASE_URL` in `.env`
2. Check internet connection (for Neon cloud database)
3. Ensure database exists
4. Check [database-setup.md](./database-setup.md) for troubleshooting

### Issue: Port Already in Use

**Symptoms:**

```
Error: listen EADDRINUSE: address already in use :::4200
```

**Solution:**

```bash
# Find and kill process using the port
# macOS/Linux
lsof -ti:4200 | xargs kill -9

# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Or change the port in project.json
```

### Issue: Module Not Found After Installation

**Symptoms:**

```
Error: Cannot find module '<package-name>'
```

**Solution:**

```bash
# Clear Nx cache
pnpm nx reset

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### Issue: TypeScript Errors After Adding Dependency

**Solution:**

```bash
# Regenerate TypeScript types
pnpm typecheck

# Check if @types package needed
pnpm add -D @types/<package-name>
```

### Issue: Build Fails with "Out of Memory"

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Or add to package.json scripts
"build": "NODE_OPTIONS='--max-old-space-size=4096' nx run-many -t build"
```

### Issue: Stale Cache After Switching Branches

**Solution:**

```bash
# Reset Nx cache
pnpm nx reset

# Clean and reinstall
rm -rf node_modules .nx/cache
pnpm install
```

## Getting Help

If you encounter issues not covered here:

1. Check the [documentation folder](../docs/)
2. Review [troubleshooting in deployment docs](./render-deployment.md#troubleshooting)
3. Search for similar issues in the repository
4. Check Nx documentation: [nx.dev](https://nx.dev)

## Next Steps

After successful installation:

1. ✅ Read [npm-scripts.md](./npm-scripts.md) for available commands
2. ✅ Review [code-quality-setup.md](./code-quality-setup.md) for development workflow
3. ✅ Check [database-setup.md](./database-setup.md) if working with the database
4. ✅ See [web-push-setup.md](./web-push-setup.md) for push notification setup
5. ✅ Review [pwa-setup.md](./pwa-setup.md) for PWA features

## Summary Checklist

- [ ] Node.js 20+ installed
- [ ] pnpm installed globally
- [ ] Repository cloned
- [ ] `pnpm install` completed successfully
- [ ] `.env` file created with required variables
- [ ] Database migrations run
- [ ] Development servers start successfully
- [ ] Frontend accessible at http://localhost:4200
- [ ] Backend accessible at http://localhost:3000

---

**Last Updated:** October 2025
