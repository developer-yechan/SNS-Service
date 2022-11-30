import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Bind,
  Query,
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
  async createPost(@Body() data: CreatePostDto, @Request() req) {
    const post = await this.postService.create(data, req.user.userId);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getPosts(
    @Query('orderBy') orderBy: string,
    @Query('order') order: 'DESC' | 'ASC',
    @Query('search') search: string,
    @Query('filter') filter: string,
    @Query('cnt') cnt: number,
  ) {
    return this.postService.findAll(orderBy, order, search, filter, cnt);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updatePosts(@Body() data: UpdatePostDto, @Request() req) {
    return this.postService.update(data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deletePosts(@Param('id') id: number, @Request() req) {
    return this.postService.delete(id, req.user.userId);
  }
}
