import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/utils/multer.options';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entity/post.entity';
import { PostImage } from 'src/entity/post-images.entity';
import { FileController } from './file.controller';
import { s3ClientModule } from 'src/utils/s3Client/s3Client.module.';
import { s3ClientService } from 'src/utils/s3Client/s3Client.service';
import { TypeOrmExModule } from 'src/module/typeorm-ex.module';
import { FileRepository } from './file.repository';
import { PostRepository } from 'src/post/post.repository';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [s3ClientModule],
      useFactory: multerOptionsFactory,
      inject: [s3ClientService],
    }),
    TypeOrmModule.forFeature([Post, PostImage]),
    TypeOrmExModule.forCustomRepository([FileRepository, PostRepository]),
    s3ClientModule,
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
