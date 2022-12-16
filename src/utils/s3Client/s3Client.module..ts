import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { S3ClientService } from './s3Client.service';

@Module({
  providers: [ConfigService, S3ClientService],
  exports: [ConfigService, S3ClientService],
})
export class S3ClientModule {}
