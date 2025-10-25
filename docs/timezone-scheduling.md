# Timezone-Aware Message Scheduling

## Overview

Each device stores its timezone using the IANA timezone format (e.g., `America/New_York`, `Europe/London`, `Asia/Tokyo`). This allows you to schedule messages that will be delivered at the correct local time for each user.

## Database Schema

```prisma
model Device {
  timezone String? @default("UTC") // IANA timezone
  // ... other fields
}

model Message {
  scheduledAtUTC DateTime? // Stored in UTC
  // ... other fields
}
```

## Usage with `date-fns-tz`

### Example 1: Schedule a message at 9 AM user's local time

```typescript
import { zonedTimeToUtc } from 'date-fns-tz';
import { db } from '@emma-project/database';

async function scheduleMessageAtLocalTime(
  userId: string,
  localHour: number, // e.g., 9 for 9 AM
  messageData: any
) {
  // Get user's device timezone
  const device = await db.device.findFirst({
    where: { userId, revoked: false },
  });

  const userTimezone = device?.timezone || 'UTC';

  // Create a date at 9 AM in user's timezone
  const localDate = new Date();
  localDate.setHours(localHour, 0, 0, 0);

  // Convert to UTC for storage
  const utcDate = zonedTimeToUtc(localDate, userTimezone);

  // Create scheduled message
  await db.message.create({
    data: {
      ...messageData,
      scheduledAtUTC: utcDate, // Stored in UTC
    },
  });
}
```

### Example 2: Display scheduled time in user's local timezone

```typescript
import { utcToZonedTime, format } from 'date-fns-tz';

async function getScheduledMessagesForUser(userId: string) {
  const device = await db.device.findFirst({
    where: { userId, revoked: false },
  });

  const userTimezone = device?.timezone || 'UTC';

  const messages = await db.message.findMany({
    where: {
      thread: {
        participants: { some: { userId } },
      },
      scheduledAtUTC: { not: null },
    },
  });

  return messages.map((msg) => {
    // Convert UTC time to user's local time
    const localTime = utcToZonedTime(msg.scheduledAtUTC!, userTimezone);

    return {
      ...msg,
      scheduledAtLocal: format(localTime, 'yyyy-MM-dd HH:mm:ss zzz', {
        timeZone: userTimezone,
      }),
    };
  });
}
```

### Example 3: Schedule message for multiple users at same local time

```typescript
import { zonedTimeToUtc } from 'date-fns-tz';

async function scheduleGroupMessageAtLocalTime(threadId: string, localHour: number) {
  // Get all participants and their devices
  const thread = await db.thread.findUnique({
    where: { id: threadId },
    include: {
      participants: {
        include: {
          user: {
            include: { devices: { where: { revoked: false } } },
          },
        },
      },
    },
  });

  // For each participant, calculate their local 9 AM in UTC
  const scheduleTimes = thread.participants.map((participant) => {
    const device = participant.user.devices[0];
    const timezone = device?.timezone || 'UTC';

    const localDate = new Date();
    localDate.setHours(localHour, 0, 0, 0);

    return {
      userId: participant.userId,
      scheduledAtUTC: zonedTimeToUtc(localDate, timezone),
    };
  });

  // Create separate scheduled messages for each timezone
  // (or use the earliest time if you want everyone to receive it at the same moment)
  const earliestTime = new Date(
    Math.min(...scheduleTimes.map((st) => st.scheduledAtUTC.getTime()))
  );

  await db.message.create({
    data: {
      threadId,
      senderId: 'admin-user-id',
      scheduledAtUTC: earliestTime,
      // ... other message data
    },
  });
}
```

## IANA Timezone Examples

Common timezone identifiers:

- **North America:** `America/New_York`, `America/Chicago`, `America/Los_Angeles`, `America/Toronto`
- **Europe:** `Europe/London`, `Europe/Paris`, `Europe/Berlin`, `Europe/Moscow`
- **Asia:** `Asia/Tokyo`, `Asia/Shanghai`, `Asia/Dubai`, `Asia/Kolkata`
- **Australia:** `Australia/Sydney`, `Australia/Melbourne`, `Australia/Perth`
- **Default:** `UTC` (if timezone is unknown or not set)

## Frontend: Getting User's Timezone

```typescript
// In your frontend app, detect user's timezone
const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// e.g., "America/New_York"

// Send it when registering the device
await registerDevice({
  timezone: userTimezone,
  // ... other device data
});
```

## Best Practices

1. **Always store timestamps in UTC** in the database
2. **Convert to local time** only for display purposes
3. **Use IANA timezone identifiers** (not offsets like "GMT+5")
4. **Handle timezone changes** (user travels, DST transitions)
5. **Default to UTC** if timezone is not available
6. **Update device timezone** when user's location changes

## Resources

- [IANA Timezone Database](https://www.iana.org/time-zones)
- [date-fns-tz Documentation](https://date-fns.org/docs/Time-Zones)
- [List of Timezone Identifiers](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
