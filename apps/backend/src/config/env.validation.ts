import { z } from 'zod';

/**
 * Environment schema with Zod
 * Validates all required environment variables at app startup
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // JWT Configuration
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security')
    .describe('Secret key for JWT token signing'),

  JWT_ACCESS_EXPIRES: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_ACCESS_EXPIRES must be in format like "15m", "1h", "30d"')
    .default('15m')
    .describe('Access token expiration time (e.g., 15m, 1h)'),

  JWT_REFRESH_EXPIRES: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_REFRESH_EXPIRES must be in format like "30d", "7d"')
    .default('30d')
    .describe('Refresh token expiration time (e.g., 30d, 7d)'),

  // Security
  CSRF_SECRET: z
    .string()
    .min(32, 'CSRF_SECRET must be at least 32 characters for security')
    .describe('Secret key for CSRF token generation'),

  // Admin Authentication
  ADMIN_PASSWORD_HASH: z
    .string()
    .refine((val) => val.startsWith('$argon2'), 'ADMIN_PASSWORD_HASH must be an argon2 hash')
    .describe('Argon2 hash of admin password'),

  // Database
  DATABASE_URL: z
    .string()
    .refine((val) => {
      try {
        new URL(val);
        return val.startsWith('postgres');
      } catch {
        return false;
      }
    }, 'DATABASE_URL must be a valid PostgreSQL connection URL')
    .describe('Neon database connection URL'),

  DIRECT_URL: z
    .string()
    .refine((val) => {
      try {
        new URL(val);
        return val.startsWith('postgres');
      } catch {
        return false;
      }
    }, 'DIRECT_URL must be a valid PostgreSQL connection URL')
    .describe('Neon direct database connection URL'),

  // Frontend
  FRONTEND_URL: z
    .string()
    .refine((val) => {
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'FRONTEND_URL must be a valid URL')
    .default('http://localhost:4200')
    .describe('Frontend URL for CORS configuration'),

  // Optional: Server Port
  PORT: z.coerce.number().int().positive().default(3000).describe('Server port number'),
});

/**
 * Infer TypeScript type from schema
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Called by ConfigModule on app startup
 */
export function validate(config: Record<string, unknown>): Env {
  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => {
        const path = issue.path.join('.');
        return `  ❌ ${path}: ${issue.message}`;
      });

      throw new Error(
        `\n⚠️  Environment validation failed:\n\n${messages.join('\n')}\n\n` +
          `Please check your .env file and ensure all required variables are set correctly.\n`
      );
    }
    throw error;
  }
}
