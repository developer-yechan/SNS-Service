import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PostRepository } from 'src/post/post.repository';
import { HashtagRepository } from 'src/hashtag/hashtag.repository';
import {
  createPost,
  createPostDto,
  deleteFail,
  deleteSuccess,
  post,
  posts,
  updateSuccess,
  updatePostDto,
  postEntity,
} from 'src/post/mockValue';
import { NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let service: PostService;
  let postRepository: PostRepository;
  let hashtagRepository: HashtagRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PostRepository, HashtagRepository],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    hashtagRepository = module.get<HashtagRepository>(HashtagRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPost', () => {
    it('should return a created post', async () => {
      const result = createPost;
      const { title, content } = createPostDto;
      const hashtagInstanceArr = [
        {
          hashtag: '메신',
        },
        {
          hashtag: '전설을쓰다',
        },
      ];
      postRepository.createPost = jest.fn().mockResolvedValue(createPost);
      hashtagRepository.find = jest.fn().mockResolvedValue([]);
      expect(await service.create(createPostDto, 1)).toBe(result);
      expect(hashtagRepository.find).toBeCalledTimes(1);
      expect(postRepository.createPost).toBeCalledTimes(1);
      expect(postRepository.createPost).toHaveBeenCalledWith({
        title,
        content,
        userId: 1,
        hashtagInstanceArr,
      });
    });
  });

  describe('updatePost', () => {
    it('should return a success message object', async () => {
      const result = { message: '게시물 업데이트 완료' };
      const { id, title, content, hashtags } = updatePostDto;
      const hashtagInstanceArr = [];
      postRepository.findPostEntity = jest.fn().mockResolvedValue(postEntity);
      postRepository.updatePost = jest.fn().mockResolvedValue(updateSuccess);
      hashtagRepository.findHashtags = jest.fn().mockResolvedValue([]);
      expect(await service.update(updatePostDto, 1)).toEqual(result);
      expect(postRepository.findPostEntity).toHaveBeenCalledWith(id, 1);
      expect(postRepository.findPostEntity).toBeCalledTimes(1);
      expect(postRepository.updatePost).toHaveBeenCalledWith({
        id,
        title,
        content,
        userId: 1,
        hashtagInstanceArr,
        post: postEntity,
      });
      expect(postRepository.updatePost).toBeCalledTimes(1);
    });

    it('Not Found Error', async () => {
      postRepository.findPostEntity = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.update(updatePostDto, 1);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 게시물입니다.'),
      );
    });
  });

  describe('findPost', () => {
    it('should return a post', async () => {
      const result = post;
      postRepository.findPost = jest.fn().mockResolvedValue(post);
      postRepository.update = jest.fn();
      expect(await service.findOne(1)).toBe(result);
      expect(postRepository.findPost).toBeCalledTimes(1);
      expect(postRepository.findPost).toHaveBeenCalledWith(1);
      expect(postRepository.update).toBeCalledTimes(1);
    });

    it('Not Found Error', async () => {
      postRepository.findPost = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.findOne(1);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 게시물입니다.'),
      );
    });
  });

  describe('findAll', () => {
    it('should return posts', async () => {
      const result = posts;
      postRepository.findPosts = jest.fn().mockResolvedValue(posts);
      expect(await service.findAll()).toBe(result);
      expect(postRepository.findPosts).toBeCalledTimes(1);
    });
  });

  describe('deletePost', () => {
    it('should return a success message object', async () => {
      const result = { message: '게시물 삭제 완료' };
      postRepository.deletePost = jest.fn().mockResolvedValue(deleteSuccess);
      expect(await service.delete(1, 2)).toEqual(result);
      expect(postRepository.deletePost).toBeCalledTimes(1);
      expect(postRepository.deletePost).toHaveBeenCalledWith(1, 2);
    });

    it('Not Found Error', async () => {
      postRepository.deletePost = jest.fn().mockResolvedValue(deleteFail);
      expect(async () => {
        await service.delete(33, 2);
      }).rejects.toThrowError(
        new NotFoundException('이미 삭제된 게시물 입니다.'),
      );
    });
  });
});
