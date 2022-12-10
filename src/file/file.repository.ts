import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { PostImage } from 'src/entity/post-images.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Post } from 'src/entity/post.entity';

@CustomRepository(PostImage)
export class FileRepository extends Repository<PostImage> {
  async createPostImage(postId: number, files: Express.MulterS3.File[]) {
    const post = new Post();
    post.id = postId;
    for (const file of files) {
      const postImage = new PostImage();
      postImage.imageUrl = file.location;
      postImage.post = post;
      await this.save(postImage);
    }
    const postImages = this.findPostImages(postId);
    return postImages;
  }

  async findPostImages(postId: number) {
    const images = await this.createQueryBuilder('postImages')
      .select([
        'postImages.id AS id',
        'postImages.imageUrl AS imageUrl',
        'postImages.postId AS postId',
      ])
      .where('postImages.postId = :postId', { postId })
      .getRawMany();
    return images;
  }

  async deletePostImage(postId: number) {
    await this.createQueryBuilder()
      .delete()
      .where('postId = :postId', { postId })
      .execute();
    return { message: 's3 이미지 파일 삭제 완료' };
  }
}
