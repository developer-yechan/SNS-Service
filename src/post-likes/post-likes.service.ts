import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostLike } from 'src/entity/post-likes.entity';
import { Post } from 'src/entity/post.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class PostLikesService {
  constructor(
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  async create(postId: number, userId: number) {
    // 게시물 없는 경우 예외처리
    const checkPost = await this.postRepository.findOne({
      select: {
        id: true,
      },
      where: {
        id: postId,
      },
    });
    if (!checkPost) {
      throw new NotFoundException('존재하지 않는 게시물 입니다.');
    }
    const postLike = await this.postLikeRepository
      .createQueryBuilder()
      .where('"userId" = :userId and "postId" = :postId', { userId, postId })
      .getRawOne();
    if (postLike) {
      throw new BadRequestException('이미 좋아요 처리된 게시물입니다.');
    }
    const like = new PostLike();
    const user = new User();
    const post = new Post();
    user.id = userId;
    post.id = postId;
    like.user = user;
    like.post = post;
    await this.postLikeRepository.save(like);
    return like;
  }

  async delete(postId: number, userId: number) {
    const deleteLike = await this.postLikeRepository
      .createQueryBuilder()
      .delete()
      .where('postId = :postId and userId = :userId', { postId, userId })
      .execute();
    if (!deleteLike.affected) {
      throw new NotFoundException('이미 좋아요가 취소 되었습니다.');
    }
    return { message: '좋아요 취소 완료' };
  }
}
