import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/module/typeorm-ex.module';
import { PostRepository } from 'src/post/post.repository';
import { PostLikesController } from './post-likes.controller';
import { postLikeRepository } from './post-likes.repository';
import { PostLikesService } from './post-likes.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([postLikeRepository, PostRepository]),
  ],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [PostLikesService],
})
export class PostLikesModule {}
