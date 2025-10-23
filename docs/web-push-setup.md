# Web Push Setup Guide

## 📦 Installed Packages

- `web-push` (^3.6.7) - Web Push protocol implementation
- `@types/web-push` (^3.6.4) - TypeScript types
- `dotenv` (^17.2.3) - Environment variable management

---

## 🚀 Quick Start

### 1. Generate VAPID Keys

VAPID keys are required for Web Push authentication.

```bash
pnpm generate:vapid
```

This will:

- Generate new VAPID keys
- Update `.env.example` with the keys
- Display the keys in the console

### 2. Configure Environment Variables

The script creates `.env.example`. Copy it to `.env`:

```bash
cp .env.example .env
```

Then update with your actual values:

```env
# VAPID Keys for Web Push
VAPID_PUBLIC_KEY="YOUR_PUBLIC_KEY_HERE"
VAPID_PRIVATE_KEY="YOUR_PRIVATE_KEY_HERE"
VAPID_SUBJECT="mailto:your-email@example.com"
```

**Important:**

- `VAPID_PUBLIC_KEY` - Used by frontend to subscribe
- `VAPID_PRIVATE_KEY` - Used by backend to send notifications
- `VAPID_SUBJECT` - Your email or website URL (must start with `mailto:` or `https://`)

### 3. Backend Setup

The `PushService` is already created in `apps/src/push/push.service.ts`.

**Import in your module:**

```typescript
// apps/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PushService } from '../push/push.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env
  ],
  providers: [PushService],
  exports: [PushService],
})
export class AppModule {}
```

**Use in a controller:**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from '../push/push.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private pushService: PushService) {}

  @Post('send')
  async sendNotification(@Body() data: { subscription: any; title: string; body: string }) {
    await this.pushService.sendNotification(data.subscription, {
      title: data.title,
      body: data.body,
    });
    return { success: true };
  }

  @Post('subscribe')
  async subscribe(@Body() subscription: any) {
    // Save subscription to database
    // Return success
    return { success: true };
  }

  @Get('public-key')
  getPublicKey() {
    return { publicKey: this.pushService.getPublicKey() };
  }
}
```

---

## 🔧 Backend Usage

### Send Single Notification

```typescript
await pushService.sendNotification(subscription, {
  title: 'New Message',
  body: 'You have a new message from Alice',
  icon: '/icon.png',
  badge: '/badge.png',
  data: {
    url: '/messages/123',
    timestamp: Date.now(),
  },
});
```

### Send to Multiple Users

```typescript
const subscriptions = await db.pushSubscription.findMany();

const result = await pushService.sendNotificationToMany(subscriptions, {
  title: 'System Update',
  body: 'The system will be down for maintenance',
});

console.log(`Sent: ${result.success}, Failed: ${result.failed}`);
```

### Validate Subscription

```typescript
if (pushService.isValidSubscription(subscription)) {
  await pushService.sendNotification(subscription, payload);
}
```

---

## 🌐 Frontend Setup

### 1. Register Service Worker

Create `public/service-worker.js`:

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json();

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    data: data.data,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(clients.openWindow(url));
});
```

### 2. Create Push Notification Hook

```typescript
// apps/frontend/src/hooks/usePushNotifications.ts
import { useEffect, useState } from 'react';

const PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY'; // Or fetch from backend

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
  }, []);

  const subscribe = async () => {
    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/service-worker.js');

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Subscribe to push notifications
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // Send subscription to backend
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });

      console.log('✅ Subscribed to push notifications');
      return sub;
    } catch (error) {
      console.error('❌ Failed to subscribe:', error);
      throw error;
    }
  };

  const unsubscribe = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        setIsSubscribed(false);

        // Notify backend
        await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription),
        });

        console.log('✅ Unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('❌ Failed to unsubscribe:', error);
      throw error;
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    subscribe,
    unsubscribe,
  };
}
```

### 3. Use in Component

