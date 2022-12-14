import {
  Controller,
  Post,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  createSuccess,
  deleteSuccess,
} from 'src/utils/swagger/file/successResponse';
import {
  badRequestFail,
  unAuthorizedFail,
  notFoundFail,
} from 'src/utils/swagger/file/errorResponse';
import { uploadResponse } from 'src/dto/file/fileResponse.dto';

//postman으로 파일과 json 콘텐츠를 동시에 보낼 수 없어 file upload api는 따로 나눔
@Controller('files')
@ApiTags('파일 API')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({
    summary: '파일 업로드 API',
    description: '파일을 s3 storage에 업로드 합니다.',
  })
  @ApiBearerAuth('token')
  @ApiExtraModels(uploadResponse)
  @ApiCreatedResponse(createSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiBadRequestResponse(badRequestFail)
  @UseGuards(JwtAuthGuard)
  @Post('/images/:id')
  @UseInterceptors(FilesInterceptor('file'))
  uploadFile(
    @Param('id') postId: number,
    @UploadedFiles() files: Express.MulterS3.File[],
  ) {
    return this.fileService.uploadFile(postId, files);
  }

  @ApiOperation({
    summary: '파일 삭제 API',
    description: '파일을 s3 storage에서 삭제 합니다.',
  })
  @ApiBearerAuth('token')
  @ApiOkResponse(deleteSuccess)
  @ApiUnauthorizedResponse(unAuthorizedFail)
  @ApiNotFoundResponse(notFoundFail)
  @UseGuards(JwtAuthGuard)
  @Delete('/images/:id')
  DeleteFile(@Param('id') postId: number) {
    return this.fileService.deleteFile(postId);
  }
}
