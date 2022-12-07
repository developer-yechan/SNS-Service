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
import { IsEqualTo } from 'src/decorator/isEqualTo.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  //swagger api docs request body example과 schema를 @ApiProperty로 작성
  @ApiProperty({ description: 'email' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,14}$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @ApiProperty({ description: 'passwordConfirm' })
  @IsEqualTo('password')
  readonly passwordConfirm: string;

  @ApiProperty({ description: 'phone_number' })
  @IsMobilePhone()
  readonly phone_number: string;

  @ApiProperty({ description: 'name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'profile_image' })
  @IsOptional()
  @IsString()
  readonly image: string;
}
