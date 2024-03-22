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
import { ChatMessage } from './chat-message.entity';

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ManyToOne(() => User, (user) => user.chatRooms, {
    onDelete: 'CASCADE',
  })
  host?: User;

  @RelationId((chatRoom: ChatRoom) => chatRoom.host)
  @ApiProperty()
  hostId: number;

  @ManyToOne(() => User, (user) => user.chatRooms, {
    onDelete: 'CASCADE',
  })
  participant?: User;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.user)
  chatMessages: ChatMessage[];

  @RelationId((chatRoom: ChatRoom) => chatRoom.participant)
  @ApiProperty()
  participantId: number;
}
