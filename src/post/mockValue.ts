import { CreatePostDto } from 'src/dto/post/createPost.dto';
import { UpdatePostDto } from 'src/dto/post/updatePost.dto';
import { Post } from 'src/entity/post.entity';

export const createPostDto: CreatePostDto = {
  title: '메시!!',
  content: '월드컵 1등 아르헨가자',
  hashtags: '#메신,#전설을쓰다',
};

export const updatePostDto: UpdatePostDto = {
  id: 1,
  title: '메시!!',
  content: '메시는 메시 역시는 역시',
};

export const createPost = {
  hashtags: [
    {
      hashtag: '메신',
      id: 78,
    },
    {
      hashtag: '전설을쓰다',
      id: 79,
    },
  ],
  title: '메시!!',
  content: '월드컵 1등 아르헨가자',
  createdAt: '2022-12-16T13:30:52.229Z',
  updatedAt: '2022-12-16T13:30:52.229Z',
  id: 35,
  hits: 0,
  userId: 6,
};
export const postEntity: Post = {
  id: 35,
  title: '모로코~!~!',
  content: '우승가자~!!!',
  hits: 0,
  userId: 6,
};
export const post = {
  id: 11,
  title: '취업~~',
  content: '취뽀',
  createdat: '2022-12-03T02:10:47.082Z',
  hits: 1,
  username: '찬찬!!',
  hashtags: ['드디어', '취업'],
  like_num: 1,
};

export const posts = [
  {
    id: 11,
    title: '취업~~',
    content: '취뽀',
    createdat: '2022-12-03T02:10:47.082Z',
    hits: 1,
    username: '찬찬!!',
    hashtags: ['드디어', '취업'],
    like_num: 1,
  },
];

export const updateSuccess = { generatedMaps: [], raw: [], affected: 1 };

export const deleteSuccess = { raw: [], affected: 1 };

export const deleteFail = { raw: [], affected: 0 };
