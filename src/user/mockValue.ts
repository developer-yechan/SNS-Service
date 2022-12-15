import { UpdateUserDto } from 'src/dto/user/updateUser.dto';
import { CreateUserDto } from 'src/dto/user/createUser.dto';

export const findUsers = [
  {
    id: 3,
    email: 'abc@naver.com',
    name: '찬',
    image: null,
  },
];

export const findUser = {
  id: 3,
  email: 'abc@naver.com',
  name: '찬',
  image: null,
};

export const updateUserDto: UpdateUserDto = {
  name: '찬!!',
  phone_number: '010-1231-2233',
};

export const createUserDto: CreateUserDto = {
  email: 'bcd@naver.com',
  name: '민수',
  password: 'asdf',
  passwordConfirm: 'asdf',
  phone_number: '010-1234-1234',
};
export const createReturnValue = {
  email: 'bcd@naver.com',
  phone_number: '010-1234-1234',
  name: '민수',
  image: null,
  createdAt: '2022-12-15T02:23:39.728Z',
  updatedAt: '2022-12-15T02:23:39.728Z',
  id: 15,
};
