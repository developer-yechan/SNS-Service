import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from 'src/entity/post-likes.entity';
import { Post } from 'src/entity/post.entity';
import { PostLikesController } from './post-likes.controller';
import { PostLikesService } from './post-likes.service';
@Module({
  imports: [TypeOrmModule.forFeature([PostLike, Post])],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [PostLikesService],
})
export class PostLikesModule {}
