import { PostImage } from 'src/entity/post-images.entity';
import { getSchemaPath } from '@nestjs/swagger';
import { uploadResponse } from 'src/dto/file/successResponse.dto';

export const createSuccess = {
  description: '파일 s3 업로드 성공.',
  content: {
    'application/json': {
      example: [
        {
          id: 21,
          imageurl:
            'https://post-imagebucket.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20221009_193422897_01_1670229193535.jpg',
          postid: 11,
        },
      ],
      schema: {
        $ref: getSchemaPath(uploadResponse),
      },
    },
  },
};

export const deleteSuccess = {
  description: 's3에서 해당 id 이미지 파일 삭제 성공.',
  content: {
    'application/json': {
      example: {
        message: 's3 이미지 파일 삭제 완료',
      },
    },
  },
};
