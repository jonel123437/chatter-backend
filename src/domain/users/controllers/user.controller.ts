import { Body, Controller, Post, Get, Param, Req, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return new UserResponseDto(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiResponse({ status: 200, description: 'Current user', type: UserResponseDto })
  async getCurrentUser(@Req() req: any): Promise<UserResponseDto> {
    const user = await this.usersService.findById(req.user.id);
    return new UserResponseDto(user!);
  }

  // --- SEARCH USERS MUST BE BEFORE :id ---
  @Get('search')
  @ApiOperation({ summary: 'Search users by name or email' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query (name or email)' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  async searchUsers(@Query('q') query: string): Promise<UserResponseDto[]> {
    const users = await this.usersService.searchUsers(query);
    return users.map(user => new UserResponseDto(user));
  }

  // --- DYNAMIC :id ROUTE LAST ---
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  async getUser(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findById(id);
    return user ? new UserResponseDto(user) : null;
  }
}
