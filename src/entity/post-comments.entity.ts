import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateContent } from './abstract-base.entity';

@Entity('postComments')
export class PostComment extends DateContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @ManyToOne(() => Post, (post) => post.postComments, { nullable: false })
  post: Post;

  @ManyToOne(() => User, (user) => user.postComments, { nullable: false })
  user: User;
}
