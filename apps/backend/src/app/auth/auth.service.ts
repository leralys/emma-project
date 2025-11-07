import { AuthenticatedUser } from '@emma-project/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { type StringValue } from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  /**
   * Issue access and refresh tokens for admin
   */
  issueTokens(user: AuthenticatedUser) {
    const accessPayload = {
      sub: user.id,
      name: user.name,
      roles: user.roles,
    };

    const refreshPayload = {
      sub: user.id,
      typ: 'refresh',
    };

    const access = this.jwtService.sign(accessPayload); // expiration is inherited from module config

    const refresh = this.jwtService.sign(refreshPayload, {
      expiresIn: this.config.get<string>('jwt.refreshExpires', '30d') as StringValue,
    });

    return { access, refresh };
  }

  /**
   * Generate CSRF token tied to access token
   */
  generateCsrfToken(accessToken: string): string {
    const csrfSecret = this.config.getOrThrow<string>('csrf.secret');
    return crypto.createHmac('sha256', csrfSecret).update(accessToken).digest('hex');
  }

  /**
   * Refresh tokens using refresh token
   */
  async refreshFromToken(refreshToken: string, user: AuthenticatedUser) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (payload.typ !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Issue new tokens
      return this.issueTokens({
        id: user.id,
        name: user.name,
        roles: user.roles,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
