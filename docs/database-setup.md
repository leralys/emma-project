# Database Setup Guide (Neon + Prisma)

## 🗄️ Tech Stack

- **Neon** - Serverless Postgres database
- **Prisma** - Next-generation ORM
- **@prisma/adapter-neon** - Prisma adapter for Neon's serverless driver

---

## 🚀 Quick Start

### 1. Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Create a development branch (e.g., "development")
   - Click **Branches** → **Create Branch**
   - Name it "development" (or your preferred name)
   - This gives you a safe environment to test migrations
4. Copy the development branch connection strings for local development

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Pooled connection (for Prisma Client)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Direct connection (for migrations)
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"
```

**Important:** For development, use a Neon **development branch** database, not your production database. This allows you to test migrations safely before deploying to production.

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

### 4. Push Schema to Database

```bash
# Development: Push schema without migrations
pnpm db:push

# Production: Create migration
pnpm db:migrate
```

### 5. Seed Database

```bash
pnpm db:seed
```

This creates:

- 1 admin user (ID: `admin-user-id`, Password: `admin123`)
- 3 regular users (Alice, Bob, Charlie)
- 2 devices with push subscriptions
- 2 threads (1 direct chat, 1 group)
- 3 messages (2 delivered, 1 scheduled)
- 2 read receipts

---

## 📜 Available Scripts

| Script              | Command                 | Description                     |
| ------------------- | ----------------------- | ------------------------------- |
| `db:generate`       | `prisma generate`       | Generate Prisma Client          |
| `db:push`           | `prisma db push`        | Push schema (no migrations)     |
| `db:migrate`        | `prisma migrate dev`    | Create and apply migration      |
| `db:migrate:deploy` | `prisma migrate deploy` | Deploy migrations (production)  |
| `db:studio`         | `prisma studio`         | Open Prisma Studio (DB GUI)     |
| `db:seed`           | `tsx prisma/seed.ts`    | Seed database with example data |

---

## 📝 Schema Overview

Location: `prisma/schema.prisma`

### Models

- **User** - Users with roles (admin/user)
- **UserRole** - Role assignments (many-to-many)
- **Device** - User devices with device keys and push subscriptions
- **Thread** - Conversation threads
- **ThreadParticipant** - Thread members (many-to-many)
- **Message** - Encrypted messages with scheduling support
- **MessageReadReceipt** - Message read tracking

---

## 🔧 Usage in Backend

The Prisma Client is configured in `libs/database/src/lib/prisma.ts` and exported as `db`.

```typescript
import { db } from '@emma-project/database';

// Query users
const users = await db.user.findMany({
  include: { roles: true, devices: true },
});

// Create a message
const message = await db.message.create({
  data: {
    threadId: 'thread-id',
    senderId: 'user-id',
    ciphertext: Buffer.from('encrypted'),
    iv: Buffer.from('iv'),
    salt: Buffer.from('salt'),
    mediaUrls: [],
  },
});
```

---

## 🎯 Migration Workflow

### Development Workflow (Feature Branch)

When developing new features that require schema changes:

```bash
# 1. Create a Neon development branch database
# In Neon Console: Create new branch from main (e.g., "dev-add-notifications")
# Update your .env with the development branch connection strings

# 2. Create a git feature branch
git checkout -b feature/add-notifications

# 3. Update schema
# Edit prisma/schema.prisma

# 4. Create migration (applies to your Neon dev branch database)
pnpm db:migrate
# Enter migration name: "add_notifications"

# 5. Test your changes locally
pnpm db:seed  # Optional: seed test data
pnpm dev      # Test the feature

# 6. Commit migration files to git
git add prisma/migrations/
git add prisma/schema.prisma
git commit -m "feat(db): add notifications table"

# 7. Push to remote
git push origin feature/add-notifications
```

**Important:**

- Always test migrations on a **Neon development branch** database first
- The migration is created and tested on your development branch
- Once tested, commit migration files to git
- Neon branches allow you to test schema changes safely without affecting production

### Production Deployment

When you merge to main and deploy:

```bash
# 1. Merge PR to main
git checkout main
git merge feature/add-notifications
git push origin main

# 2. Render auto-deploys and runs migrations automatically
# The build command includes:
# - pnpm db:migrate:deploy (applies pending migrations)
# - pnpm db:generate (generates Prisma Client)
# - pnpm build:backend (builds the app)
```

**How it works:** When Render builds your app, it runs `pnpm db:migrate:deploy` which applies any new migration files from `prisma/migrations/` to the production database.

### Quick Reference

| Command        | When to Use                      | What It Does                     |
| -------------- | -------------------------------- | -------------------------------- |
| `db:push`      | Prototyping (dev only)           | Push schema without migration    |
| `db:migrate`   | Feature development              | Create migration + apply locally |
| `db:generate`  | After pulling changes / in build | Generate Prisma Client           |
| Build (Render) | Automatic on deploy              | Applies pending migrations       |

### Viewing Data

```bash
pnpm db:studio
```

Opens Prisma Studio at `http://localhost:5555` to view and edit data.

### Resetting Database

```bash
# ⚠️ Deletes all data!
pnpm exec prisma migrate reset
```

---

## 🚢 Deployment

### Production Setup

1. Set `DATABASE_URL` and `DIRECT_URL` in your hosting platform
2. Run migrations: `pnpm db:migrate:deploy`
3. Generate client: `pnpm db:generate`

---

## 🐛 Troubleshooting

**Cannot find module '@prisma/client'**

- Run `pnpm db:generate`

**Migration errors**

- Reset database: `pnpm exec prisma migrate reset` (⚠️ deletes data)

**Connection issues**

- Verify `.env` has correct connection strings from Neon Console

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma with Neon Guide](https://www.prisma.io/docs/guides/database/neon)
