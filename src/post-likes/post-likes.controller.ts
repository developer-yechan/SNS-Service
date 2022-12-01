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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('posts/likes')
@ApiTags('게시물 좋아요 API')
export class PostLikesController {
  constructor(private readonly postLikeService: PostLikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/:postId')
  @ApiOperation({
    summary: '게시물 좋아요 생성 API',
    description: 'postId에 해당하는 게시물을 userId로 좋아요 처리합니다.',
  })
  @ApiCreatedResponse({ description: '좋아요 처리 완료' })
  createLike(@Param('postId') postId: number, @Request() req) {
    return this.postLikeService.create(postId, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:postId')
  @ApiOperation({
    summary: '게시물 좋아요 삭제 API',
    description:
      'userId로 좋아요 처리한 postId에 해당하는 게시물의 좋아요를 취소 합니다.',
  })
  @ApiCreatedResponse({ description: '좋아요 처리 완료' })
  deleteLike(@Param('postId') postId: number, @Request() req) {
    return this.postLikeService.delete(postId, req.user.userId);
  }
}
