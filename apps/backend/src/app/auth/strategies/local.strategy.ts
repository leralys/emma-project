import { db } from '@emma-project/database';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as argon2 from 'argon2';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'password', // Passport-local's strategy by default expects a "username" field
      passwordField: 'password',
    });
  }

  async validate(
    _username: string,
    password: string
  ): Promise<{ id: string; roles: string[]; name: string | null }> {
    // For admin login, we only validate password against ADMIN_PASSWORD_HASH
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      throw new UnauthorizedException('Admin password not configured');
    }

    try {
      const isValid = await argon2.verify(adminPasswordHash, password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid password');
      }

      // Password is correct, now get real user from DB
      const adminUser = await db.user.findFirst({
        where: {
          roles: {
            some: { role: 'admin' },
          },
        },
        include: {
          roles: true,
        },
      });

      if (!adminUser) {
        throw new UnauthorizedException('Admin user not found');
      }

      return {
        id: adminUser.id,
        roles: adminUser.roles.map((r) => r.role),
        name: adminUser.name,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
