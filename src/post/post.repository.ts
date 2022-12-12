import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Post } from 'src/entity/post.entity';
import { likes, hashtags } from 'src/query/subQuery';
import { CreatePostDao } from 'src/dao/createPost.dao';
import { User } from 'src/entity/user.entity';
import { UpdatePostDao } from 'src/dao/updatePost.dao';
import { FindPostsDao } from 'src/dao/findPosts.dao';
import { findPostsQuery } from 'src/query/queryBuilder';
@CustomRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(data: CreatePostDao) {
    const { title, content, hashtagInstanceArr, userId } = data;
    const post = new Post();
    const user = new User();
    if (hashtagInstanceArr) {
      post.hashtags = hashtagInstanceArr;
    }
    user.id = userId;
    post.title = title;
    post.content = content;
    post.user = user;
    await this.save(post);
    delete post.user;
    return post;
  }

  async updatePost(updatePostDao: UpdatePostDao) {
    const { id, title, content, post, hashtagInstanceArr, userId } =
      updatePostDao;
    // hashtagInstanceArr가 빈 배열이면 posts_hashtags_hashtags에서 post hashtag 맵핑된 row 전부 다 삭제
    // 빈 배열이 아니면 hashtag 테이블과 posts_hashtags_hashtags 테이블에서 hashtag 업데이트
    post.hashtags = hashtagInstanceArr;
    await this.save(post);

    // hashtag를 제외한 나머지 속성 update
    const updatePost = await this.createQueryBuilder()
      .update()
      .set({ title, content })
      .where('id = :id and userId = :userId', { id, userId })
      .execute();
    return updatePost;
  }

  async deletePost(id: number, userId: number) {
    const deletePost = await this.createQueryBuilder()
      .delete()
      .where('id = :id and userId = :userId', {
        id,
        userId,
      })
      .execute();
    return deletePost;
  }

  async findPosts(findPostsDao: FindPostsDao) {
    // 게시물 전체 조회 쿼리 작성
    let query = this.createQueryBuilder('posts')
      .select([
        'posts.id AS id',
        'posts.title AS title',
        'posts.createdAt AS createdAt',
        'COALESCE(posts.hits,0)::int AS hits',
        'users.name AS username',
        'hashtags.hashtags',
        'COALESCE(likes.like_num,0)::int AS like_num',
      ])
      .leftJoin('posts.user', 'users')
      .leftJoin(likes, 'likes', 'posts.id = likes.postId');

    query = findPostsQuery(query, findPostsDao);

    const posts = await query.getRawMany();
    return posts;
  }

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

  async findPostEntity(id: number, userId: number) {
    const post = await this.createQueryBuilder()
      .where('id = :id and "userId" = :userId', { id, userId })
      .getOne();

    return post;
  }
}
