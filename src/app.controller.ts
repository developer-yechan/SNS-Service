import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login/loginUserDto';
import { commonError } from 'src/dto/error/errorResponse.dto';
import { loginSuccess } from './utils/swagger/login/successResponse';
import {
  notFoundFail,
  unAuthorizedFail,
} from './utils/swagger/login/errorResponse';
import { loginResponse } from './dto/login/loginResponse.dto';
@Controller()
@ApiTags('로그인 API')
export class AppController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인 성공 시 엑세스 토큰을 반환합니다.',
  })
  @ApiExtraModels(loginResponse)
  @ApiOkResponse(loginSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  // AuthGuard('local')을 상속하는 LocalAuthGuard 클래스
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
