import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { CreatePostDto } from 'src/dto/createPostDto';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() data: CreatePostDto, @Request() req) {
    return this.postService.create(data, req.user);
  }
}
