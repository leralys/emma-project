#!/usr/bin/env tsx
import * as argon2 from 'argon2';

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Password is required\n');
  console.log('Usage: pnpm hash:password <your-password>');
  console.log('Example: pnpm hash:password "MySecurePassword123"\n');
  process.exit(1);
}

console.log('🔐 Hashing password with Argon2...\n');

argon2
  .hash(password)
  .then((hash) => {
    console.log('✅ Password hashed successfully!\n');
    console.log('📋 Hashed password:');
    console.log(hash);
    console.log('\n💡 Use case:');
    console.log('   • Add to .env as ADMIN_PASSWORD_HASH');
  })
  .catch((error) => {
    console.error('❌ Error hashing password:', error);
    process.exit(1);
  });
