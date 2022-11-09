import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostLikesController } from './post-likes/post-likes.controller';
import { PostLikesService } from './post-likes/post-likes.service';
import { PostCommentsController } from './post-comments/post-comments.controller';
import { PostCommentsService } from './post-comments/post-comments.service';
import config from './config/dbConfig';
import { Post } from './entity/post.entity';
import { PostLike } from './entity/post-likes.entity';
import { PostComment } from './entity/post-comments.entity';
import { Hashtag } from './entity/hashtag.entity';
import { PostImage } from './entity/post-images.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UserModule,
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
        synchronize: true,
        entities: [User, Post, PostLike, PostComment, Hashtag, PostImage],
      }),
    }),
  ],
  controllers: [
    AppController,
    PostController,
    PostLikesController,
    PostCommentsController,
  ],
  providers: [AppService, PostService, PostLikesService, PostCommentsService],
})
export class AppModule {}
