import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express'; // type-only import

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    const { access_token, user } = await this.authService.login(dto);
    return { access_token, user: new UserResponseDto(user) };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(@Req() req) {
    // Initiates OAuth flow
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { access_token, user } = await this.authService.validateOAuthLogin({
      name: req.user.name,
      email: req.user.email ?? undefined,
      picture: req.user.picture ?? undefined,
    });

    const frontendUrl = `http://localhost:3000/auth/google?token=${access_token}`;
    return res.redirect(frontendUrl);
  }

}
