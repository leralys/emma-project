# Deploy Frontend to Vercel (Free Forever)

## 💰 Completely Free Configuration

### ✅ What You Get with Vercel Free:

**Frontend (Free tier):**

- ✅ **Unlimited projects & deployments**
- ✅ **Automatic HTTPS** with SSL certificate
- ✅ **Global CDN** - instant load times worldwide
- ✅ **100 GB bandwidth/month** - plenty for most projects
- ✅ **Auto-deploy** on every push to main
- ✅ **Preview deployments** for every PR
- ✅ **Never sleeps** - always fast
- ✅ **Built-in analytics**
- ✅ **Custom domains** - free

---

## 🚀 Quick Deploy (2 Minutes)

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "feat: ready for Vercel deployment"
   git push
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Sign in with GitHub

3. **Click "Add New Project"**
   - Select your repository
   - Vercel will auto-detect the configuration

4. **Configure Build Settings:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (leave empty or use root)
   - **Build Command:** `pnpm build:frontend`
   - **Output Directory:** `dist/apps/frontend`
   - **Install Command:** `pnpm install`

5. **Add Environment Variables:**

   ```env
   VITE_API_URL=https://your-backend.onrender.com
   VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
   ```

6. **Click "Deploy"** 🚀

Done! Your frontend will be live in ~2 minutes.

---

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally (one time only)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

---

## ⚡ Auto-Deploy Setup

After initial setup, **every push to main** automatically:

1. Triggers build on Vercel
2. Deploys new version
3. Live in ~2 minutes
4. Zero downtime

```bash
# Just push - Vercel deploys automatically!
git add .
git commit -m "feat: new feature"
git push
```

---

## 🔄 Preview Deployments

Every **Pull Request** gets its own preview URL:

```bash
# Create a branch
git checkout -b feature/new-feature

# Make changes, commit, push
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature

# Create PR on GitHub
# Vercel automatically creates preview: https://emma-frontend-git-feature-new-feature.vercel.app
```

---

## 🌐 Custom Domain (Free)

### Add Your Own Domain:

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your domain: `yourdomain.com`

2. **Update DNS:**
   - Add CNAME record: `yourdomain.com` → `cname.vercel-dns.com`
   - Or use Vercel nameservers

3. **Done!**
   - HTTPS automatically configured
   - Global CDN enabled

---

## 📊 Free vs. Paid Comparison

| Feature                 | Free           | Pro ($20/month) |
| ----------------------- | -------------- | --------------- |
| **Projects**            | Unlimited      | Unlimited       |
| **Deployments**         | Unlimited      | Unlimited       |
| **Bandwidth**           | 100 GB/month   | 1 TB/month      |
| **Build Time**          | 6000 min/month | 24000 min/month |
| **Team Members**        | 1              | Unlimited       |
| **Analytics**           | Basic          | Advanced        |
| **Password Protection** | ❌             | ✅              |
| **Never Sleeps**        | ✅             | ✅              |

**For most projects, Free tier is perfect!** 🎉

---

## 🔧 Project Structure

Your `vercel.json` is already configured:

```json
{
  "buildCommand": "pnpm build:frontend",
  "outputDirectory": "dist/apps/frontend",
  "installCommand": "pnpm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**What this does:**

- ✅ Handles client-side routing (React Router)
- ✅ PWA support (service worker)
- ✅ Proper manifest headers
- ✅ Cache control for service worker

---

## 🌍 Environment Variables

### Add in Vercel Dashboard:

1. **Project Settings → Environment Variables**

2. **Add these:**

   ```env
   # Backend API URL
   VITE_API_URL=https://emma-backend.onrender.com

   # Web Push Public Key
   VITE_VAPID_PUBLIC_KEY=your-vapid-public-key-here

   # Optional: Analytics, etc.
   VITE_GA_ID=your-google-analytics-id
   ```

3. **Apply to:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

## 📱 Verification After Deploy

### 1. Check Deployment:

Visit: `https://your-project.vercel.app`

### 2. Test PWA:

- Open in Chrome
- Click "Install" prompt
- Check offline functionality

### 3. Test API Connection:

```typescript
// Should connect to your Render backend
fetch(`${import.meta.env.VITE_API_URL}/health`)
  .then((res) => res.json())
  .then((data) => console.log(data));
```

### 4. Check Analytics:

- Vercel Dashboard → Analytics
- Real-time visitor data

---

## 🚀 Complete Stack (Backend + Frontend)

### Free Deployment Architecture:

```
┌─────────────────────┐
│   Vercel (Frontend) │  ← Always fast, never sleeps
│   - React + Vite    │  ← Global CDN
│   - PWA enabled     │  ← 100 GB bandwidth/month
└──────────┬──────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────┐
│  Render (Backend)   │  ← May sleep after 15 min
│  - NestJS API       │  ← Wakes in ~30 seconds
│  - Health endpoint  │  ← 750 hours/month
└──────────┬──────────┘
           │
           ├─────────► Neon (PostgreSQL)
           │           └─ Free 10 GB
           │
           └─────────► Cloudflare R2
                       └─ Free 10 GB storage
```

