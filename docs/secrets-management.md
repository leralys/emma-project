# Secrets Management for Deployment

## 🔒 Why Use Secrets Storage?

**Benefits over `.env` files:**

- ✅ **Encrypted at rest** - Secrets are encrypted in the platform
- ✅ **Not in Git** - Never accidentally commit secrets
- ✅ **Access control** - Team permissions
- ✅ **Audit logs** - Track who changed what
- ✅ **Environment-specific** - Different secrets for dev/staging/prod
- ✅ **Auto-injected** - Available as environment variables at runtime

---

## 🚀 Vercel Secrets (Frontend)

### Adding Secrets via Dashboard

1. **Go to your project on Vercel**
2. **Settings → Environment Variables**
3. **Add your secrets:**

   | Key                     | Value                               | Environment                      |
   | ----------------------- | ----------------------------------- | -------------------------------- |
   | `VITE_API_URL`          | `https://emma-backend.onrender.com` | Production, Preview, Development |
   | `VITE_VAPID_PUBLIC_KEY` | `your-vapid-public-key`             | Production, Preview, Development |
   | `VITE_GA_ID`            | `G-XXXXXXXXXX`                      | Production only                  |

4. **Click "Save"**
5. **Redeploy** - Secrets are applied on next deployment

### Adding Secrets via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add a secret
vercel env add VITE_API_URL production
# Paste value when prompted

# Add for all environments
vercel env add VITE_VAPID_PUBLIC_KEY
# Select: Production, Preview, Development

# List all environment variables
vercel env ls

# Pull env vars for local development
vercel env pull .env.local
```

### Using Secrets in Code

```typescript
// ✅ Access via import.meta.env (Vite)
const apiUrl = import.meta.env.VITE_API_URL;
const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// ✅ With fallbacks for local dev
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### Environment Types

- **Production** - `vercel.app` domain or custom domain
- **Preview** - Branch/PR deployments
- **Development** - `vercel dev` local environment

---

## 🎯 Render Secrets (Backend)

### Adding Secrets via Dashboard

1. **Go to your service on Render**
2. **Environment → Environment Variables**
3. **Add your secrets:**

   | Key                    | Value                    |
   | ---------------------- | ------------------------ |
   | `DATABASE_URL`         | `postgresql://...`       |
   | `DIRECT_URL`           | `postgresql://...`       |
   | `VAPID_PUBLIC_KEY`     | `your-vapid-public-key`  |
   | `VAPID_PRIVATE_KEY`    | `your-vapid-private-key` |
   | `VAPID_SUBJECT`        | `mailto:your@email.com`  |
   | `R2_ACCOUNT_ID`        | `your-r2-account-id`     |
   | `R2_ACCESS_KEY_ID`     | `your-access-key`        |
   | `R2_SECRET_ACCESS_KEY` | `your-secret-key`        |
   | `R2_BUCKET_NAME`       | `your-bucket-name`       |

4. **Click "Save Changes"**
5. **Auto-redeploys** - Service restarts automatically

### Generating Secrets

```bash
# Generate VAPID keys
pnpm generate:vapid
```

### Using Secrets in Code

```typescript
// ✅ Access via process.env (Node.js)
const dbUrl = process.env.DATABASE_URL;
const vapidKey = process.env.VAPID_PUBLIC_KEY;

// ✅ With validation
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  VAPID_PUBLIC_KEY: z.string(),
  VAPID_PRIVATE_KEY: z.string(),
});

const env = envSchema.parse(process.env);
```

### Secret Files (for Render Blueprint)

Update `render.yaml` to reference secrets:

```yaml
services:
  - type: web
    name: emma-backend
    envVars:
      - key: DATABASE_URL
        sync: false # ← Manually set in dashboard (secret)
      - key: VAPID_PRIVATE_KEY
        sync: false # ← Not in Git, only in Render
      - key: NODE_ENV
        value: production # ← Public, can be in Git
```

**`sync: false`** = Must be set in Render dashboard (for secrets)  
**`value: ...`** = Hardcoded in Git (for non-secrets)

---

## 🔐 Secret Types by Environment

### Public (Can be in Git)

```yaml
# In render.yaml
- key: NODE_ENV
  value: production

- key: PORT
  value: 3000
```

### Private (Render Dashboard Only)

- `DATABASE_URL` - Database connection string
- `DIRECT_URL` - Database direct connection
- `VAPID_PRIVATE_KEY` - Push notification private key
- `R2_SECRET_ACCESS_KEY` - Storage secret key

### Semi-Public (Frontend)

Frontend env vars are **bundled into JS**, so they're not truly secret:

```typescript
// ⚠️ These are visible in browser
VITE_API_URL=https://api.example.com
VITE_VAPID_PUBLIC_KEY=BN...  // Public key (safe to expose)

// ❌ NEVER put in frontend
VITE_JWT_SECRET=...  // ← DON'T DO THIS!
VITE_DATABASE_URL=...  // ← DON'T DO THIS!
```

---

## 📋 Complete Secrets Checklist

### For Vercel (Frontend)

```bash
# Required
VITE_API_URL=https://emma-backend.onrender.com
VITE_VAPID_PUBLIC_KEY=BN...

# Optional
VITE_GA_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://...
VITE_PUBLIC_URL=https://emma-frontend.vercel.app
```

### For Render (Backend)

```bash
# Database (from Neon)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Web Push (from pnpm generate:vapid)
VAPID_PUBLIC_KEY=BN...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:your@email.com

# Cloudflare R2 (from Cloudflare dashboard)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=emma-storage

# Optional
CORS_ORIGIN=https://emma-frontend.vercel.app
```

