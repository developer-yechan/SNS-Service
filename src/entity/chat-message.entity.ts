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
import { ChatRoom } from './chat-room.entity';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => User, (user) => user.chatMessages, {
    onDelete: 'CASCADE',
  })
  user?: User;

  @RelationId((chatMessage: ChatMessage) => chatMessage.user)
  @ApiProperty()
  userId: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatMessages, {
    onDelete: 'CASCADE',
  })
  chatRoom?: ChatRoom;

  @RelationId((chatMessage: ChatMessage) => chatMessage.chatRoom)
  @ApiProperty()
  chatRoomId: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  sendTime: Date;
}
