import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('postComments')
export class PostComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @ManyToOne(() => Post, (post) => post.postComments)
  post: Post;

  @ManyToOne(() => User, (user) => user.postComments)
  user: User;
}
