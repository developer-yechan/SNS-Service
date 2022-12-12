import { Hashtag } from 'src/entity/hashtag.entity';
import { Post } from 'src/entity/post.entity';

export class UpdatePostDao {
  id: number;

  title: string;

  content: string;

  hashtagInstanceArr?: Hashtag[];

  userId: number;

  post?: Post;
}
