import {
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostLikesService } from './post-likes.service';

@Controller('posts/likes')
export class PostLikesController {
  constructor(private readonly postLikeService: PostLikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:id')
  createLike(@Param('id') id: number, @Request() req) {
    return this.postLikeService.create(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:postId')
  deleteLike(@Param('postId') postId: number, @Request() req) {
    return this.postLikeService.delete(postId, req.user.userId);
  }
}
