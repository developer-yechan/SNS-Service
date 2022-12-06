import { PostLike } from 'src/entity/post-likes.entity';
import { getSchemaPath } from '@nestjs/swagger';

export const createSuccess = {
  description: '좋아요 처리 완료',
  content: {
    'application/json': {
      example: {
        message: '좋아요 처리 완료',
      },
    },
  },
};

export const deleteSuccess = {
  description: '좋아요 취소 완료',
  content: {
    'application/json': {
      example: {
        message: '좋아요 취소 완료',
      },
    },
  },
};
