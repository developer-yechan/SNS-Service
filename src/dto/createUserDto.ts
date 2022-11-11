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

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,14}$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @IsEqualTo('password')
  readonly passwordConfirm: string;

  @IsMobilePhone()
  readonly phone_number: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;
}
