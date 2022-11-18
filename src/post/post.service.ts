import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
// import { PostImage } from 'src/entity/post-images.entity';
import { Hashtag } from '../entity/hashtag.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/createPostDto';
import { User } from 'src/entity/user.entity';
import { PostLike } from 'src/entity/post-likes.entity';
import { UpdatePostDto } from 'src/dto/updatePostDto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(data: CreatePostDto, userId: number) {
    const { title, content, postImages, hashtags } = data;
    const post = new Post();
    //post에 userId 삽입을 위해 필요
    const user = new User();
    user.id = userId;
    // const myDataSource = new DataSource({type : "postgres", entities :[]})
    // body로 받은 hashtag 문자열 배열로 변환
    if (hashtags) {
      const hashtagInstanceArr = [];
      const hashtagArr = hashtags.split(',');
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
    console.log(post, 'post');
    await this.postRepository.save(post);
    return post;
  }

  async update(data: UpdatePostDto) {
    const { id, title, content, postImages, hashtags } = data;
    const newPost = new Post();

    if (hashtags) {
      const hashtagInstanceArr = [];
      const hashtagArr = hashtags.split(',');
      // 현재 db에 저장된 hashtag 목록(객체) 가져오기
      const findHashtags = await this.postRepository
        .createQueryBuilder('posts')
        .select('hashtags.hashtag')
        .leftJoin('posts.hashtags', 'hashtags')
        .where('posts.id = :id', { id })
        .getRawMany();
      const hashtagValueArr = findHashtags.map((hashtag) => hashtag['hashtag']);
      const hashtagToRemove = findHashtags.filter((hashtag) => {
        hashtag;
      });
      const newHashtagArr = hashtagArr.filter(
        (hashtag) => !hashtagValueArr.includes(hashtag),
      );
      for (const newHashtag of newHashtagArr) {
        const hashtagEntity = new Hashtag();
        hashtagEntity.hashtag = newHashtag;
        await this.hashtagRepository.save(hashtagEntity);
        hashtagInstanceArr.push(hashtagEntity);
      }
      newPost.hashtags = hashtagInstanceArr;
      await this.postRepository.save(newPost);
      const post = this.postRepository;
      const newHashtags = await this.postRepository
        .createQueryBuilder('posts')
        .select('hashtags.hashtag')
        .leftJoin('posts.hashtags', 'hashtags')
        .where('posts.id = :id', { id })
        .getRawMany();
      newPost.hashtags = newHashtags.filter((hashtag) => {
        return;
      });
    }
  }

  async findAll(): Promise<Post[]> {
    const hashtags = (subQuery) => {
      return subQuery
        .select([
          'posts.id AS postId',
          'ARRAY_AGG(hashtags.hashtag) AS hashtags',
        ])
        .from(Post, 'posts')
        .leftJoin('posts.hashtags', 'hashtags')
        .groupBy('posts.id');
    };
    const likes = (subQuery) => {
      return subQuery
        .select('SUM(likes.postId)', 'likes')
        .from(PostLike, 'likes')
        .groupBy('likes.postId');
    };
    const posts = await this.postRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id AS id',
        'posts.title AS title',
        'posts.createdAt AS createdAt',
        'posts.hits AS hits',
        'users.name AS username',
        'hashtags.hashtags',
      ])
      .addSelect(likes)
      .leftJoin('posts.user', 'users')
      .leftJoin(hashtags, 'hashtags', 'posts.id = hashtags.postId')
      .getRawMany();
    return posts;
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    return post;
  }

  async delete(id: number, userId: number) {
    const deletePost = await this.postRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id and userId = :userId and deletedAt is null', {
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
