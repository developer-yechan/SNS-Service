import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Matches } from 'class-validator';
import { CreateUserDto } from '../user/createUser.dto';
import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,14}$/, {
    message: 'password too weak',
  })
  readonly password: string;
}
