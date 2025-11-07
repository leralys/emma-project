#!/usr/bin/env tsx

/**
 * Password Hashing Script
 *
 * This script hashes passwords using the Argon2 algorithm, which is a modern
 * and secure password hashing algorithm recommended for password storage.
 *
 * @description
 * Use this script to generate secure password hashes for storing in your database
 * or environment variables. The generated hash can be safely stored and later used
 * for password verification.
 *
 * @example
 * ```bash
 * # Using pnpm script (recommended)
 * pnpm hash:password 'AdminPassword123!'
 *
 * # Or using tsx directly
 * tsx scripts/hash-password.ts 'YourPasswordHere'
 *
 * # Output:
 * # 🔐 Hashing password with Argon2...
 * # ✅ Password hashed successfully!
 * # 📋 Raw hash:
 * # $argon2id$v=19$m=65536,t=3,p=4$hVb+KSi3aDPoYsAWDuJQxg$X4vCvK4t1RCRaaK4k+QWRiG8QM1emPfZqM0CeZCl9Bk
 * #
 * # 📝 For .env file (copy this line):
 * # ADMIN_PASSWORD_HASH=\$argon2id\$v=19\$m=65536,t=3,p=4\$hVb+KSi3aDPoYsAWDuJQxg\$X4vCvK4t1RCRaaK4k+QWRiG8QM1emPfZqM0CeZCl9Bk
 * ```
 *
 * @hashStructure
 * The generated hash contains several parts (separated by $):
 *
 * ```
 * $argon2id$v=19$m=65536,t=3,p=4$[salt]$[hash]
 *  └─┬──┘ └─┬─┘ └──────┬───────┘ └─┬──┘ └─┬──┘
 *    │      │          │           │      │
 *    │      │          │           │      └─ Actual password hash (base64)
 *    │      │          │           └──────── Random salt (base64, unique per hash)
 *    │      │          └──────────────────── Algorithm parameters:
 *    │      │                                 - m=65536: Memory cost (64 MB)
 *    │      │                                 - t=3: Time cost (iterations)
 *    │      │                                 - p=4: Parallelism (threads)
 *    │      └─────────────────────────────── Argon2 version (19)
 *    └────────────────────────────────────── Algorithm variant (argon2id - most secure)
 * ```
 *
 * **Important**: Store the ENTIRE hash string (~90-100 characters). All parts are
 * needed for password verification. In DB, store as TEXT or VARCHAR(255).
 *
 * @security
 * - Never commit passwords to version control
 * - Store hashed passwords in environment variables or secure database
 * - Use strong passwords with mixed case, numbers, and special characters
 * - Each hash is unique even for the same password (thanks to salt)
 * - Always use the escaped version in .env files to prevent shell variable expansion
 *
 * @see {@link https://www.npmjs.com/package/argon2|argon2 package}
 * @see {@link https://en.wikipedia.org/wiki/Argon2|Argon2 Algorithm}
 */

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
    console.log('📋 Raw hash:');
    console.log(hash);

    // Escape dollar signs for .env file usage
    const escapedHash = hash.replace(/\$/g, '\\$');

    console.log('\n📝 For .env file (copy this line):');
    console.log(`ADMIN_PASSWORD_HASH=${escapedHash}`);

    console.log('\n💡 Usage:');
    console.log('   • Copy the escaped version above to your .env file');
    console.log('   • The escaping prevents shell variable expansion');
  })
  .catch((error) => {
    console.error('❌ Error hashing password:', error);
    process.exit(1);
  });
