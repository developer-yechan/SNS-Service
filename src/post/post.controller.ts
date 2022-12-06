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
import { CreatePostDto } from 'src/dto/post/createPostDto';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdatePostDto } from 'src/dto/post/updatePostDto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { commonError } from 'src/dto/error/errorResponse.dto';
import { createPostType } from 'src/utils/swagger/post/successResponse';
import { unAuthorizedFail } from 'src/utils/swagger/user/errorResponse';
// import { Post } from 'src/entity/post.entity';
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
  @ApiCreatedResponse({
    description: '게시물 생성 성공.',
    type: createPostType,
  })
  @ApiResponse(unAuthorizedFail)
  @ApiBadRequestResponse({ description: 'Bad Request', type: commonError })
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
  @ApiOkResponse({ description: '게시물 목록 응답' })
  @ApiResponse(unAuthorizedFail)
  @ApiBadRequestResponse({ description: 'Bad Request', type: commonError })
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
  @ApiOperation({
    summary: '게시물 상세 조회 API',
    description: 'id에 해당하는 게시물을 가져옵니다.',
  })
  @ApiOkResponse({ description: '해당 id 게시물 정보 응답' })
  @ApiResponse(unAuthorizedFail)
  @ApiBadRequestResponse({ description: 'Bad Request', type: commonError })
  getPost(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({
    summary: '게시물 업데이트 API',
    description: 'id에 해당하는 게시물 정보를 업데이트합니다.',
  })
  @ApiOkResponse({ description: '게시물 업데이트 성공' })
  @ApiResponse(unAuthorizedFail)
  @ApiBadRequestResponse({ description: 'Bad Request', type: commonError })
  updatePosts(@Body() data: UpdatePostDto, @Request() req) {
    return this.postService.update(data, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  @ApiOperation({
    summary: '게시물 삭제 API',
    description: 'id에 해당하는 게시물을 삭제합니다.',
  })
  @ApiOkResponse({ description: '게시물 삭제 성공' })
  @ApiResponse(unAuthorizedFail)
  @ApiBadRequestResponse({ description: 'Bad Request', type: commonError })
  deletePosts(@Param('id') id: number, @Request() req) {
    return this.postService.delete(id, req.user.userId);
  }
}
