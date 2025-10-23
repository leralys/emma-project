#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import * as webPush from 'web-push';

console.log('🔐 Generating VAPID keys for Web Push...\n');

const vapidKeys = webPush.generateVAPIDKeys();

console.log('✅ VAPID keys generated successfully!\n');
console.log('📋 Add these to your .env file:\n');
console.log('VAPID_PUBLIC_KEY="' + vapidKeys.publicKey + '"');
console.log('VAPID_PRIVATE_KEY="' + vapidKeys.privateKey + '"');
console.log('VAPID_SUBJECT="mailto:your-email@example.com"\n');

// Optionally save to a file
const envExamplePath = path.join(process.cwd(), '.env.example');
const envContent = `# Database
# Get your connection string from: https://console.neon.tech
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
DIRECT_URL="postgresql://user:password@host/database?sslmode=require"

# App Configuration
NODE_ENV="development"
PORT="3000"

# VAPID Keys for Web Push (Generated: ${new Date().toISOString()})
VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"
VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"
VAPID_SUBJECT="mailto:your-email@example.com"
`;

try {
  fs.writeFileSync(envExamplePath, envContent);
  console.log(`✅ Updated ${envExamplePath}\n`);
  console.log('⚠️  Remember to:');
  console.log('   1. Copy .env.example to .env');
  console.log('   2. Update VAPID_SUBJECT with your actual email');
  console.log('   3. Add your Neon database connection strings\n');
} catch (error) {
  console.error('❌ Could not write to .env.example:', error);
}
