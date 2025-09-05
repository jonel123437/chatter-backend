import { Body, Controller, Post, Get, Param, Req, Query, UseGuards, Patch, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserImagesDto } from '../dtos/update-user-images.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserResponseDto } from '../dtos/user-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiResponse({ status: 200, description: 'Current user info including images' })
  async getCurrentUser(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return full info including images
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Get('search')
  async searchUsers(@Query('q') query: string): Promise<UserResponseDto[]> {
    const users = await this.usersService.searchUsers(query);
    return users.map(user => new UserResponseDto(user));
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
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
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
    return updatedUser;
  }

  @ApiOperation({ summary: 'Upload cover picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Cover picture file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
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
    return updatedUser;
  }
}
