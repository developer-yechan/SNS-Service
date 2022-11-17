import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dto/createPostDto';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/updatePostDto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() data: CreatePostDto, @Request() req) {
    const post = this.postService.create(data, req.user.userId);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getPosts() {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updatePosts(@Body() data: UpdatePostDto, @Request() req) {
    return this.postService.update(data);
  }
}
