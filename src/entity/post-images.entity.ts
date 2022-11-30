import { Post } from 'src/entity/post.entity';

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateContent } from './abstract-base.entity';

@Entity('postImages')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 's3 업로드된 location url' })
  imageUrl: string;

  @ManyToOne(() => Post, (post) => post.postImages, { nullable: false })
  post: Post;
}
