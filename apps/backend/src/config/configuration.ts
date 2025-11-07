export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '30d',
  },

  csrf: {
    secret: process.env.CSRF_SECRET,
  },

  admin: {
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
  },

  database: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },

  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:4200',
  },
});
