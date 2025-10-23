# Libraries Usage Guide

## Installed Packages

### 🎉 Sonner (Toast Notifications)

**Version:** 2.0.7  
**Usage:** React toast notifications

```tsx
// Add to your main App component or layout
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      {/* Your app content */}
    </>
  );
}

// Use in components
import { toast } from 'sonner';

// Success toast
toast.success('User created successfully!');

// Error toast
toast.error('Failed to create user');

// Custom toast
toast('Custom message', {
  description: 'This is a custom toast',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### ✅ Zod (Schema Validation)

**Version:** 4.1.12  
**Usage:** TypeScript-first schema validation

```tsx
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Must be 18 or older').optional(),
});

// Type inference
type User = z.infer<typeof userSchema>;

// Validate data
const result = userSchema.safeParse(data);
if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error.errors);
}
```

### 📝 React Hook Form

**Version:** 7.65.0  
**Usage:** Performant form library with easy validation

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof formSchema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

### 🔔 Web Push (Push Notifications)

**Version:** 3.6.7  
**Usage:** Backend push notifications (Node.js)

```typescript
// Backend (NestJS)
import * as webPush from 'web-push';

// Set VAPID details (generate keys first)
webPush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Send notification
const subscription = {
  endpoint: '...',
  keys: {
    p256dh: '...',
    auth: '...',
  },
};

webPush.sendNotification(
  subscription,
  JSON.stringify({
    title: 'Hello!',
    body: 'This is a push notification',
  })
);

// Generate VAPID keys (run once)
const vapidKeys = webPush.generateVAPIDKeys();
console.log(vapidKeys.publicKey);
console.log(vapidKeys.privateKey);
```

```typescript
// Frontend (Service Worker registration)
async function subscribeToPush() {
  const registration = await navigator.serviceWorker.register('/sw.js');

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // Send subscription to backend
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: { 'Content-Type': 'application/json' },
  });
}
```

### 📅 Date-fns

**Version:** 4.1.0  
**Usage:** Modern date utility library

```typescript
import { format, formatDistance, subDays } from 'date-fns';

// Format date
format(new Date(), 'yyyy-MM-dd'); // "2025-10-23"
format(new Date(), 'PPP'); // "October 23rd, 2025"

// Relative time
formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true });
// "3 days ago"
```

### 🎨 Tailwind CSS

**Version:** 4.1.16  
**Usage:** Utility-first CSS framework

```tsx
// Use utility classes directly
<div className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>

// Responsive design
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>
```

### 🧭 React Router

**Version:** 7.9.4  
**Usage:** Declarative routing for React

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Complete Example: Form with Toast

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      // API call here
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });

      toast.success('User created successfully!');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4 p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input {...register('name')} className="w-full rounded-md border px-3 py-2" />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input {...register('email')} type="email" className="w-full rounded-md border px-3 py-2" />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Create User
      </button>
    </form>
  );
}
```
