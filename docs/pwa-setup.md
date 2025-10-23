# PWA (Progressive Web App) Setup Guide

## 📱 What is a PWA?

A Progressive Web App provides a native app-like experience on the web with:

- **Offline Support** - Works without internet connection
- **Installable** - Can be installed on home screen
- **Fast Loading** - Caches resources for instant loading
- **Push Notifications** - Engage users with notifications
- **App-like Experience** - Full-screen, standalone mode

---

## 📦 Installed Packages

| Package           | Version | Purpose                     |
| ----------------- | ------- | --------------------------- |
| `vite-plugin-pwa` | ^1.1.0  | Vite plugin for PWA support |
| `workbox-window`  | ^7.3.0  | Service Worker management   |

---

## ✅ What's Configured

### 1. Service Worker (Auto-generated)

- Automatically caches static assets
- Handles offline functionality
- Updates in the background

### 2. Web App Manifest

- App name, description, colors
- App icons for different sizes
- Display mode (standalone)
- Start URL and scope

### 3. Caching Strategies

- **Static Assets** - Cache first (JS, CSS, images)
- **API Calls** - Network first with fallback
- **Google Fonts** - Cache first with long expiration

---

## 🚀 Quick Start

### The PWA is Already Working! 🎉

1. **Run the app:**

```bash
pnpm dev:frontend
```

2. **Test in browser:**
   - Open `http://localhost:4200`
   - Look for install prompt (Chrome/Edge)
   - Click install button in address bar

3. **Test offline:**
   - Open DevTools → Network tab
   - Toggle "Offline"
   - Reload page - it still works! ✅

---

## 🎨 Customization

### Update App Manifest

Edit `apps/frontend/vite.config.ts`:

```typescript
VitePWA({
  manifest: {
    name: 'Your App Name', // Full name
    short_name: 'App', // Short name (12 chars max)
    description: 'Your app description',
    theme_color: '#3b82f6', // Theme color (toolbar)
    background_color: '#ffffff', // Background color
    display: 'standalone', // Display mode
    orientation: 'portrait', // Screen orientation
    // ... icons configuration
  },
});
```

### Display Modes

- `standalone` - Full screen, like a native app
- `fullscreen` - Completely full screen
- `minimal-ui` - Minimal browser UI
- `browser` - Regular browser tab

---

## 🖼️ App Icons

### Required Icons

Place these in `apps/frontend/public/`:

| File                        | Size    | Purpose                 |
| --------------------------- | ------- | ----------------------- |
| `pwa-64x64.png`             | 64×64   | Small icon              |
| `pwa-192x192.png`           | 192×192 | Standard icon           |
| `pwa-512x512.png`           | 512×512 | Large icon              |
| `maskable-icon-512x512.png` | 512×512 | Maskable icon (Android) |
| `apple-touch-icon.png`      | 180×180 | iOS icon                |
| `favicon.ico`               | 32×32   | Favicon                 |

### Generate Icons

Use online tools:

- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [Favicon.io](https://favicon.io/)

Or use a script:

```bash
npx pwa-asset-generator logo.svg public --type png
```

---

## 💻 Using PWA Features

### 1. Add to Your App Component

```typescript
// apps/frontend/src/app/app.tsx
import { PWAInstallPrompt } from './components/PWAInstallPrompt';

export function App() {
  return (
    <>
      <PWAInstallPrompt />
      {/* Your app content */}
    </>
  );
}
```

### 2. Use PWA Hook

```typescript
import { usePWA } from '../hooks/usePWA';

function MyComponent() {
  const {
    isInstallable,
    isInstalled,
    install,
    needRefresh,
    refresh,
  } = usePWA();

  return (
    <div>
      {isInstallable && !isInstalled && (
        <button onClick={install}>
          Install App
        </button>
      )}

      {needRefresh && (
        <button onClick={refresh}>
          Update Available - Reload
        </button>
      )}

      {isInstalled && <p>App is installed!</p>}
    </div>
  );
}
```

### 3. Check Installation Status

```typescript
// Check if app is installed
const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

// Check if installable
window.addEventListener('beforeinstallprompt', (e) => {
  // App can be installed
});

// App was installed
window.addEventListener('appinstalled', () => {
  // Track installation
});
```

---

## 🔄 Caching Strategies

### Pre-configured Strategies

**1. Static Assets (CacheFirst)**

```typescript
// Caches: JS, CSS, HTML, images
// Strategy: Cache first, network as fallback
// Good for: Assets that don't change often
```

**2. API Calls (NetworkFirst)**

```typescript
// Matches: /api/**
// Strategy: Network first, cache as fallback
// Cache expiration: 5 minutes
// Good for: Dynamic data
```

**3. Google Fonts (CacheFirst)**

```typescript
// Matches: fonts.googleapis.com
// Strategy: Cache first
// Cache expiration: 1 year
// Good for: External resources
```

### Add Custom Strategy

Edit `vite.config.ts`:

```typescript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.example\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        },
      },
    },
  ],
}
```

### Workbox Strategies

- `CacheFirst` - Cache first, network fallback
- `NetworkFirst` - Network first, cache fallback
- `CacheOnly` - Cache only, fail if not cached
- `NetworkOnly` - Network only, no cache
- `StaleWhileRevalidate` - Return cache, update in background

---

## 📱 Platform-Specific Features

### iOS (Safari)

Add to `apps/frontend/index.html`:

```html
<head>
  <!-- iOS meta tags -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Emma" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- iOS splash screens (optional) -->
  <link rel="apple-touch-startup-image" href="/splash-640x1136.png" />
</head>
```

### Android

The manifest is automatically configured. Additional options:

```typescript
manifest: {
  orientation: 'portrait',
  categories: ['productivity', 'business'],
  prefer_related_applications: false,
  related_applications: [],
}
```

---

## 🧪 Testing

### Local Testing

```bash
# 1. Build the app
pnpm build:frontend

# 2. Preview the build
pnpm nx preview frontend

# 3. Open http://localhost:4200
# 4. Test install prompt
# 5. Test offline mode in DevTools
```

### Chrome DevTools

1. **Application Tab** → Service Workers
   - View registered service workers
   - Update on reload
   - Unregister

2. **Application Tab** → Manifest
   - View manifest file
   - Test icon sizes

3. **Network Tab** → Offline
   - Test offline functionality

4. **Lighthouse**
   - Run PWA audit
   - Get PWA score
   - See improvement suggestions

### PWA Requirements Checklist

- ✅ HTTPS (or localhost)
- ✅ Web App Manifest
- ✅ Service Worker
- ✅ Icons (192px and 512px)
- ✅ Responsive design
- ✅ Start URL
- ✅ Display mode

---

## 🚀 Production Deployment

### 1. Build for Production

```bash
pnpm build:frontend
```

### 2. Deploy to Hosting

The PWA works with any static hosting:

- **Vercel** - Automatic HTTPS, great performance
- **Netlify** - Easy setup, HTTPS included
- **Cloudflare Pages** - Fast CDN, free SSL
- **Firebase Hosting** - Google infrastructure
- **GitHub Pages** - Free for public repos

### 3. HTTPS Required

PWAs require HTTPS in production. Most modern hosts provide it automatically.

### 4. Configure Headers (Optional)

For better caching, add headers:

```
# Vercel (vercel.json)
{
  "headers": [
    {
      "source": "/service-worker.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

---

## 📊 Analytics

Track PWA events:

```typescript
// Track installation
window.addEventListener('appinstalled', () => {
  // Send to analytics
  gtag('event', 'pwa_install');
});

// Track display mode
const isPWA = window.matchMedia('(display-mode: standalone)').matches;
gtag('event', 'pwa_mode', { is_pwa: isPWA });
```

---

## 🐛 Troubleshooting

### Service Worker Not Registering

**Check:**

1. HTTPS or localhost?
2. Service worker file in public folder?
3. Check browser console for errors
4. Try clearing site data in DevTools

### Install Prompt Not Showing

**Reasons:**

- Already installed
- Previously dismissed (won't show for ~90 days)
- PWA criteria not met
- iOS Safari (no prompt, use share menu)

**Solution for Testing:**

```javascript
// Reset Chrome's install prompt
chrome://flags/#bypass-app-banner-engagement-checks
```

### Cache Not Working

**Check:**

1. Service worker registered?
2. Cache patterns in `vite.config.ts`
3. Network tab → Disable cache unchecked
4. Application tab → Clear storage

### Icons Not Showing

**Check:**

1. Files in `/public/` folder?
2. Correct sizes (192px, 512px)?
3. PNG format?
4. Manifest paths correct?

---

## 🔄 Updating Your PWA

### Force Update

Users get updates automatically, but you can force it:

```typescript
const { needRefresh, refresh } = usePWA();

if (needRefresh) {
  refresh(); // Reloads page with new version
}
```

### Version Strategy

1. **Auto-update** (default) - Users get updates in background
2. **Prompt** - Ask user to update
3. **Manual** - User clicks "Update" button

Configure in `vite.config.ts`:

```typescript
VitePWA({
  registerType: 'autoUpdate', // or 'prompt'
});
```

---

## 💡 Best Practices

1. **Keep it fast** - PWA should load quickly
2. **Work offline** - Cache essential resources
3. **Update gracefully** - Don't break user experience
4. **Test on real devices** - Mobile behavior differs
5. **Monitor performance** - Use Lighthouse
6. **Handle errors** - Graceful degradation
7. **Respect bandwidth** - Don't cache everything

---

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web App Manifest](https://web.dev/add-manifest/)

---

## 🎯 Next Steps

1. ✅ PWA is already configured!
2. Add your app icons to `/public/`
3. Customize manifest in `vite.config.ts`
4. Add `<PWAInstallPrompt />` to your app
5. Test installation and offline mode
6. Deploy to production (with HTTPS)
7. Monitor with Lighthouse

---

**Your app is now a Progressive Web App!** 📱✨
