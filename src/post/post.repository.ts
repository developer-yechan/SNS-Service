import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { likes, hashtags } from 'src/query/subQuery';

@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
  async findPost(id: number) {
    const post = await this.createQueryBuilder('posts')
      .select([
        'posts.id AS id',
        'posts.title AS title',
        'posts.content AS content',
        'posts.createdAt AS createdAt',
        'COALESCE(posts.hits,0)::int AS hits',
        'users.name AS username',
        'hashtags.hashtags',
        'COALESCE(likes.like_num,0)::int AS like_num',
      ])
      .leftJoin('posts.user', 'users')
      .leftJoin(hashtags, 'hashtags', 'posts.id = hashtags.postId')
      .leftJoin(likes, 'likes', 'posts.id = likes.postId')
      .where('posts.id = :id', { id })
      .getRawOne();

    return post;
  }
}
