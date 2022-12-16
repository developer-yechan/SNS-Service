import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3ClientService {
  public bucket: string;
  public region: string;
  public accessKeyId: string;
  public secretAccessKey: string;
  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get('AWS_BUCKET_NAME');
    this.region = this.configService.get('AWS_BUCKET_REGION');
    this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
  }
  s3() {
    const s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
    return s3Client;
  }
}
