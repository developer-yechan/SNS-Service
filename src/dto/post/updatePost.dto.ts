import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatePostDto } from './createPost.dto';
import { ApiProperty } from '@nestjs/swagger';
export class UpdatePostDto {
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  hashtags?: string;
}
