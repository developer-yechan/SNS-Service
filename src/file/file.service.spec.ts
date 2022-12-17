import { Test, TestingModule } from '@nestjs/testing';
import { post } from 'src/post/mockValue';
import { PostRepository } from 'src/post/post.repository';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { files, uploadSuccess } from './mockValue';
import { S3ClientService } from 'src/utils/s3Client/s3Client.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FileService', () => {
  let service: FileService;
  let fileRepository: FileRepository;
  let postRepository: PostRepository;
  let s3ClientService: S3ClientService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        FileRepository,
        PostRepository,
        S3ClientService,
        ConfigService,
      ],
    }).compile();

    service = module.get<FileService>(FileService);
    s3ClientService = module.get<S3ClientService>(S3ClientService);
    configService = module.get<ConfigService>(ConfigService);
    fileRepository = module.get<FileRepository>(FileRepository);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('upload success', async () => {
      const result = uploadSuccess;
      postRepository.findPost = jest.fn().mockResolvedValue(post);
      fileRepository.createPostImage = jest.fn().mockResolvedValue(result);
      expect(await service.uploadFile(1, files)).toBe(result);
      expect(postRepository.findPost).toBeCalledTimes(1);
      expect(postRepository.findPost).toHaveBeenCalledWith(1);
      expect(fileRepository.createPostImage).toBeCalledTimes(1);
      expect(fileRepository.createPostImage).toHaveBeenCalledWith(1, files);
    });

    it('Not Found Error', async () => {
      postRepository.findPost = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.uploadFile(1, files);
      }).rejects.toThrowError(
        new NotFoundException('게시물이 존재하지 않습니다.'),
      );
    });

    it('Bad Request Error', async () => {
      const emptyFiles = [];
      expect(async () => {
        await service.uploadFile(1, emptyFiles);
      }).rejects.toThrowError(
        new BadRequestException('파일이 존재하지 않습니다.'),
      );
    });
  });

  describe('deleteFile', () => {
    it('Not Found Error', async () => {
      fileRepository.findPostImages = jest.fn().mockResolvedValue([]);
      expect(async () => {
        await service.deleteFile(1);
      }).rejects.toThrowError(
        new NotFoundException('해당 postId로 저장된 image가 없습니다.'),
      );
    });
  });
});