---

## 🛠️ Local Development

### Setup `.env` for Local Dev

1. **Copy example file:**

   ```bash
   cp .env.example .env
   ```

2. **Fill in values:**

   ```bash
   # .env (gitignored)
   DATABASE_URL=postgresql://...
   DIRECT_URL=postgresql://...
   VAPID_PUBLIC_KEY=...
   VAPID_PRIVATE_KEY=...
   VAPID_SUBJECT=mailto:your@email.com
   ```

3. **Use in development:**
   ```bash
   pnpm dev  # Automatically loads .env
   ```

### Pull Secrets from Platforms

```bash
# Pull from Vercel
vercel env pull .env.local

# Render doesn't have CLI pull, but you can:
# 1. Go to Render dashboard
# 2. Copy environment variables
# 3. Paste into .env
```

---

## 🔄 Rotating Secrets

### When to Rotate:

- ✅ **Regularly** - Every 90 days (best practice)
- ✅ **After employee leaves** - Revoke access
- ✅ **After breach** - Immediately
- ✅ **After accidental commit** - Even if removed from Git

### How to Rotate:

#### 1. **Database URL (Neon)**

```bash
# Neon dashboard → Reset password
# Update DATABASE_URL and DIRECT_URL in Render
# Redeploy
```

#### 2. **VAPID Keys**

```bash
# Generate new keys
pnpm generate:vapid

# Update in Render (backend)
VAPID_PUBLIC_KEY=new-key
VAPID_PRIVATE_KEY=new-key

# Update in Vercel (frontend)
VITE_VAPID_PUBLIC_KEY=new-key

# ⚠️ All existing push subscriptions become invalid
# Users need to re-subscribe
```

#### 3. **R2 Keys (Cloudflare)**

```bash
# Cloudflare dashboard → R2 → API Tokens
# Create new token → Delete old token
# Update in Render:
R2_ACCESS_KEY_ID=new-key
R2_SECRET_ACCESS_KEY=new-secret
```

---

## 🚨 If You Accidentally Commit a Secret

### Immediate Steps:

```bash
# 1. Rotate the secret IMMEDIATELY
#    (Generate new key, update in platforms)

# 2. Remove from Git history (if recent)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (⚠️ coordinate with team)
git push origin --force --all

# 4. Better: Use tool like BFG Repo-Cleaner
# https://rtyley.github.io/bfg-repo-cleaner/
```

### Prevention:

```bash
# 1. Use .gitignore (✅ already set up)
# .env
# .env.local
# .env*.local

# 2. Use pre-commit hook to scan for secrets
# Install: https://github.com/Yelp/detect-secrets

# 3. Enable GitHub secret scanning
# Settings → Security → Secret scanning
```

---

## 📊 Secrets Comparison

| Platform       | Storage           | Encryption | Audit Logs | CLI Access | Team Access   |
| -------------- | ----------------- | ---------- | ---------- | ---------- | ------------- |
| **Vercel**     | Built-in          | ✅ Yes     | ✅ Yes     | ✅ Yes     | ✅ Yes (Pro)  |
| **Render**     | Built-in          | ✅ Yes     | ✅ Yes     | ❌ No      | ✅ Yes (Team) |
| **Neon**       | Connection string | ✅ Yes     | ✅ Yes     | ✅ Yes     | ✅ Yes        |
| **Cloudflare** | API tokens        | ✅ Yes     | ✅ Yes     | ✅ Yes     | ✅ Yes        |

---

## ✅ Best Practices

### ✅ DO:

1. **Use platform secrets** - Never commit `.env` to Git
2. **Rotate regularly** - Every 90 days
3. **Use different secrets per environment** - dev/staging/prod
4. **Validate env vars** - Use Zod or similar
5. **Document required secrets** - In `.env.example`
6. **Use strong secrets** - 32+ characters, random
7. **Limit access** - Only who needs it
8. **Enable audit logs** - Track changes

### ❌ DON'T:

1. **Don't commit `.env`** - Use `.env.example` instead
2. **Don't share in Slack/Email** - Use secure sharing tools
3. **Don't reuse secrets** - Each environment should be unique
4. **Don't use weak secrets** - No "password123"
5. **Don't put secrets in code** - Use env vars
6. **Don't put secrets in frontend** - Only public keys
7. **Don't screenshot secrets** - Copy/paste text only
8. **Don't log secrets** - Mask in logs

---

## 🔧 Environment Validation Example

You can validate environment variables on startup using Zod:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  VAPID_PUBLIC_KEY: z.string().min(80),
  VAPID_PRIVATE_KEY: z.string().min(40),
  VAPID_SUBJECT: z.string().email().or(z.string().startsWith('mailto:')),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
});

export function validateEnv() {
  return envSchema.parse(process.env);
}
```

---

## 🎉 Summary

**For Production:**

1. ✅ **Never commit secrets** - Use `.gitignore`
2. ✅ **Use Vercel secrets** - For frontend env vars
3. ✅ **Use Render secrets** - For backend env vars
4. ✅ **Rotate regularly** - Every 90 days
5. ✅ **Validate on startup** - Fail fast if missing

**Your secrets are safe!** 🔒

---

## 🔗 Useful Links

- **Vercel Env Vars:** [vercel.com/docs/environment-variables](https://vercel.com/docs/projects/environment-variables)
- **Render Secrets:** [render.com/docs/environment-variables](https://render.com/docs/environment-variables)
- **Neon Security:** [neon.tech/docs/security](https://neon.tech/docs/security)
- **OWASP Secrets Management:** [cheatsheetseries.owasp.org](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
