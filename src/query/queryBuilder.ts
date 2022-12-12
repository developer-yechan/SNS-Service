import { FindPostsDao } from 'src/dao/findPosts.dao';
import { Post } from 'src/entity/post.entity';
import { hashtags } from 'src/query/subQuery';
import { SelectQueryBuilder } from 'typeorm';

export const findPostsQuery = (
  query: SelectQueryBuilder<Post>,
  findPostsDao: FindPostsDao,
) => {
  const { orderBy, order, search, filter, cnt } = findPostsDao;
  if (filter) {
    const hashtagArr = filter.split(',');
    const filteredHashtags = (subQuery) => {
      return subQuery
        .select([
          'posts.id AS postId',
          'ARRAY_AGG(hashtags.hashtag) AS hashtags',
        ])
        .from(Post, 'posts')
        .innerJoin('posts.hashtags', 'hashtags')
        .groupBy('posts.id');
    };
    //query parameter로 받은 해시태그가 있는 게시물만 남기기 위해 inner join 활용
    query.innerJoin(filteredHashtags, 'hashtags', 'posts.id = hashtags.postId');
    // hashtag 필터링 로직
    //[ex. “서울” 검색 시 > #서울(검색됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]
    //[ex. “서울,맛집” 검색 시 > #서울(검색안됨) / #서울맛집 (검색안됨)  / #서울,#맛집(검색됨)]
    hashtagArr.forEach((hashtag) => {
      query = query.andWhere(`'${hashtag}' = ANY(hashtags.hashtags)`);
    });
  } else {
    //해시태그가 있든 없든 모든 게시물이 표시되어야 하므로 left join 활용
    query.leftJoin(hashtags, 'hashtags', 'posts.id = hashtags.postId');
  }

  // query parameter에 search가 있을 경우 제목에서 검색
  if (search) {
    query = query.andWhere('posts.title ILIKE :search', {
      search: `%${search}%`,
    });
  }
  // query parameter에 orderBy와 order가 있을 경우 그에 맞게 정렬
  if (orderBy && order) {
    query = query.orderBy(orderBy, order);
    // orderBy만 있을 경우
  } else if (orderBy) {
    query = query.orderBy(orderBy, 'DESC', 'NULLS LAST');
    // default 정렬 기준 설정
  } else {
    query = query.orderBy('createdAt', 'DESC');
  }
  // query paramemter에 cnt가 있을 경우 그에 맞게 게시글 수 조정
  if (cnt) {
    query = query.limit(cnt);
    // default 게시글 수 설정
  } else {
    query = query.limit(10);
  }

  return query;
};
