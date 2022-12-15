import { Test, TestingModule } from '@nestjs/testing';
import { post } from 'src/post/mockValue';
import { PostRepository } from 'src/post/post.repository';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';
import { files, uploadSuccess } from './mockValue';

describe('FileService', () => {
  let service: FileService;
  let fileRepository: FileRepository;
  let postRepository: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, FileRepository, PostRepository],
    }).compile();

    service = module.get<FileService>(FileService);
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
      expect(await service.uploadFile(1, files)).toBe(result);
    });
  });
});
