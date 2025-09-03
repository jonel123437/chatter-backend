import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({
    description: 'User registration payload',
    type: CreateUserDto,
    examples: {
      sample: {
        summary: 'Example user',
        value: {
          name: 'John Doe',
          email: 'admin@example.com',
          password: 'asd'
        },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return new UserResponseDto(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findById(id);
    if (!user) return null;
    return new UserResponseDto(user);
  }
}
