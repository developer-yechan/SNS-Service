import {
  Body,
  Request,
  Controller,
  Patch,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto } from 'src/dto/createUserDto';
import { UpdateUserDto } from 'src/dto/updateUserDto';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { findUser, findUsers } from 'src/utils/swagger/userResponse';
import { unAuthorized, badRequest } from 'src/utils/swagger/errorResponse';
@Controller('users')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiOperation({ summary: '회원가입 API', description: '유저를 생성합니다.' })
  @ApiCreatedResponse({ description: '회원가입 성공.', type: User })
  @ApiBadRequestResponse({ description: 'Bad Request', type: badRequest })
  signUp(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
  @Get()
  @ApiOperation({
    summary: '유저 전체 조회 API',
    description: '유저 목록을 가져옵니다.',
  })
  @ApiOkResponse({
    description: '유저 목록 응답',
    type: findUser,
    isArray: true,
  })
  @ApiBadRequestResponse({ description: 'Bad Request', type: badRequest })
  getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  @ApiOperation({
    summary: '유저 상세 조회 API',
    description: 'id에 해당하는 유저 정보를 가져옵니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: unAuthorized,
  })
  @ApiOkResponse({ description: '해당 id 유저 정보 응답', type: findUsers })
  @ApiBadRequestResponse({ description: 'Bad Request', type: badRequest })
  getUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @ApiOperation({
    summary: '유저 정보 업데이트 API',
    description: 'id에 해당하는 유저 정보를 업데이트 합니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: unAuthorized,
  })
  @ApiOkResponse({ description: '회원 정보 수정 성공' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: badRequest })
  updateUser(@Request() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({
    summary: '회원탈퇴 API',
    description: 'id에 해당하는 유저 정보를 삭제합니다.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: unAuthorized,
  })
  @ApiOkResponse({ description: '회원 탈퇴 성공' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: badRequest })
  deleteUser(@Request() req) {
    return this.userService.remove(req.user.userId);
  }
}
