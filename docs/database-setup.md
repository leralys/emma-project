ac# Database Setup Guide (Neon + Prisma)

## 🗄️ Tech Stack

- **Neon** - Serverless Postgres database
- **Prisma** - Next-generation ORM
- **@prisma/adapter-neon** - Prisma adapter for Neon's serverless driver

## 📦 Installed Packages

| Package                    | Version | Type          | Purpose                 |
| -------------------------- | ------- | ------------- | ----------------------- |
| `@neondatabase/serverless` | ^1.0.2  | dependency    | Neon Postgres driver    |
| `@prisma/adapter-neon`     | ^6.18.0 | dependency    | Prisma adapter for Neon |
| `@prisma/client`           | ^6.18.0 | dependency    | Prisma Client           |
| `prisma`                   | ^6.18.0 | devDependency | Prisma CLI              |
| `ws`                       | ^8.18.3 | dependency    | WebSocket for Neon      |
| `@types/ws`                | ^8.18.1 | devDependency | TypeScript types for ws |
| `tsx`                      | ^4.20.6 | devDependency | TypeScript executor     |
| `dotenv-cli`               | ^10.0.0 | devDependency | Load .env files         |

---

## 🚀 Quick Start

### 1. Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Copy your connection string

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Pooled connection (for Prisma Client with serverless functions)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Direct connection (for migrations)
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"
```

**Important:**

- `DATABASE_URL` - Use the **pooled connection string** from Neon
- `DIRECT_URL` - Use the **direct connection string** from Neon

### 3. Generate Prisma Client

```bash
pnpm db:generate
```

### 4. Push Schema to Database

```bash
# Push schema without creating migrations (good for development)
pnpm db:push

# OR create a migration (recommended for production)
pnpm db:migrate
```

### 5. Seed Database (Optional)

```bash
pnpm db:seed
```

---

## 📜 Available Scripts

| Script              | Command                 | Description                             |
| ------------------- | ----------------------- | --------------------------------------- |
| `db:generate`       | `prisma generate`       | Generate Prisma Client                  |
| `db:push`           | `prisma db push`        | Push schema to database (no migrations) |
| `db:migrate`        | `prisma migrate dev`    | Create and apply migration              |
| `db:migrate:deploy` | `prisma migrate deploy` | Deploy migrations (production)          |
| `db:studio`         | `prisma studio`         | Open Prisma Studio (DB GUI)             |
| `db:seed`           | `tsx prisma/seed.ts`    | Seed database with example data         |

---

## 📝 Schema File

Location: `prisma/schema.prisma`

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}
```

---

## 🔧 Usage in Backend (NestJS)

### Create Prisma Module

```typescript
// libs/database/src/lib/prisma.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

let prisma: PrismaClient;

function getPrismaClient(): PrismaClient {
  if (prisma) {
    return prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({ adapter });

  return prisma;
}

export const db = getPrismaClient();
```

### Use in NestJS Service

```typescript
// apps/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { db } from '@emma-project/database';

@Injectable()
export class UsersService {
  async findAll() {
    return db.user.findMany();
  }

  async findOne(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  async create(data: { email: string; name: string }) {
    return db.user.create({
      data,
    });
  }

  async update(id: string, data: { email?: string; name?: string }) {
    return db.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return db.user.delete({
      where: { id },
    });
  }
}
```

---

## 🎯 Common Workflows

### Adding a New Model

1. Edit `prisma/schema.prisma`:

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Decimal  @db.Decimal(10, 2)
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("products")
}
```

2. Generate Prisma Client:

```bash
pnpm db:generate
```

3. Push to database:

```bash
# Development (no migration)
pnpm db:push

# Production (with migration)
pnpm db:migrate
```

### Creating a Migration

```bash
# Create and apply migration
pnpm db:migrate

# This will prompt you for a migration name
# Example: "add_products_table"
```

### Updating the Schema

1. Modify `prisma/schema.prisma`
2. Run `pnpm db:generate`
3. Run `pnpm db:migrate` or `pnpm db:push`

### Viewing Data with Prisma Studio

```bash
pnpm db:studio
```

Opens a web UI at `http://localhost:5555` where you can:

- View all data
- Edit records
- Run queries

---

## 🔍 Prisma Client Examples

### Create

```typescript
const user = await db.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
  },
});
```

### Read

```typescript
// Find many
const users = await db.user.findMany();

// Find unique
const user = await db.user.findUnique({
  where: { id: '123' },
});

// Find with relations
const userWithPosts = await db.user.findUnique({
  where: { id: '123' },
  include: { posts: true },
});
```

### Update

```typescript
const user = await db.user.update({
  where: { id: '123' },
  data: { name: 'Jane Doe' },
});
```

### Delete

```typescript
await db.user.delete({
  where: { id: '123' },
});

// Delete many
await db.user.deleteMany({
  where: { email: { contains: '@test.com' } },
});
```

### Complex Queries

```typescript
// Filtering and sorting
const posts = await db.post.findMany({
  where: {
    published: true,
    title: { contains: 'Prisma' },
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Aggregation
const userCount = await db.user.count();
const avgPosts = await db.post.aggregate({
  _avg: { viewCount: true },
});
```

---

## 🔐 Environment Variables

### .env.example

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# App Configuration
NODE_ENV="development"
PORT="3000"

# VAPID Keys for Web Push
VAPID_PUBLIC_KEY="your-public-key"
VAPID_PRIVATE_KEY="your-private-key"
VAPID_SUBJECT="mailto:your-email@example.com"
```

**⚠️ Never commit `.env` to git!** (Already in `.gitignore`)

---

## 🚢 Deployment

### Production Setup

1. Set environment variables in your hosting platform
2. Run migrations:

```bash
pnpm db:migrate:deploy
```

3. Generate Prisma Client:

```bash
pnpm db:generate
```

### Neon Branching

Neon supports database branching:

- Create a branch for each PR
- Test migrations safely
- Merge when ready

```bash
# In Neon Console, create a branch
# Update DATABASE_URL to point to branch
# Run migrations on branch
pnpm db:migrate
```

---

## 🐛 Troubleshooting

### "PrismaClient is not configured for driverAdapters"

**Solution:** Make sure `previewFeatures = ["driverAdapters"]` is in your schema.

### "Cannot find module '@prisma/client'"

**Solution:** Run `pnpm db:generate`

### Migration Errors

```bash
# Reset database (⚠️ deletes all data!)
pnpm exec prisma migrate reset

# Push schema without migrations
pnpm db:push --force-reset
```

### Connection Issues

1. Check `.env` file exists and has correct values
2. Verify connection strings from Neon Console
3. Ensure IP is whitelisted in Neon (usually auto-configured)

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma with Neon](https://www.prisma.io/docs/guides/database/neon)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

## 💡 Best Practices

1. **Use migrations in production** - Don't use `db:push` in production
2. **Keep schema organized** - Group related models
3. **Use meaningful names** - Follow naming conventions
4. **Add indexes** - For frequently queried fields
5. **Use transactions** - For multi-step operations
6. **Handle errors** - Use try/catch blocks
7. **Close connections** - Use `finally` blocks

### Transaction Example

```typescript
const result = await db.$transaction([
  db.user.create({ data: { email: 'test@example.com', name: 'Test' } }),
  db.post.create({ data: { title: 'Test Post', authorId: '...' } }),
]);
```

---

## 🎓 Next Steps

1. Customize the models in `prisma/schema.prisma`
2. Generate Prisma Client: `pnpm db:generate`
3. Push schema to Neon: `pnpm db:push`
4. Create your first service using Prisma
5. Open Prisma Studio: `pnpm db:studio`
