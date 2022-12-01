import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsString, Matches } from 'class-validator';
import { CreateUserDto } from './createUserDto';
import { ApiProperty } from '@nestjs/swagger';
export class LoginUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,14}$/, {
    message: 'password too weak',
  })
  readonly password: string;
}
