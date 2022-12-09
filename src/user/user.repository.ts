import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/createUser.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/dto/user/updateUser.dto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(data: CreateUserDto) {
    const { email, password, phone_number, name } = data;
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.phone_number = phone_number;
    user.name = name;
    await this.save(user);
    delete user.password;
    return user;
  }

  async findUsers(): Promise<User[]> {
    const users = await this.find({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
    return users;
  }

  async findUser(id: number): Promise<User> {
    const user = await this.findOne({
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
    if (!user) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      select: {
        id: true,
        name: true,
        password: true,
      },
      where: {
        email,
      },
    });
    return user;
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const user = await this.update(id, {
      email: data.email,
      password: data.password,
      name: data.name,
      phone_number: data.phone_number,
      image: data.image,
    });
    if (!user.affected) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return {
      message: '회원 정보 업데이트 완료',
    };
  }

  async deleteUser(id: string) {
    const user = await this.delete(id);
    if (!user.affected) {
      throw new NotFoundException('존재하지 않는 유저입니다.');
    }
    return {
      message: '회원 탈퇴 완료',
    };
  }
}
