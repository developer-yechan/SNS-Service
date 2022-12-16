import { Test, TestingModule } from '@nestjs/testing';
import { post } from 'src/post/mockValue';
import { PostRepository } from 'src/post/post.repository';
import { deleteSuccess, postLike } from './mockValue';
import { PostLikeRepository } from './post-likes.repository';
import { PostLikesService } from './post-likes.service';
import { NotFoundException } from '@nestjs/common';

describe('PostLikesService', () => {
  let service: PostLikesService;
  let postLikeRepository: PostLikeRepository;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostLikesService, PostLikeRepository, PostRepository],
    }).compile();

    service = module.get<PostLikesService>(PostLikesService);
    postLikeRepository = module.get<PostLikeRepository>(PostLikeRepository);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPostLike', () => {
    it('should return a success message object', async () => {
      const result = {
        message: '좋아요 처리 완료',
      };
      postRepository.findPost = jest.fn().mockResolvedValue(post);
      postLikeRepository.findPostLike = jest.fn().mockResolvedValue(null);
      postLikeRepository.createPostLike = jest
        .fn()
        .mockResolvedValue('create success');
      expect(await service.create(1, 2)).toEqual(result);
      expect(postRepository.findPost).toBeCalledTimes(1);
      expect(postRepository.findPost).toHaveBeenCalledWith(1);
      expect(postLikeRepository.findPostLike).toHaveBeenCalledWith(2, 1);
    });

    it('Not Found Error', async () => {
      postRepository.findPost = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.create(1, 2);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 게시물입니다.'),
      );
    });

    it('Bad Request Error', async () => {
      postRepository.findPost = jest.fn().mockResolvedValue(post);
      postLikeRepository.findPostLike = jest.fn().mockResolvedValue(postLike);
      expect(async () => {
        await service.create(1, 2);
      }).rejects.toThrowError(
        new NotFoundException('이미 좋아요 처리된 게시물입니다.'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should return a success message object', async () => {
      const result = {
        message: '좋아요 취소 완료',
      };
      postRepository.findPost = jest.fn().mockResolvedValue(post);
      postLikeRepository.deletePostLike = jest
        .fn()
        .mockResolvedValue(deleteSuccess);
      expect(await service.delete(1, 2)).toEqual(result);
      expect(postRepository.findPost).toBeCalledTimes(1);
      expect(postLikeRepository.deletePostLike).toBeCalledTimes(1);
      expect(postRepository.findPost).toHaveBeenCalledWith(1);
      expect(postLikeRepository.deletePostLike).toHaveBeenCalledWith(2, 1);
    });

    it('Not Found Error', async () => {
      postRepository.findPost = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.delete(33, 2);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 게시물입니다.'),
      );
    });
  });
});
