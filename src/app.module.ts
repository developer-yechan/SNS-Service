import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/dbConfig';
import { Post } from './entity/post.entity';
import { PostLike } from './entity/post-likes.entity';
import { Hashtag } from './entity/hashtag.entity';
import { PostImage } from './entity/post-images.entity';
import { User } from './entity/user.entity';
import { FileModule } from './file/file.module';
import { ChatModule } from './websocket/chat.module';
import { ChatRoomModule } from './chat-room/chat_room.module';
import { ChatRoom } from './entity/chat-room.entity';
import { ChatMessage } from './entity/chat-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UserModule,
    PostModule,
    PostLikesModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('database.host'),
        port: ConfigService.get('database.port'),
        username: ConfigService.get('database.username'),
        password: ConfigService.get('database.password'),
        database: ConfigService.get('database.name'),
        synchronize: false,
        logging: ['query', 'error'],
        entities: [
          User,
          Post,
          PostLike,
          Hashtag,
          PostImage,
          ChatRoom,
          ChatMessage,
        ],
        // migrations: ['dist/database/migrations/*.js'],
      }),
    }),
    FileModule,
    ChatModule,
    // ChatRoomModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
