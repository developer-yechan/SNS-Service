import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity('hashtags')
export class Hashtag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hashtag: string;

  @ManyToMany(() => Post, (posts) => posts.id, {
    cascade: true,
  })
  posts: Post[];
}
