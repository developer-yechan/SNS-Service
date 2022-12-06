import { getSchemaPath } from '@nestjs/swagger';
import {
  createResponse,
  findPosts,
  findPost,
} from 'src/dto/post/successResponse.dto';

export const createSuccess = {
  description: '게시물 생성 성공.',
  content: {
    'application/json': {
      example: {
        hashtags: [
          {
            id: 61,
            hashtag: '드디어',
          },
          {
            hashtag: '1등이라니',
            id: 66,
          },
        ],
        title: '1등',
        content: '월드컵 1등 한국',
        createdAt: '2022-12-06T13:56:31.406Z',
        updatedAt: '2022-12-06T13:56:31.406Z',
        id: 13,
        hits: 0,
        userId: 7,
      },
      schema: {
        $ref: getSchemaPath(createResponse),
      },
    },
  },
};

export const findPostsSuccess = {
  description: '전체 게시물 목록 응답',
  content: {
    'application/json': {
      example: [
        {
          id: 11,
          title: '취업~~',
          createdat: '2022-12-03T02:10:47.082Z',
          hits: 0,
          username: '찬찬!!',
          hashtags: ['드디어', '취업'],
          like_num: 1,
        },
      ],
      schema: {
        $ref: getSchemaPath(findPosts),
      },
    },
  },
};

export const findPostSuccess = {
  description: '해당 id 게시물 정보 응답',
  content: {
    'application/json': {
      example: {
        id: 11,
        title: '취업~~',
        content: '취뽀',
        createdat: '2022-12-03T02:10:47.082Z',
        hits: 1,
        username: '찬찬!!',
        hashtags: ['드디어', '취업'],
        like_num: 1,
      },
      schema: {
        $ref: getSchemaPath(findPost),
      },
    },
  },
};

export const updateSuccess = {
  description: '게시물 업데이트 성공',
  content: {
    'application/json': {
      example: {
        message: '게시물 업데이트 완료',
      },
    },
  },
};

export const deleteSuccess = {
  description: '게시물 삭제 성공',
  content: {
    'application/json': {
      example: {
        message: '게시물 삭제 완료',
      },
    },
  },
};
