import { PostLike } from 'src/entity/post-likes.entity';
import { User } from 'src/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  DeleteDateColumn,
} from 'typeorm';
import { DateContent } from './abstract-base.entity';
import { Hashtag } from './hashtag.entity';
import { PostImage } from './post-images.entity';

@Entity('posts')
export class Post extends DateContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  content: string;

  //조회 수
  @Column({ nullable: true })
  hits: number | 0;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @RelationId((post: Post) => post.user)
  userId: number;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  postLikes: PostLike[];

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  postImages: PostImage[];

  @ManyToMany(() => Hashtag, (hashtags) => hashtags.id, {
    cascade: true,
  })
  @JoinTable()
  hashtags: Hashtag[];
}
