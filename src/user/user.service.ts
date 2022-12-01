import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/createUserDto';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/dto/loginUserDto';
import { UpdateUserDto } from 'src/dto/updateUserDto';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const { email, password, phone_number, name } = data;
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.phone_number = phone_number;
    user.name = name;
    await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  findAll(): Promise<User[]> {
    const users = this.usersRepository.find({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
    return users;
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phone_number: true,
      },
      where: {
        id,
      },
    });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        name: true,
        password: true,
      },
      where: {
        email,
      },
    });
  }
  async update(id: number, data: UpdateUserDto): Promise<string> {
    const updateUser = await this.usersRepository.update(id, {
      email: data.email,
      password: data.password,
      name: data.name,
      phone_number: data.phone_number,
      image: data.image,
    });
    if (!updateUser.affected) {
      throw new NotFoundException('이미 삭제된 유저입니다.');
    }
    return '회원 정보 수정 성공';
  }

  async remove(id: string): Promise<string> {
    const deleteUser = await this.usersRepository.delete(id);
    if (!deleteUser.affected) {
      throw new NotFoundException('이미 삭제된 유저입니다.');
    }
    return '회원 탈퇴 성공';
  }
}
