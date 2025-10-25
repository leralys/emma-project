import { Injectable, OnModuleInit } from '@nestjs/common';
import * as webPush from 'web-push';

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

@Injectable()
export class PushService implements OnModuleInit {
  onModuleInit() {
    // Configure VAPID details
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:example@yourdomain.com';

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('⚠️  VAPID keys not configured. Run: pnpm generate:vapid');
      return;
    }

    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    console.log('✅ Web Push configured successfully');
  }

  /**
   * Send a push notification to a specific subscription
   */
  async sendNotification(
    subscription: PushSubscription,
    payload: PushNotificationPayload
  ): Promise<void> {
    try {
      const payloadString = JSON.stringify(payload);

      await webPush.sendNotification(subscription, payloadString);

      console.log('✅ Push notification sent successfully');
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Send push notifications to multiple subscriptions
   */
  async sendNotificationToMany(
    subscriptions: PushSubscription[],
    payload: PushNotificationPayload
  ): Promise<{ success: number; failed: number }> {
    const results = await Promise.allSettled(
      subscriptions.map((sub) => this.sendNotification(sub, payload))
    );

    const success = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`📊 Notifications sent: ${success} success, ${failed} failed`);

    return { success, failed };
  }

  /**
   * Validate a push subscription
   */
  isValidSubscription(subscription: unknown): subscription is PushSubscription {
    return (
      !!subscription &&
      typeof subscription === 'object' &&
      'endpoint' in subscription &&
      typeof subscription.endpoint === 'string' &&
      'keys' in subscription &&
      !!subscription.keys &&
      typeof subscription.keys === 'object' &&
      'p256dh' in subscription.keys &&
      typeof subscription.keys.p256dh === 'string' &&
      'auth' in subscription.keys &&
      typeof subscription.keys.auth === 'string'
    );
  }

  /**
   * Get VAPID public key (for frontend)
   */
  getPublicKey(): string {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('VAPID public key not configured');
    }
    return publicKey;
  }
}
