import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/utils/multer.options';
import { FileController } from './file.controller';
import { S3ClientModule } from 'src/utils/s3Client/s3Client.module.';
import { S3ClientService } from 'src/utils/s3Client/s3Client.service';
import { TypeOrmExModule } from 'src/module/typeorm-ex.module';
import { FileRepository } from './file.repository';
import { PostRepository } from 'src/post/post.repository';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [S3ClientModule],
      useFactory: multerOptionsFactory,
      inject: [S3ClientService],
    }),
    TypeOrmExModule.forCustomRepository([FileRepository, PostRepository]),
    S3ClientModule,
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
