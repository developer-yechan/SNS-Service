import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { s3ClientService } from './s3Client.service';

@Module({
  providers: [ConfigService, s3ClientService],
  exports: [ConfigService, s3ClientService],
})
export class s3ClientModule {}
