import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from 'src/post/post.repository';
import { PostLikeRepository } from './post-likes.repository';

@Injectable()
export class PostLikesService {
  constructor(
    private postLikeRepository: PostLikeRepository,
    private postRepository: PostRepository,
  ) {}
  async create(postId: number, userId: number) {
    // 게시물 없는 경우 예외처리
    const checkPost = await this.postRepository.findPost(postId);
    if (!checkPost) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    const postLike = await this.postLikeRepository.findPostLike(userId, postId);
    if (postLike) {
      throw new BadRequestException('이미 좋아요 처리된 게시물입니다.');
    }
    await this.postLikeRepository.createPostLike(userId, postId);
    return {
      message: '좋아요 처리 완료',
    };
  }

  async delete(postId: number, userId: number) {
    // 게시물 없는 경우 예외처리
    const checkPost = await this.postRepository.findPost(postId);
    if (!checkPost) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    const deleteLike = await this.postLikeRepository.deletePostLike(
      userId,
      postId,
    );
    if (!deleteLike.affected) {
      throw new BadRequestException('이미 좋아요가 취소된 게시물입니다.');
    }
    return { message: '좋아요 취소 완료' };
  }
}
