import { UserWithRoles } from '@emma-project/types';
import { Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CsrfGuard } from './guards/csrf.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/login-admin
   * Admin login with password
   */
  @Post('login-admin')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Returns access token, refresh token, and CSRF token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginAdmin(@Req() req: Request & { user: UserWithRoles }) {
    const user = req.user; // Set by LocalStrategy

    // Issue tokens
    const { access, refresh } = this.authService.issueTokens(user);

    // Generate CSRF token
    const csrfToken = this.authService.generateCsrfToken(access);

    return {
      accessToken: access,
      refreshToken: refresh,
      csrfToken: csrfToken,
    };
  }

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token sent in X-Refresh-Token header
   */
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using X-Refresh-Token header' })
  @ApiResponse({ status: 200, description: 'Returns new tokens' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Req() req: Request & { headers: { 'x-refresh-token'?: string } }) {
    // Extract refresh token from X-Refresh-Token header
    const refreshToken = req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token in X-Refresh-Token header');
    }

    // Validate and issue new tokens
    const { access, refresh } = await this.authService.refreshFromToken(refreshToken);
    const csrfToken = this.authService.generateCsrfToken(access);

    return {
      accessToken: access,
      refreshToken: refresh,
      csrfToken: csrfToken,
    };
  }

  /**
   * POST /auth/logout
   * Logout (client-side token clearing, optionally add token blacklist)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout() {
    // In a stateless JWT setup, logout is handled client-side
    // Optionally: Add token to blacklist in Redis/DB
    return { ok: true };
  }

  /**
   * GET /auth/me
   * Get current admin user info
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns user with roles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: Request & { user: UserWithRoles }) {
    return req.user; // Set by JwtStrategy
  }
}
