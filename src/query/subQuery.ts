import { PostLike } from 'src/entity/post-likes.entity';
import { Post } from '../entity/post.entity';

export const likes = (subQuery) => {
  return subQuery
    .select(['COUNT(likes.postId) AS like_num', 'likes.postId AS postId'])
    .from(PostLike, 'likes')
    .groupBy('likes.postId');
};

// postId 별 hashtag 배열을 return 하는 subQuery
export const hashtags = (subQuery) => {
  return subQuery
    .select(['posts.id AS postId', 'ARRAY_AGG(hashtags.hashtag) AS hashtags'])
    .from(Post, 'posts')
    .leftJoin('posts.hashtags', 'hashtags')
    .groupBy('posts.id');
};

// postId 별 postImage 배열을 return 하는 subQuery

export const postImages = (subQuery) => {
  return subQuery
    .select([
      'posts.id AS "postId"',
      'ARRAY_AGG(postImages.imageUrl) AS images',
    ])
    .from(Post, 'posts')
    .leftJoin('posts.postImages', 'postImages')
    .groupBy('posts.id');
};
