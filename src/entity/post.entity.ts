import { ApiProperty } from '@nestjs/swagger';
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
} from 'typeorm';
import { DateContent } from './abstract-base.entity';
import { Hashtag } from './hashtag.entity';
import { PostImage } from './post-images.entity';

@Entity('posts')
export class Post extends DateContent {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ nullable: false })
  @ApiProperty()
  title: string;

  @Column({ nullable: false })
  @ApiProperty()
  content: string;

  //조회 수
  @Column({ default: 0 })
  @ApiProperty()
  hits: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @RelationId((post: Post) => post.user)
  @ApiProperty()
  userId: number;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  @ApiProperty()
  postLikes: PostLike[];

  @OneToMany(() => PostImage, (postImage) => postImage.post)
  @ApiProperty()
  postImages: PostImage[];

  @ManyToMany(() => Hashtag, (hashtags) => hashtags.id, {
    cascade: true,
  })
  @JoinTable()
  @ApiProperty()
  hashtags: Hashtag[];
}
