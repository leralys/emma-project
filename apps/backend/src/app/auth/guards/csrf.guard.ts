import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract access token from Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('Missing authorization token');
    }

    const accessToken = authHeader.substring(7); // Remove "Bearer "
    const providedCsrf = request.headers['x-csrf-token'];

    if (!providedCsrf) {
      throw new ForbiddenException('CSRF token missing');
    }

    // Calculate expected CSRF token
    const expectedCsrf = crypto
      .createHmac('sha256', process.env.CSRF_SECRET)
      .update(accessToken)
      .digest('hex');

    if (expectedCsrf !== providedCsrf) {
      throw new ForbiddenException('CSRF token invalid');
    }

    return true;
  }
}
