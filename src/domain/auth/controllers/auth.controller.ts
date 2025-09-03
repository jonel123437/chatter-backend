import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { UserResponseDto } from '../../users/dtos/user-response.dto';
import { UserMapper } from '../../users/mappers/user.mapper';

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

    // Map Domain User → DTO
    const userDto = new UserResponseDto(user);

    // Return both user info and JWT token
    return {
      access_token,
      user: userDto,
    };
  }
}
