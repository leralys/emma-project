# Deploy to Render (Completely Free)

## 💰 Completely Free Configuration

### ✅ What's Configured:

**Backend (Free tier):**

- ✅ Free plan
- ✅ **Auto-deploy** enabled (deploys on every push)
- ✅ **Health check disabled** (saves requests)
- ⚠️ Will sleep after 15 minutes of inactivity
- ⚠️ Wakes up in ~30 seconds on first request

**Frontend (Static Site):**

- ✅ **Completely free forever**
- ✅ Auto-deploy enabled
- ✅ Unlimited bandwidth
- ✅ Global CDN
- ✅ Never sleeps

---

## 🚀 Quick Deploy

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin <your-repository-url>
git push -u origin main
```

### 2. Connect to Render

1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. **New → Blueprint**
4. Select your repository
5. Render will automatically read `render.yaml`

### 3. Add Environment Variables

In Render dashboard, add:

```env
# Database (from Neon)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Web Push (from pnpm generate:vapid)
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:your@email.com

# Cloudflare R2 (from Cloudflare)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
```

### 4. Click "Apply"

Done! 🎉 Render will deploy both applications.

---

## ⚡ Auto-Deploy

After setup, **every push to main** automatically:

1. Triggers a build
2. Deploys new version
3. Zero downtime

```bash
# Just push your changes
git add .
git commit -m "feat: new feature"
git push

# Render deploys automatically!
```

---

## 😴 About Backend "Sleeping"

### What Happens:

- After **15 minutes** without requests → server goes to sleep
- First request → wakes up in ~30 seconds
- Subsequent requests → work normally

### How to "Wake Up":

First visitor simply waits 30 seconds. This is normal for the free plan.

### If You Need Always-On:

Upgrade to Starter ($7/month) - server never sleeps.

---

## 💡 Tips for Free Usage

### 1. Frontend is Always Fast

Static site (frontend) **never sleeps** and loads instantly via CDN. Users see the UI immediately.

### 2. Wake-Up Optimization

```typescript
// Show loader on frontend while backend wakes up
const wakeUpBackend = async () => {
  setLoading(true);
  try {
    await fetch('https://your-backend.onrender.com/health');
    // Backend is now awake
  } catch (e) {
    // Ignore, backend is waking up
  }
  setLoading(false);
};
```

### 3. Use Neon for Free

Neon also sleeps, but wakes up quickly (~5 seconds).

---

## 📊 Completely Free Stack

| Service               | Plan | Limits                  |
| --------------------- | ---- | ----------------------- |
| **Render (Backend)**  | Free | 750 hours/month, sleeps |
| **Render (Frontend)** | Free | Unlimited, never sleeps |
| **Neon (Database)**   | Free | 10 GB, sleeps           |
| **Cloudflare R2**     | Free | 10 GB, never sleeps     |
| **Web Push**          | Free | Free                    |

**Total:** $0/month 🎉

---

## 🔄 How Auto-Deploy Works

```
1. You push → GitHub
2. GitHub webhook → Render
3. Render starts build
4. Tests pass
5. Deploy new version
6. Services update

Time: ~3-5 minutes
```

---

## 🛠️ Useful Commands

```bash
# Deploy new version
git add .
git commit -m "feat: update"
git push  # Automatically deploys

# View logs
# In Render dashboard → Logs

# Manual redeploy
# In Render dashboard → Manual Deploy
```

---

## 📱 Verification After Deploy

### Backend:

```bash
curl https://your-backend.onrender.com/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-23T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Frontend:

Open: `https://your-frontend.onrender.com`

---

## ⚠️ Important to Know

### Free Plan Includes:

✅ **750 hours/month** - enough for 24/7 operation  
✅ **Auto-deploy** - updates on push  
✅ **SSL certificate** - free HTTPS  
✅ **Custom domain** - you can add your own

### Limitations:

⚠️ **Sleeping** - after 15 min of inactivity  
⚠️ **512 MB RAM** - sufficient for most tasks  
⚠️ **Slower** - than paid plans

---

## 🎯 Perfect For:

- ✅ MVPs and prototypes
- ✅ Learning projects
- ✅ Personal projects
- ✅ Low traffic sites
- ✅ Demo versions

## ❌ Not Suitable For:

- ❌ Production with high traffic
- ❌ Real-time applications
- ❌ When response speed is critical
- ❌ When 99.9% uptime is needed

---

## 💰 Upgrade (If Needed)

**Starter Plan - $7/month:**

- ✅ Never sleeps
- ✅ Faster startup
- ✅ More RAM
- ✅ Priority support

---

## ✅ Deploy Checklist

- [ ] Code on GitHub
- [ ] `render.yaml` configured
- [ ] Connected to Render
- [ ] Environment variables added
- [ ] Auto-deploy enabled (✅ already configured)
- [ ] Health check disabled (✅ already configured)
- [ ] First deploy successful
- [ ] Backend works (may need to wake up)
- [ ] Frontend loads instantly
- [ ] Test on real devices

---

## 🎉 Done!

Your project is **completely free** and updates automatically on every push!

**URLs:**

- Backend: `https://emma-backend.onrender.com`
- Frontend: `https://emma-frontend.onrender.com`

**On every `git push`:**

- ✅ Automatic deployment
- ✅ Updates in 3-5 minutes
- ✅ Zero frontend downtime
- ✅ Completely free

**Just develop and push!** 🚀
