import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';

@Entity('postLikes')
export class PostLike {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.postLikes)
  post: Post;

  @ManyToOne(() => User, (user) => user.postLikes)
  user: User;
}
