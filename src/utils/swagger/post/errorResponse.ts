import { getSchemaPath } from '@nestjs/swagger';
import { commonError, unAuthorized } from 'src/dto/error/errorResponse.dto';

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
        message: '존재하지 않는 유저입니다.',
        error: 'Not Found',
      },
      schema: {
        $ref: getSchemaPath(commonError),
      },
    },
  },
};
