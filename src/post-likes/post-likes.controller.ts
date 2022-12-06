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
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import {
  createSuccess,
  deleteSuccess,
} from 'src/utils/swagger/postLike/successResponse';
import {
  unAuthorizedFail,
  notFoundFail,
  createBadRequest,
  deleteBadRequest,
} from 'src/utils/swagger/postLike/errorResponse';
import { PostLike } from 'src/entity/post-likes.entity';
@Controller('posts/likes')
@ApiTags('게시물 좋아요 API')
export class PostLikesController {
  constructor(private readonly postLikeService: PostLikesService) {}

  @ApiOperation({
    summary: '게시물 좋아요 생성 API',
    description: 'postId에 해당하는 게시물을 userId로 좋아요 처리합니다.',
  })
  @ApiCreatedResponse(createSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @ApiBadRequestResponse(createBadRequest)
  @UseGuards(JwtAuthGuard)
  @Post('/:postId')
  createLike(@Param('postId') postId: number, @Request() req) {
    return this.postLikeService.create(postId, req.user.userId);
  }

  @ApiOperation({
    summary: '게시물 좋아요 삭제 API',
    description:
      'userId로 좋아요 처리한 postId에 해당하는 게시물의 좋아요를 취소 합니다.',
  })
  @ApiCreatedResponse(deleteSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @ApiBadRequestResponse(deleteBadRequest)
  @UseGuards(JwtAuthGuard)
  @Delete('/:postId')
  deleteLike(@Param('postId') postId: number, @Request() req) {
    return this.postLikeService.delete(postId, req.user.userId);
  }
}
