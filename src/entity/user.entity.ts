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
import { ApiProperty } from '@nestjs/swagger';
import { ChatRoom } from './chat-room.entity';
import { ChatMessage } from './chat-message.entity';
@Entity('users')
export class User extends DateContent {
  @PrimaryGeneratedColumn()
  //swagger api docs User schema 부분을 @ApiProperty로 작성
  @ApiProperty({ description: 'id' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'email' })
  email: string;

  @Column()
  @ApiProperty({ description: 'password' })
  password: string;

  @Column()
  @ApiProperty({ description: 'name' })
  name: string;

  @Column()
  @ApiProperty({ description: 'phone_number' })
  phone_number: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'profile_image' })
  image: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.host)
  chatRooms: ChatRoom[];

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes: PostLike[];
}
