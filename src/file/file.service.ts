import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/entity/post-images.entity';
import { Post } from 'src/entity/post.entity';
import { Repository } from 'typeorm';
import { DeleteObjectsCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { s3ClientService } from 'src/utils/s3Client/s3Client.service';
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(PostImage)
    private postImageRepository: Repository<PostImage>,
    private s3ClientService: s3ClientService,
  ) {}

  uploadFile(postId: number, files: Express.MulterS3.File[]) {
    if (!files) {
      throw new BadRequestException('파일이 존재하지 않습니다.');
    }
    const post = new Post();
    post.id = postId;
    for (const file of files) {
      const postImage = new PostImage();
      postImage.imageUrl = file.location;
      postImage.post = post;
      this.postImageRepository.save(postImage);
    }

    return files;
  }

  async deleteFile(postId: number) {
    const s3 = this.s3ClientService.s3();
    const images = await this.postImageRepository
      .createQueryBuilder()
      .select('"imageUrl" AS imageUrl')
      .where('"postId" = :postId', { postId })
      .getRawMany();
    const deleteObject = [];
    for (const image of images) {
      console.log(image, 'image');
      const url = image.imageurl.split('/'); // db에 저장된 imageUrl을 가져옴
      const delFileName = url[url.length - 1]; // imageUrl에서 파일 이름만 가져옴
      console.log(delFileName, 'delFileName');
      deleteObject.push({ Key: delFileName });
    }
    const params = {
      Bucket: this.s3ClientService.bucket,
      Delete: {
        Objects: deleteObject,
      },
    };
    s3.send(new DeleteObjectsCommand(params), function (err, data) {
      if (err) {
        console.log('aws image delete error');
        console.log(err, err.stack);
      } else {
        console.log('aws delete success');
      }
    });

    await this.postImageRepository
      .createQueryBuilder()
      .delete()
      .where('postId = :postId', { postId })
      .execute();
    return 's3 이미지 파일 삭제 완료';
  }
}
