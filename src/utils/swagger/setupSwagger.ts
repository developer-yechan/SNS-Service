import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */

export function setupSwagger(app: INestApplication): void {
  // api Docs 옵션 설정
  const options = new DocumentBuilder()
    .setTitle('SNS Service API Docs')
    .setDescription('SNS Service API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  // api Docs 경로 설정
  SwaggerModule.setup('api-docs', app, document);
}
