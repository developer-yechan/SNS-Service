import { Post } from 'src/entity/post.entity';

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('postImages')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => Post, (post) => post.postImages)
  post: Post;
}
