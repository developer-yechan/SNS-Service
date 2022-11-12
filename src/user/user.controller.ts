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
import { LoginUserDto } from 'src/dto/loginUserDto';
import { UpdateUserDto } from 'src/dto/updateUserDto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  signUp(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getUser(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(@Request() req, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Request() req) {
    return this.userService.remove(req.user.userId);
  }
}
