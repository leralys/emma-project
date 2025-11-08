import { AuthenticatedUser } from '@emma-project/types';
import {
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/admin/login
   * Admin login with password
   */
  @Post('admin/login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginAdminDto })
  @ApiResponse({ status: 200, description: 'Returns access token, refresh token, and CSRF token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async loginAdmin(@Req() req: Request & { user: AuthenticatedUser }) {
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
   * POST /auth/admin/refresh
   * Refresh access token using refresh token sent in X-Refresh-Token header
   */
  @Post('admin/refresh')
  @ApiOperation({ summary: 'Refresh access token using X-Refresh-Token header' })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Returns new tokens' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Req() req: Request & { headers: { 'x-refresh-token'?: string } } & { user: AuthenticatedUser }
  ) {
    const user = req.user;
    const refreshToken = req.headers['x-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token in X-Refresh-Token header');
    }

    // Validate and issue new tokens
    const { access, refresh } = await this.authService.refreshFromToken(refreshToken, user);
    const csrfToken = this.authService.generateCsrfToken(access);

    return {
      accessToken: access,
      refreshToken: refresh,
      csrfToken: csrfToken,
    };
  }

  /**
   * GET /auth/admin/me
   * Get current admin user info
   */
  @Get('admin/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Returns user with roles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: Request & { user: AuthenticatedUser }) {
    return req.user; // Set by JwtStrategy
  }
}
