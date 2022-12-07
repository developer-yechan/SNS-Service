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
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from 'src/dto/post/createPost.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/post/updatePost.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  createSuccess,
  deleteSuccess,
  findPostsSuccess,
  findPostSuccess,
  updateSuccess,
} from 'src/utils/swagger/post/successResponse';
import {
  unAuthorizedFail,
  notFoundFail,
  badRequestFail,
} from 'src/utils/swagger/post/errorResponse';
import {
  createResponse,
  findPosts,
  findPost,
} from 'src/dto/post/postResponse.dto';
import { commonError, unAuthorized } from 'src/dto/error/errorResponse.dto';
import { QueryParams } from 'src/dto/post/postQueryParams.dto';

@Controller('posts')
@ApiTags('게시물 API')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({
    summary: '게시물 생성 API',
    description: '게시물을 생성합니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(createResponse, unAuthorized, commonError)
  @ApiCreatedResponse(createSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiBadRequestResponse(badRequestFail)
  async createPost(@Body() data: CreatePostDto, @Request() req) {
    const post = await this.postService.create(data, req.user.userId);
    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: '게시물 전체 조회 API',
    description: '게시물 목록을 가져옵니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(findPosts, unAuthorized, commonError)
  @ApiOkResponse(findPostsSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  getPosts(@Query() query: QueryParams) {
    const { orderBy, order, search, filter, cnt } = query;
    return this.postService.findAll(orderBy, order, search, filter, cnt);
  }

  @ApiOperation({
    summary: '게시물 상세 조회 API',
    description: 'id에 해당하는 게시물을 가져옵니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(findPost, unAuthorized, commonError)
  @ApiOkResponse(findPostSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({
    summary: '게시물 업데이트 API',
    description: 'id에 해당하는 게시물 정보를 업데이트합니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(unAuthorized, commonError)
  @ApiOkResponse(updateSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiBadRequestResponse(badRequestFail)
  @ApiNotFoundResponse(notFoundFail)
  updatePosts(@Body() data: UpdatePostDto, @Request() req) {
    return this.postService.update(data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOperation({
    summary: '게시물 삭제 API',
    description: 'id에 해당하는 게시물을 삭제합니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(unAuthorized, commonError)
  @ApiOkResponse(deleteSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  deletePosts(@Param('id') id: number, @Request() req) {
    return this.postService.delete(id, req.user.userId);
  }
}
