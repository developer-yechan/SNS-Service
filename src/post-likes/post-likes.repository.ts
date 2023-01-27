import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { PostLike } from 'src/entity/post-likes.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { User } from '../entity/user.entity';
@CustomRepository(PostLike)
export class PostLikeRepository extends Repository<PostLike> {
  async createPostLike(userId: number, postId: number) {
    const like = new PostLike();
    const user = new User();
    const post = new Post();
    user.id = userId;
    post.id = postId;
    like.user = user;
    like.post = post;
    await this.save(like);
  }

  async findPostLike(userId: number, postId: number) {
    const postLike = await this.createQueryBuilder()
      .where('"userId" = :userId and "postId" = :postId', { userId, postId })
      .getRawOne();
    return postLike;
  }
  async deletePostLike(userId: number, postId: number) {
    const deleteLike = await this.createQueryBuilder()
      .delete()
      .where('postId = :postId and userId = :userId', { postId, userId })
      .execute();
    return deleteLike;
  }
}
