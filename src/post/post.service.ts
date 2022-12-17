import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '../entity/post.entity';
import { Hashtag } from '../entity/hashtag.entity';
import { CreatePostDto } from '../dto/post/createPost.dto';
import { UpdatePostDto } from 'src/dto/post/updatePost.dto';
import { PostRepository } from './post.repository';
import { CreatePostDao } from 'src/dao/createPost.dao';
import { HashtagRepository } from 'src/hashtag/hashtag.repository';
import { UpdatePostDao } from 'src/dao/updatePost.dao';
@Injectable()
export class PostService {
  constructor(
    private hashtagRepository: HashtagRepository,
    private postRepository: PostRepository,
  ) {}

  async create(data: CreatePostDto, userId: number) {
    const { title, content, hashtags } = data;
    const createPostDao: CreatePostDao = { title, content, userId };
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
          //hashtag와 post는 ManyToMany 관계라 cascade 옵션 true 줘서 굳이 hashtagRepository 호출 안해도 됨
          // await this.hashtagRepository.save(hashtagEntity);

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
        createPostDao.hashtagInstanceArr = hashtagInstanceArr;
      }
    }
    const post = await this.postRepository.createPost(createPostDao);
    return post;
  }

  async update(data: UpdatePostDto, userId: number) {
    const { id, title, content, hashtags } = data;
    // getOne은 entity 반환 getRawOne은 raw data 반환 여기서는 기존 post entity에 새로운 hashtag를 맵핑 해줘야 하므로 getOne 사용
    const findPost = await this.postRepository.findPostEntity(id, userId);
    if (!findPost) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    const updatePostDao: UpdatePostDao = { id, title, content, userId };
    // update할 hashtag 인스턴스를 담아줄 배열
    let hashtagInstanceArr = [];
    if (hashtags) {
      //update할 hashtag 문자열을 배열로 변환
      let newHashtagArr = hashtags
        .split(',')
        .map((hashtag) => hashtag.slice(1));
      //update할 hashtag 목록에 있는 db hashtag 목록
      const findHashtags = await this.hashtagRepository.findHashtags(
        newHashtagArr,
      );
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
          //hashtag와 post는 ManyToMany 관계라 cascade 옵션 true 줘서 굳이 hashtagRepository 호출 안해도 됨
          // await this.hashtagRepository.save(hashtagEntity);
          hashtagInstanceArr.push(hashtagEntity);
        }
      }
      // 기존의 hashtag에서 남겨야할 hashtag + 새로운 hashtag 배열
      hashtagInstanceArr = [...findHashtags, ...hashtagInstanceArr];
    }
    updatePostDao.hashtagInstanceArr = hashtagInstanceArr;
    updatePostDao.post = findPost;
    const updatePost = await this.postRepository.updatePost(updatePostDao);
    // 게시물 삭제된 경우 예외처리
    if (!updatePost.affected) {
      throw new NotFoundException('이미 삭제된 게시물입니다.');
    }
    return { message: '게시물 업데이트 완료' };
  }

  async findAll(
    orderBy?: string,
    order?: 'DESC' | 'ASC',
    search?: string,
    filter?: string,
    cnt?: number,
  ): Promise<Post[]> {
    const findPostsDao = { orderBy, order, search, filter, cnt };
    const posts = await this.postRepository.findPosts(findPostsDao);
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findPost(id);
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
    const deletePost = await this.postRepository.deletePost(id, userId);
    if (!deletePost.affected) {
      throw new NotFoundException('이미 삭제된 게시물 입니다.');
    }
    return { message: '게시물 삭제 완료' };
  }
}
