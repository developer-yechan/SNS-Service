import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString({ each: true })
  postImages: string[];

  @IsOptional()
  @IsString()
  hashtags: string;
}