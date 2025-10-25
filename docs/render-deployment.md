# Render Deployment Guide

## 🚀 What is Render?

Render is a modern cloud platform that makes deploying web apps easy. It's similar to Heroku but with better performance and pricing.

### Why Render?

- ✅ **Free Tier** - Deploy backend and frontend for free
- ✅ **Auto-deploy** - Deploys on git push
- ✅ **HTTPS** - Free SSL certificates
- ✅ **Easy setup** - No complex configuration
- ✅ **Good performance** - Fast global CDN

---

## 💰 Pricing

### Free Tier Includes:

**Backend (Web Service):**

- 750 hours/month runtime
- 512 MB RAM
- Automatic sleep after 15 min inactivity
- Free SSL
- Auto-deploy on git push

**Frontend (Static Site):**

- Unlimited bandwidth
- Global CDN
- Free SSL
- Free forever!

**Paid Plans:** Start at $7/month for always-on backend

---

## ✅ No Installation Needed!

Your project is **already configured** for Render deployment:

- ✅ `render.yaml` configuration file
- ✅ Health endpoint at `/health`
- ✅ Build scripts in `package.json`
- ✅ Environment variable support

---

## 🚀 Quick Deploy

### Option 1: Deploy with Blueprint (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Render**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click **New** → **Blueprint**
   - Select your repository
   - Render will read `render.yaml` automatically

3. **Set Environment Variables** (in Render dashboard):
   - `DATABASE_URL` - From Neon
   - `DIRECT_URL` - From Neon
   - `VAPID_PUBLIC_KEY` - Generated key
   - `VAPID_PRIVATE_KEY` - Generated key
   - `VAPID_SUBJECT` - Your email
   - `R2_ACCOUNT_ID` - From Cloudflare
   - `R2_ACCESS_KEY_ID` - From Cloudflare
   - `R2_SECRET_ACCESS_KEY` - From Cloudflare
   - `R2_BUCKET_NAME` - Your bucket name

4. **Deploy** 🎉
   - Click **Apply**
   - Wait for build (~3-5 minutes)
   - Your apps are live!

### Option 2: Manual Deploy

#### Deploy Backend

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `emma-backend`
   - **Region:** Oregon (or closest)
   - **Branch:** `main`
   - **Root Directory:** (leave empty)
   - **Environment:** Node
   - **Build Command:** `pnpm install && pnpm db:migrate:deploy && pnpm db:generate && pnpm build:backend`
   - **Start Command:** `node dist/apps/main.js`
   - **Plan:** Free
5. Add environment variables (see list above)
6. Add **Health Check Path:** `/health`
7. Click **Create Web Service**

#### Deploy Frontend

1. Click **New** → **Static Site**
2. Connect same repository
3. Configure:
   - **Name:** `emma-frontend`
   - **Branch:** `main`
   - **Build Command:** `pnpm install && pnpm build:frontend`
   - **Publish Directory:** `dist/apps/frontend`
4. Click **Create Static Site**

---

## 🔧 Configuration Details

### Backend Configuration

The backend uses these settings:

```yaml
# render.yaml
services:
  - type: web
    name: emma-backend
    env: node
    buildCommand: pnpm install && pnpm db:migrate:deploy && pnpm db:generate && pnpm build:backend
    startCommand: node dist/apps/main.js
    healthCheckPath: /health
```

**Why these commands?**

- `pnpm install` - Install dependencies
- `pnpm db:migrate:deploy` - Apply pending database migrations
- `pnpm db:generate` - Generate Prisma Client
- `pnpm build:backend` - Build NestJS app
- `node dist/apps/main.js` - Start the server

**Important:** Migrations are committed to git in your feature branch, then automatically applied when deployed to production.

### Frontend Configuration

```yaml
- type: web
  name: emma-frontend
  env: static
  buildCommand: pnpm install && pnpm build:frontend
  staticPublishPath: ./dist/apps/frontend
```

**Why static?**

- Faster delivery via CDN
- No server costs
- Better performance
- Automatic caching

---

## 🌍 Custom Domains

### Add Custom Domain

1. In Render dashboard, select your service
2. Go to **Settings** → **Custom Domain**
3. Click **Add Custom Domain**
4. Enter your domain (e.g., `api.yourdomain.com`)
5. Add CNAME record in your DNS:
   ```
   CNAME api.yourdomain.com → your-service.onrender.com
   ```
6. Wait for DNS propagation (~10 minutes)
7. SSL certificate is automatically generated ✅

### Recommended Setup

- `api.yourdomain.com` → Backend
- `app.yourdomain.com` → Frontend
- Or use `yourdomain.com` for frontend

---

## 🔐 Environment Variables

### Required Variables

```bash
# Database (Neon)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Web Push
VAPID_PUBLIC_KEY="..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:your@email.com"

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
R2_PUBLIC_DOMAIN="cdn.yourdomain.com"  # Optional

# App
NODE_ENV="production"
```

### How to Set

1. Go to service dashboard
2. Click **Environment**
3. Click **Add Environment Variable**
4. Enter key and value
5. Click **Save Changes**
6. Service will auto-redeploy

### From .env File

You can also paste all variables at once:

1. Copy content from `.env`
2. Click **Add from .env**
3. Paste and save

---

## 📊 Database Migrations

### How Migrations Work

**Development (Feature Branch):**

1. Create Neon development branch database
2. Update local `.env` with dev branch connection strings
3. Create migration locally: `pnpm db:migrate`
4. Test changes on Neon dev branch
5. Commit migration files to git
6. Push to remote

**Production (Render Deploy):**

1. Merge PR to main
2. Render detects push and runs build command
3. `pnpm db:migrate:deploy` applies pending migrations to production database
4. App builds and deploys

**Important:** Always test migrations on a Neon development branch before deploying to production.

