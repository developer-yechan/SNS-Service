import { getSchemaPath } from '@nestjs/swagger';
import { commonError, unAuthorized } from 'src/dto/error/errorResponse.dto';

export const badRequestFail = {
  description: 'Bad Request',
  content: {
    'application/json': {
      example: {
        statusCode: 400,
        message: '파일이 존재하지 않습니다.',
        error: 'Bad Request',
      },
      schema: {
        $ref: getSchemaPath(commonError),
      },
    },
  },
};

export const unAuthorizedFail = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
      schema: {
        $ref: getSchemaPath(unAuthorized),
      },
    },
  },
};

export const notFoundFail = {
  description: 'Not Found',
  content: {
    'application/json': {
      example: {
        statusCode: 404,
        message: '해당 postId로 저장된 image가 없습니다.',
        error: 'Not Found',
      },
      schema: {
        $ref: getSchemaPath(commonError),
      },
    },
  },
};
