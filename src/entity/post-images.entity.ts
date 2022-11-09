import { Post } from 'src/entity/post.entity';

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('postImages')
export class PostImage {
  @PrimaryColumn()
  id: number;

  @Column()
  image: string;

  @ManyToOne(() => Post, (post) => post.postImages)
  post: Post;
}
