import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreatePostDto } from './createPostDto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNumber()
  id: number;
}
