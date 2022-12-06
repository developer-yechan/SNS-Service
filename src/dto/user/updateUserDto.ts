import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto';
import {
  IsEmail,
  IsMobilePhone,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
//PartialType 쓰면 @ApiProperty는 상속이 안됨
export class UpdateUserDto {
  @ApiProperty({ description: 'email' })
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password' })
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,14}$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @ApiProperty({ description: 'phone_number' })
  @IsOptional()
  @IsMobilePhone()
  readonly phone_number: string;

  @ApiProperty({ description: 'name' })
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'profile_image' })
  @IsOptional()
  @IsString()
  readonly image: string;
}