**Total Cost: $0/month** 🎉

---

## 🛠️ Useful Commands

```bash
# Local development
pnpm dev:frontend

# Build for production
pnpm build:frontend

# Preview production build locally
pnpm preview:frontend  # (add this script if needed)

# Deploy via CLI
vercel --prod

# View deployment logs
vercel logs <deployment-url>

# List all deployments
vercel ls

# Remove deployment
vercel rm <deployment-url>
```

---

## 💡 Vercel Best Practices

### 1. Use Environment Variables

Never hardcode API URLs:

```typescript
// ❌ Bad
const API_URL = 'https://emma-backend.onrender.com';

// ✅ Good
const API_URL = import.meta.env.VITE_API_URL;
```

### 2. Optimize Images

```typescript
// Use Next/Image if you switch to Next.js
// Or use Vercel Image Optimization API
<img src="https://your-project.vercel.app/_vercel/image?url=/photo.jpg&w=800&q=80" />
```

### 3. Enable Analytics

- Free web vitals tracking
- Real user monitoring
- Performance insights

### 4. Use Preview Deployments

- Test every PR before merging
- Share preview URLs with team
- Catch bugs early

---

## 🔒 Security Features (Included Free)

- ✅ **Automatic HTTPS** - SSL certificates
- ✅ **DDoS Protection** - Built-in
- ✅ **Secure Headers** - Auto-configured
- ✅ **Environment Variables** - Encrypted
- ✅ **Git Integration** - Secure deploys only

---

## 🎯 Perfect For:

- ✅ **React, Vue, Svelte apps**
- ✅ **Static sites**
- ✅ **JAMstack projects**
- ✅ **PWAs (Progressive Web Apps)**
- ✅ **Landing pages**
- ✅ **Portfolios**
- ✅ **SaaS frontends**
- ✅ **E-commerce frontends**

---

## ⚡ Performance

**Vercel Free tier is FAST:**

- **Global CDN** - 70+ edge locations
- **Instant cache** - Static assets cached worldwide
- **HTTP/2** - Faster page loads
- **Brotli compression** - Smaller files
- **Smart CDN** - Auto-purges on deploy

**Average load time: < 1 second** 🚀

---

## 📈 Monitoring & Analytics

### Built-in (Free):

- **Real-time analytics**
- **Core Web Vitals**
- **Visitor geography**
- **Top pages**
- **Bandwidth usage**

### View in Dashboard:

1. Go to your project
2. Click "Analytics"
3. See real-time data

---

## ✅ Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] `vercel.json` configured (✅ already done)
- [ ] Vercel account connected to GitHub
- [ ] Environment variables added in Vercel dashboard
- [ ] Custom domain configured (optional)
- [ ] First deployment successful
- [ ] PWA installation works
- [ ] API connection to backend works
- [ ] Preview deployments enabled (automatic)
- [ ] Analytics enabled (automatic)

---

## 🎉 Done!

Your frontend is deployed to Vercel and will auto-update on every push!

**URLs:**

- **Production:** `https://your-project.vercel.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)
- **Preview:** `https://your-project-git-branch.vercel.app` (for PRs)

**On every `git push`:**

- ✅ Automatic build
- ✅ Automatic deploy
- ✅ Live in ~2 minutes
- ✅ Zero downtime
- ✅ Completely free

---

## 🔗 Useful Links

- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Documentation:** [vercel.com/docs](https://vercel.com/docs)
- **Status Page:** [vercel-status.com](https://www.vercel-status.com)
- **Community:** [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🆚 Vercel vs. Render (for Frontend)

| Feature                       | Vercel                 | Render Static Site |
| ----------------------------- | ---------------------- | ------------------ |
| **CDN**                       | Global (70+ locations) | Global             |
| **Bandwidth**                 | 100 GB/month           | Unlimited          |
| **Build Minutes**             | 6000 min/month         | Unlimited          |
| **Custom Domain**             | ✅ Free                | ✅ Free            |
| **Preview Deploys**           | ✅ Every PR            | ❌ Manual only     |
| **Analytics**                 | ✅ Built-in            | ❌ External needed |
| **Serverless Functions**      | ✅ Yes                 | ❌ No              |
| **Edge Functions**            | ✅ Yes                 | ❌ No              |
| **DX (Developer Experience)** | ⭐⭐⭐⭐⭐             | ⭐⭐⭐⭐           |

**Recommendation: Use Vercel for frontend!** It's optimized specifically for frontend frameworks.

---

**Just develop and push!** 🚀

Vercel handles everything else automatically.
