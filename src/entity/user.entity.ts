import { Post } from 'src/entity/post.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PostLike } from 'src/entity/post-likes.entity';
import { PostComment } from 'src/entity/post-comments.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];

  @OneToMany(() => PostComment, (postComment) => postComment.user)
  postComments: PostComment[];
}
