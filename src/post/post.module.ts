import { Module } from '@nestjs/common';
import { HashtagRepository } from 'src/hashtag/hashtag.repository';
import { TypeOrmExModule } from 'src/module/typeorm-ex.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  //InjectRepository를 위해  forFeature에 entity 추가해야함
  imports: [
    TypeOrmExModule.forCustomRepository([PostRepository, HashtagRepository]),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
