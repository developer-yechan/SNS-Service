import { getSchemaPath } from '@nestjs/swagger';
import { User } from 'src/entity/user.entity';
import { findUser, findUsers } from 'src/dto/user/userApiResponse.dto';

// interface 나 type은 오류난다.

export const createSuccess = {
  description: '회원가입 성공.',
  content: {
    'application/json': {
      example: [
        {
          email: 'a@naver.com',
          phone_number: '010-1234-1234',
          name: '민수',
          image: null,
          createdAt: '2022-12-03T06:06:52.791Z',
          updatedAt: '2022-12-03T06:06:52.791Z',
          id: 11,
        },
      ],
      schema: {
        $ref: getSchemaPath(User),
      },
    },
  },
};

export const findUsersSuccess = {
  description: '전체 유저 목록 응답',
  content: {
    'application/json': {
      example: [
        {
          id: 3,
          email: 'abc@naver.com',
          name: '찬',
          image: null,
        },
      ],
      schema: {
        $ref: getSchemaPath(findUsers),
      },
    },
  },
};

export const findUserSuccess = {
  description: '해당 id 유저 정보 응답',
  content: {
    'application/json': {
      example: {
        id: 11,
        email: 'a@naver.com',
        name: '민수',
        phone_number: '010-1234-1234',
        image: null,
      },
      schema: {
        $ref: getSchemaPath(findUsers),
      },
    },
  },
};
