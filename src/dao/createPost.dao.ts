import { Hashtag } from 'src/entity/hashtag.entity';

export class CreatePostDao {
  title: string;

  content: string;

  hashtagInstanceArr?: Hashtag[];

  userId: number;
}
