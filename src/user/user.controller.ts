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
import { CreateUserDto } from 'src/dto/user/createUser.dto';
import { UpdateUserDto } from 'src/dto/user/updateUser.dto';
import { UserService } from './user.service';
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
import { User } from 'src/entity/user.entity';
import {
  createSuccess,
  deleteSuccess,
  findUsersSuccess,
  findUserSuccess,
  updateSuccess,
} from 'src/utils/swagger/user/successResponse';
import { findUser, findUsers } from 'src/dto/user/userResponse.dto';
import {
  badRequestFail,
  notFoundFail,
  unAuthorizedFail,
} from 'src/utils/swagger/user/errorResponse';
import { commonError, unAuthorized } from 'src/dto/error/errorResponse.dto';

@Controller('users')
@ApiTags('유저 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '회원가입 API', description: '유저를 생성합니다.' })
  @ApiExtraModels(User, commonError)
  @ApiCreatedResponse(createSuccess)
  @ApiBadRequestResponse(badRequestFail)
  @Post()
  signUp(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @ApiOperation({
    summary: '유저 전체 조회 API',
    description: '유저 목록을 가져옵니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(findUsers, unAuthorized, commonError)
  @ApiOkResponse(findUsersSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @ApiOperation({
    summary: '유저 상세 조회 API',
    description: 'id에 해당하는 유저 정보를 가져옵니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(findUser, unAuthorized, commonError)
  @ApiOkResponse(findUserSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({
    summary: '유저 정보 업데이트 API',
    description: 'id에 해당하는 유저 정보를 업데이트 합니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(unAuthorized, commonError)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiOkResponse(updateSuccess)
  @ApiBadRequestResponse(badRequestFail)
  @ApiNotFoundResponse(notFoundFail)
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(@Request() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.userId, data);
  }

  @ApiOperation({
    summary: '회원탈퇴 API',
    description: 'id에 해당하는 유저 정보를 삭제합니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(unAuthorized, commonError)
  @ApiOkResponse(deleteSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Request() req) {
    return this.userService.remove(req.user.userId);
  }
}
