import { Controller, Post, Get, Body, UseGuards, Req, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { PostResponseDto } from '../dtos/post-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import type { Request } from 'express';
import { User } from '../../users/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Post created', type: PostResponseDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreatePostDto, @Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.postService.createPost({ ...dto, authorId: userId });
  }

  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List of posts', type: [PostResponseDto] })
  @Get()
  async getAll() {
    return this.postService.getPosts();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get posts of the current user' })
  @ApiResponse({ status: 200, description: 'List of posts', type: [PostResponseDto] })
  async getVisiblePosts(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.postService.getPostsByUser(userId, userId);
  }

  // Fetch all public posts (requires login)
  @Get('public')
  @ApiOperation({ summary: 'Get all public posts' })
  @ApiResponse({ status: 200, description: 'List of public posts', type: [PostResponseDto] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPublicPosts() {
    return this.postService.getPublicPosts();
  }

  // Fetch posts by any user ID
  @Get(':id')
  @ApiOperation({ summary: 'Get posts by a specific user ID' })
  @ApiResponse({ status: 200, description: 'List of posts', type: [PostResponseDto] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getPostsByUser(@Param('id') userId: string, @Req() req: RequestWithUser) {
    const currentUserId = req.user.id;
    return this.postService.getPostsByUser(userId, currentUserId);
  }
}
