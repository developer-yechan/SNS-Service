import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUserDto';
import { LoginUserDto } from 'src/dto/loginUserDto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  signUp(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }

  // @Post('/login')
  // login(@Body() data: LoginUserDto) {
  //   return this.userService.login(data);
  // }
}
