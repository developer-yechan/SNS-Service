import { Post } from 'src/entity/post.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostLike } from 'src/entity/post-likes.entity';
import { DateContent } from './abstract-base.entity';

@Entity('users')
export class User extends DateContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];
}
