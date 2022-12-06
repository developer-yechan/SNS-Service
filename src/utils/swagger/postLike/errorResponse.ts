import { getSchemaPath } from '@nestjs/swagger';
import { commonError, unAuthorized } from 'src/dto/error/errorResponse.dto';

export const createBadRequest = {
  description: 'Bad Request',
  content: {
    'application/json': {
      example: {
        statusCode: 400,
        message: '이미 좋아요 처리된 게시물입니다.',
        error: 'Bad Request',
      },
      schema: {
        $ref: getSchemaPath(commonError),
      },
    },
  },
};

export const deleteBadRequest = {
  description: 'Bad Request',
  content: {
    'application/json': {
      example: {
        statusCode: 400,
        message: '이미 좋아요가 취소된 게시물입니다.',
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
        message: '존재하지 않는 게시물입니다.',
        error: 'Not Found',
      },
      schema: {
        $ref: getSchemaPath(commonError),
      },
    },
  },
};