### Build Command

The `render.yaml` includes migrations in the build:

```bash
pnpm install && pnpm db:migrate:deploy && pnpm db:generate && pnpm build:backend
```

**Order matters:**

1. Install dependencies
2. Apply migrations (uses `DIRECT_URL`)
3. Generate Prisma Client
4. Build app

### Manual Migration (if needed)

If you need to run migrations manually:

1. Go to **Shell** tab in Render dashboard
2. Run:

```bash
pnpm db:migrate:deploy
```

See [Database Setup Guide](database-setup.md) for detailed migration workflow.

---

## 🔄 Auto-Deploy

### How It Works

Every time you push to `main` branch:

1. Render detects the push
2. Pulls latest code
3. Runs build command
4. Deploys new version
5. Zero-downtime deployment ✅

### Disable Auto-Deploy

If you want manual control:

1. Go to **Settings**
2. Toggle **Auto-Deploy** off
3. Click **Manual Deploy** when ready

### Deploy Specific Branch

1. Go to **Settings**
2. Change **Branch** to your branch name
3. Save

---

## 📱 CORS Configuration

For frontend to communicate with backend:

```typescript
// apps/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://your-frontend.onrender.com',
      'https://app.yourdomain.com',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application running on port ${port}`);
}

bootstrap();
```

---

## 🧪 Testing Deployment

### 1. Check Health Endpoint

```bash
curl https://your-backend.onrender.com/health
```

Should return:

```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Check Frontend

Visit: `https://your-frontend.onrender.com`

### 3. Check Logs

In Render dashboard:

- Click **Logs** tab
- View real-time logs
- Check for errors

---

## 🐛 Troubleshooting

### Build Fails

**Check:**

1. Build logs in Render dashboard
2. Ensure `pnpm` commands work locally
3. Check if all dependencies are in `package.json`

**Common fixes:**

```bash
# Locally test build
pnpm build:backend
pnpm build:frontend
```

### Server Won't Start

**Check:**

1. `PORT` environment variable (Render sets this automatically)
2. Start command is correct
3. `dist/apps/main.js` exists after build

**Fix:**

```typescript
// apps/src/main.ts
const port = process.env.PORT || 3000;
await app.listen(port, '0.0.0.0'); // Listen on all interfaces
```

### Database Connection Issues

**Check:**

1. `DATABASE_URL` is set correctly
2. Neon database is accessible
3. Check connection string format

**Test connection:**

```bash
# In Render shell
pnpm db:push
```

### Free Tier Sleep

Free tier services sleep after 15 minutes of inactivity.

**Solutions:**

1. Upgrade to paid plan ($7/month)
2. Use [Uptime Robot](https://uptimerobot.com) to ping every 5 minutes
3. Accept the delay (wakes up in ~30 seconds)

### CORS Errors

**Add to backend:**

```typescript
app.enableCors({
  origin: 'https://your-frontend-url.onrender.com',
  credentials: true,
});
```

---

## 📈 Monitoring

### Built-in Metrics

Render provides:

- Request count
- Response times
- Memory usage
- CPU usage
- Error rates

View in: **Metrics** tab

### External Monitoring

Recommended services:

- [UptimeRobot](https://uptimerobot.com) - Free uptime monitoring
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay

---

## 💰 Cost Optimization

### Free Tier Tips

1. **Use Static Site** for frontend (always free)
2. **Share database** across environments
3. **Use R2** instead of paid storage
4. **Monitor usage** in dashboard

### When to Upgrade

Upgrade to paid ($7/month) when:

- Need always-on service
- High traffic (>750 hours/month)
- Need faster startup
- Need more RAM

---

## 🚢 Production Checklist

### Before Deploy

- [ ] All environment variables ready
- [ ] `.env.example` updated
- [ ] Database migrations tested
- [ ] Build commands work locally
- [ ] CORS configured
- [ ] Health endpoint working

### After Deploy

- [ ] Test health endpoint
- [ ] Test frontend loads
- [ ] Test API endpoints
- [ ] Check logs for errors
- [ ] Set up custom domains
- [ ] Configure monitoring
- [ ] Set up auto-backup for database

---

## 🔄 CI/CD Workflow

### Automatic Deploy Pipeline

```
Git Push → Render Webhook → Build → Test → Deploy
```

### Manual Steps

1. **Local Development**

```bash
git checkout -b feature/new-feature
# Make changes
git commit -m "feat: add new feature"
git push
```

2. **Create PR** on GitHub

3. **Review & Merge** to main

4. **Auto-Deploy**
   - Render detects merge
   - Builds and deploys
   - Service updates automatically

---

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Render Blueprint Spec](https://render.com/docs/blueprint-spec)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Static Sites on Render](https://render.com/docs/static-sites)

---

## 💡 Tips & Best Practices

1. **Use Blueprint** - Easier to manage multiple services
2. **Environment Groups** - Share env vars across services
3. **Preview Environments** - Test PRs before merging
4. **Health Checks** - Always implement `/health` endpoint
5. **Logging** - Use structured logging (JSON)
6. **Secrets** - Never commit secrets, use env vars
7. **Database Backups** - Enable auto-backup in Neon

---

## 🎯 Quick Commands

```bash
# Test build locally
pnpm build:backend
pnpm build:frontend

# Test production start
NODE_ENV=production node dist/apps/main.js

# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate:deploy

# Check health
curl http://localhost:3000/health
```

---

## ✅ Summary

Your Emma Project is **ready to deploy** to Render!

**What's included:**

- ✅ `render.yaml` configuration
- ✅ Build scripts
- ✅ Health endpoint
- ✅ Environment variable setup
- ✅ CORS support

**Next steps:**

1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy! 🚀

**Your app will be live in ~5 minutes!** 🎉
