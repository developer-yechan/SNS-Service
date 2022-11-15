import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../entity/post.entity';
// import { PostImage } from 'src/entity/post-images.entity';
import { Hashtag } from '../entity/hashtag.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from '../dto/createPostDto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class PostService {
  private dataSource: DataSource;
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Hashtag)
    private hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(data: CreatePostDto, user: User) {
    const { title, content, postImages, hashtags } = data;
    const post = new Post();
    // const myDataSource = new DataSource({type : "postgres", entities :[]})
    // body로 받은 hashtag 문자열 배열로 변환
    if (hashtags) {
      const hashtagInstanceArr = [];
      const hashtagArr = hashtags.split(',');
      console.log(hashtagArr, 123);
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
        console.log(hashtagInstanceArr, 789);
        post.hashtags = hashtagInstanceArr;
      }
    }
    post.title = title;
    post.content = content;
    post.user = user;

    await this.postRepository.save(post);
  }
}
