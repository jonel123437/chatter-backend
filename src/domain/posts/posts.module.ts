import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { Post, PostSchema } from './entities/post.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostsModule {}
