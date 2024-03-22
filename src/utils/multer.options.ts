import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multerS3 from 'multer-s3';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import * as path from 'path';
import { S3ClientService } from './s3Client/s3Client.service';

const storage = (s3ClientService: S3ClientService) => {
  if (process.env.NODE_ENV === 'test') {
    return multer.memoryStorage();
  }
  const s3 = s3ClientService.s3();
  return multerS3({
    s3,
    bucket: s3ClientService.bucket,
    key(_req, file, done) {
      const ext = path.extname(file.originalname); // 파일의 확장자 추출
      const basename = path.basename(file.originalname, ext); // 파일 이름
      // 파일 이름이 중복되는 것을 방지하기 위해 파일이름_날짜.확장자 형식으로 설정합니다.
      done(null, `${basename}_${Date.now()}${ext}`);
    },
  });
};
export const multerOptionsFactory = (
  s3ClientService: S3ClientService,
): MulterOptions => {
  // s3 인스턴스를 생성합니다.

  return {
    storage: storage(s3ClientService),
    limits: { fileSize: 10 * 1024 * 1024 },
  };
};
