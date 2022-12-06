import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
// import { PostImage } from 'src/entity/post-images.entity';
import { Hashtag } from '../entity/hashtag.entity';
import { DataSource, Repository, Raw } from 'typeorm';
import { CreatePostDto } from '../dto/post/createPostDto';
import { User } from 'src/entity/user.entity';
import { PostLike } from 'src/entity/post-likes.entity';
import { UpdatePostDto } from 'src/dto/post/updatePostDto';
import { likes, hashtags } from 'src/query/subQuery';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(data: CreatePostDto, userId: number) {
    const { title, content, hashtags } = data;
    const post = new Post();
    //post에 userId 삽입을 위해 필요
    const user = new User();
    user.id = userId;
    // const myDataSource = new DataSource({type : "postgres", entities :[]})
    // body로 받은 hashtag 문자열 배열로 변환
    if (hashtags) {
      const hashtagInstanceArr = [];
      const hashtagArr = hashtags.split(',').map((hashtag) => hashtag.slice(1));
      // 현재 db에 저장된 hashtag 목록(객체) 가져오기
      const findHashtags = await this.hashtagRepository.find();
      // hashtag 객체에서 hashtag value 값만 배열로 할당
      const hashtagValueArr = findHashtags.map((hashtag) => hashtag['hashtag']);
      for (const hashtag of hashtagArr) {
        //새로운 hashtag들 hashtag table에 저장
        if (!hashtagValueArr.includes(hashtag)) {
          // 매 루프 마다 새로운 hashtag 객체 생성 --> 이렇게 안하면 매 루프 마다 hashtag 정보 덮어씌워짐
          const hashtagEntity = new Hashtag();
          hashtagEntity.hashtag = hashtag;

          await this.hashtagRepository.save(hashtagEntity);
          // ManyToMany table에 삽입을 위해 hashtagInstanceArr 배열에 hashtag 객체 push
          hashtagInstanceArr.push(hashtagEntity);
          // 이미 hashtag table에 저장된 hashtag들  ManyToMany table에 삽입을 위한 로직
        } else {
          const hashtagEntity = new Hashtag();

          const findHashtag = findHashtags.find(
            (element) => element.hashtag === hashtag,
          );
          hashtagEntity.id = findHashtag.id;
          hashtagEntity.hashtag = findHashtag.hashtag;
          hashtagInstanceArr.push(hashtagEntity);
        }
      }
      if (hashtagInstanceArr.length !== 0) {
        post.hashtags = hashtagInstanceArr;
      }
    }
    post.title = title;
    post.content = content;
    post.user = user;
    await this.postRepository.save(post);
    delete post.user;
    return post;
  }

  async update(data: UpdatePostDto, userId: number) {
    const { id, title, content, hashtags } = data;

    const findPost = await this.findOne(id);
    if (hashtags) {
      // 새로운 hashtag 인스턴스를 담아줄 배열
      let hashtagInstanceArr = [];
      //update할 hashtag 문자열을 배열로 변환
      let newHashtagArr = hashtags
        .split(',')
        .map((hashtag) => hashtag.slice(1));
      //update할 hashtag 목록에 있는 db hashtag 목록
      const findHashtags = await this.hashtagRepository
        .createQueryBuilder()
        .select(['id', 'hashtag'])
        .where('hashtag IN (:...hashtags)', { hashtags: newHashtagArr })
        .getRawMany();
      // hashtag 객체에서 hashtag 문자열만 추출하여 새로운 배열 반환
      const hashtagArr = findHashtags.map((hashtag) => hashtag.hashtag);
      // update할 hashtag 배열에서 새로운 hashtag만 필터링한 배열 반환(기존에 db에 없는)
      newHashtagArr = newHashtagArr.filter(
        (hashtag) => !hashtagArr.includes(hashtag),
      );
      // 새로운 hashtag가 있을 경우에 각 hashtag 마다 새로운 hashtag 인스턴스 생성
      if (newHashtagArr.length > 0) {
        for (const newHashtag of newHashtagArr) {
          const hashtagEntity = new Hashtag();
          hashtagEntity.hashtag = newHashtag;
          hashtagInstanceArr.push(hashtagEntity);
        }
      }
      // 기존의 hashtag에서 남겨야할 hashtag + 새로운 hashtag 배열
      hashtagInstanceArr = [...findHashtags, ...hashtagInstanceArr];
      // hashtag 테이블과 posts_hashtags_hashtags 테이블에 삽입
      findPost.hashtags = hashtagInstanceArr;
      await this.postRepository.save(findPost);
    }
    // hashtag를 제외한 나머지 속성 update
    const updatePost = await this.postRepository.update(id, {
      title,
      content,
    });
    // 게시물 삭제된 경우 예외처리
    if (!updatePost.affected) {
      throw new NotFoundException('이미 삭제된 게시물입니다.');
    }
    return { message: '게시물 업데이트 완료' };
  }

  async findAll(
    orderBy: string,
    order: 'DESC' | 'ASC',
    search: string,
    filter: string,
    cnt: number,
  ): Promise<Post[]> {
    // 게시물 전체 조회 쿼리 작성
    let query = this.postRepository
      .createQueryBuilder('posts')
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

    // query parameter로 filter가 있는 경우 where 조건문을 통해 해시태그 필터링
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
      query.innerJoin(
        filteredHashtags,
        'hashtags',
        'posts.id = hashtags.postId',
      );
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

    const posts = await query.getRawMany();
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository
      .createQueryBuilder('posts')
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

    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    // 조회수 + 1
    await this.postRepository.update(id, {
      hits: post.hits + 1,
    });
    post.hits += 1;
    return post;
  }

  async delete(id: number, userId: number) {
    const deletePost = await this.postRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id and userId = :userId', {
        id,
        userId,
      })
      .execute();
    if (!deletePost.affected) {
      throw new NotFoundException('이미 삭제된 게시물 입니다.');
    }
    return { message: '게시물 삭제 성공' };
  }
}
