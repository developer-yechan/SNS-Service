import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateUserDto } from './createUserDto';

export class LoginUserDto extends PartialType(CreateUserDto) {}
