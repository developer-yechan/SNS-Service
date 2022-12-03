import { ApiProperty } from '@nestjs/swagger';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Post } from 'src/entity/post.entity';

type hashtags = [
  {
    id: number;
    hashtag: string;
  },
];

export abstract class createPostType extends Post {
  //   @ApiProperty()
  //   hashtags: hashtags;
}

export abstract class findPosts {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  hits: number;
  @ApiProperty()
  hashtags: hashtags;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;
}
