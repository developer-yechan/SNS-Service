import { Injectable, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { DeleteObjectsCommand, S3ServiceException } from '@aws-sdk/client-s3';
import { S3ClientService } from 'src/utils/s3Client/s3Client.service';
import { FileRepository } from './file.repository';
import { PostRepository } from 'src/post/post.repository';
@Injectable()
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private postRepository: PostRepository,
    private s3ClientService: S3ClientService,
  ) {}

  async uploadFile(postId: number, files: Express.MulterS3.File[]) {
    if (files.length === 0) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }
    const post = await this.postRepository.findPost(postId);
    if (!post) {
      throw new NotFoundException('게시물이 존재하지 않습니다.');
    }
    const fileUpload = await this.fileRepository.createPostImage(postId, files);
    return fileUpload;
  }
  async deleteFile(postId: number) {
    const s3 = this.s3ClientService.s3();
    const images = await this.fileRepository.findPostImages(postId);
    if (images.length === 0) {
      throw new NotFoundException('해당 postId로 저장된 image가 없습니다.');
    }
    const deleteObject = [];
    for (const image of images) {
      const url = image.imageurl.split('/'); // db에 저장된 imageUrl을 가져옴
      const delFileName = url[url.length - 1]; // imageUrl에서 파일 이름만 가져옴
      deleteObject.push({ Key: delFileName });
    }
    const params = {
      Bucket: this.s3ClientService.bucket,
      Delete: {
        Objects: deleteObject,
      },
    };
    try {
      await s3.send(new DeleteObjectsCommand(params));
    } catch (err) {
      console.log(err);
      throw new S3ServiceException({
        $fault: 'client',
        $metadata: {
          httpStatusCode: 400,
        },
        name: 'aws s3 delete error',
      });
    }
    const postImageDelete = await this.fileRepository.deletePostImage(postId);
    return postImageDelete;
  }
}