```typescript
import { usePushNotifications } from '../hooks/usePushNotifications';
import { toast } from 'sonner';

function NotificationSettings() {
  const { isSupported, isSubscribed, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser</p>;
  }

  return (
    <div>
      <h2>Push Notifications</h2>
      {isSubscribed ? (
        <button
          onClick={async () => {
            await unsubscribe();
            toast.success('Unsubscribed from notifications');
          }}
        >
          Disable Notifications
        </button>
      ) : (
        <button
          onClick={async () => {
            await subscribe();
            toast.success('Subscribed to notifications');
          }}
        >
          Enable Notifications
        </button>
      )}
    </div>
  );
}
```

---

## 💾 Database Schema (Prisma)

Store subscriptions in your database:

```prisma
model PushSubscription {
  id        String   @id @default(cuid())
  userId    String
  endpoint  String   @unique
  p256dh    String
  auth      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("push_subscriptions")
}
```

Then save subscriptions:

```typescript
@Post('subscribe')
async subscribe(@Body() subscription: any) {
  await db.pushSubscription.create({
    data: {
      userId: req.user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
  return { success: true };
}
```

---

## 🎯 Common Use Cases

### Welcome Notification

```typescript
async function sendWelcomeNotification(userId: string) {
  const subscriptions = await db.pushSubscription.findMany({
    where: { userId },
  });

  for (const sub of subscriptions) {
    await pushService.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      },
      {
        title: 'Welcome!',
        body: 'Thanks for enabling notifications',
        icon: '/welcome-icon.png',
      }
    );
  }
}
```

### Broadcast to All Users

```typescript
async function broadcastMessage(title: string, body: string) {
  const subscriptions = await db.pushSubscription.findMany();

  const result = await pushService.sendNotificationToMany(
    subscriptions.map((sub) => ({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.p256dh, auth: sub.auth },
    })),
    { title, body }
  );

  return result;
}
```

### Scheduled Notifications

```typescript
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NotificationScheduler {
  constructor(private pushService: PushService) {}

  @Cron('0 9 * * *') // Every day at 9 AM
  async sendDailyDigest() {
    const subscriptions = await db.pushSubscription.findMany();

    await pushService.sendNotificationToMany(subscriptions, {
      title: 'Daily Digest',
      body: 'Check out what's new today!',
    });
  }
}
```

---

## 🔐 Security Best Practices

1. **Never expose private key** - Keep it in `.env` only
2. **Validate subscriptions** - Use `isValidSubscription()` method
3. **Rate limiting** - Limit notifications per user
4. **User consent** - Always ask permission first
5. **Cleanup** - Remove expired subscriptions

### Handling Expired Subscriptions

```typescript
try {
  await pushService.sendNotification(subscription, payload);
} catch (error) {
  if (error.statusCode === 410) {
    // Gone
    // Remove subscription from database
    await db.pushSubscription.delete({
      where: { endpoint: subscription.endpoint },
    });
  }
}
```

---

## 🧪 Testing

### Test Notification

```bash
# Using curl
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "subscription": {...},
    "title": "Test",
    "body": "This is a test notification"
  }'
```

### Browser DevTools

```javascript
// In browser console
Notification.requestPermission().then((permission) => {
  console.log('Permission:', permission);
});
```

---

## 🐛 Troubleshooting

### "VAPID keys not configured"

**Solution:** Run `pnpm generate:vapid` and update `.env`

### "Notification permission denied"

**Solution:** User must grant permission. Check browser settings.

### "Service worker not registered"

**Solution:** Ensure `service-worker.js` is in the `public` folder

### "Invalid VAPID subject"

**Solution:** Must be `mailto:email@domain.com` or `https://domain.com`

---

## 📚 Resources

- [Web Push Protocol](https://datatracker.ietf.org/doc/html/rfc8030)
- [MDN Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web-push npm package](https://github.com/web-push-libs/web-push)

---

## 📜 Scripts Summary

| Script                | Description             |
| --------------------- | ----------------------- |
| `pnpm generate:vapid` | Generate new VAPID keys |

---

## ✅ Checklist

- [ ] Generate VAPID keys (`pnpm generate:vapid`)
- [ ] Copy `.env.example` to `.env`
- [ ] Update `VAPID_SUBJECT` with your email
- [ ] Add `PushService` to your NestJS module
- [ ] Create service worker (`public/service-worker.js`)
- [ ] Implement subscribe/unsubscribe in frontend
- [ ] Store subscriptions in database
- [ ] Test notifications
- [ ] Handle errors and expired subscriptions
