import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/dbConfig';
import { Post } from './entity/post.entity';
import { PostLike } from './entity/post-likes.entity';
import { PostComment } from './entity/post-comments.entity';
import { Hashtag } from './entity/hashtag.entity';
import { PostImage } from './entity/post-images.entity';
import { User } from './entity/user.entity';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    UserModule,
    PostModule,
    PostCommentsModule,
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
        synchronize: true,
        logging: ['query', 'error'],
        entities: [User, Post, PostLike, PostComment, Hashtag, PostImage],
      }),
    }),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
