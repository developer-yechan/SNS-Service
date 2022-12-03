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
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/loginUserDto';
import { commonError } from 'src/dto/error/errorResponse.dto';
@Controller()
@ApiTags('로그인 API')
export class AppController {
  constructor(private authService: AuthService) {}
  // AuthGuard('local')을 상속하는 LocalAuthGuard 클래스
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인 성공 시 엑세스 토큰을 반환합니다.',
  })
  @ApiOkResponse({ description: '로그인 성공' })
  @ApiBadRequestResponse({ description: 'Bad Request', type: commonError })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
