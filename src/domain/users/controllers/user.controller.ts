// users.controller.ts
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Req,
  Query,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

// DTOs for friend system
import { FriendRequestDto } from '../dtos/friend-request.dto';
import { AcceptRequestDto } from '../dtos/accept-request.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return new UserResponseDto(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiResponse({ status: 200, description: 'Current user info including images' })
  async getCurrentUser(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) throw new NotFoundException('User not found');
    return new UserResponseDto(user);
  }

  @Get('search')
  async searchUsers(@Query('q') query: string): Promise<UserResponseDto[]> {
    const users = await this.usersService.searchUsers(query);
    return users.map((user) => new UserResponseDto(user));
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseDto | null> {
    const user = await this.usersService.findById(id);
    return user ? new UserResponseDto(user) : null;
  }

  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Profile picture file',
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Updated user info with new profile picture' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('upload-profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadProfile(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const updatedUser = await this.usersService.updateImages(req.user.id, {
      profilePicture: `/uploads/profile-pictures/${file.filename}`,
    });
    return new UserResponseDto(updatedUser);
  }

  @ApiOperation({ summary: 'Upload cover picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Cover picture file',
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 200, description: 'Updated user info with new cover picture' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('upload-cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/cover-pictures',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadCover(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    const updatedUser = await this.usersService.updateImages(req.user.id, {
      coverPicture: `/uploads/cover-pictures/${file.filename}`,
    });
    return new UserResponseDto(updatedUser);
  }

  // ✅ Send Friend Request
  @ApiOperation({ summary: 'Send a friend request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('send-request')
  async sendFriendRequest(@Req() req: any, @Body() dto: FriendRequestDto) {
    // Send request and get the target user
    const targetUser = await this.usersService.sendFriendRequest(req.user.id, dto.friendId);

    // Return target user instead of current user
    return new UserResponseDto(targetUser);
  }


  // ✅ Accept Friend Request
  @ApiOperation({ summary: 'Accept a friend request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('accept-request')
  async acceptRequest(@Req() req: any, @Body() dto: AcceptRequestDto) {
    const user = await this.usersService.acceptFriendRequest(req.user.id, dto.requesterId);
    return new UserResponseDto(user);
  }

  // ✅ Reject Friend Request
  @ApiOperation({ summary: 'Reject a friend request' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('reject-request')
  async rejectRequest(@Req() req: any, @Body() dto: AcceptRequestDto) {
    const user = await this.usersService.rejectFriendRequest(req.user.id, dto.requesterId);
    return new UserResponseDto(user);
  }

  // ✅ Unfriend
  @ApiOperation({ summary: 'Unfriend a user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('unfriend')
  async unfriend(@Req() req: any, @Body() dto: FriendRequestDto) {
    const user = await this.usersService.unfriend(req.user.id, dto.friendId);
    return new UserResponseDto(user);
  }
}
