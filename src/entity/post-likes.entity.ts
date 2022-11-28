import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from 'src/entity/user.entity';

@Entity('postLikes')
export class PostLike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.postLikes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.postLikes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
