import { ApiProperty } from '@nestjs/swagger';
import { Hashtag } from 'src/entity/hashtag.entity';

export class createResponse {
  @ApiProperty()
  hashtags: Hashtag[];
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  hits: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class findPosts {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  hits: number;
  @ApiProperty()
  hashtags: Hashtag[];
  @ApiProperty()
  title: string;
  @ApiProperty()
  like_num: number;
  @ApiProperty()
  createdAt: Date;
}

export class findPost extends findPosts {
  @ApiProperty()
  content: string;
}
