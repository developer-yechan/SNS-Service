import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/createUserDto';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/dto/loginUserDto';
import { UpdateUserDto } from 'src/dto/updateUserDto';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  //   async createUser(data: CreateUserDto) {
  //     const { email, password, phone_number, name } = data;
  //     const user = new User();
  //     user.email = email;
  //     user.password = await bcrypt.hash(password, 10);
  //     user.phone_number = phone_number;
  //     user.name = name;
  //     await this.usersRepository.save(user);
  //     return user;
  //   }
  //   findAll(): Promise<User[]> {
  //     const users = this.usersRepository.find({
  //       select: {
  //         id: true,
  //         email: true,
  //         name: true,
  //         image: true,
  //       },
  //     });
  //     return users;
  //   }
  //   findOne(id: number): Promise<User> {
  //     return this.usersRepository.findOne({
  //       select: {
  //         id: true,
  //         email: true,
  //         name: true,
  //         image: true,
  //         phone_number: true,
  //       },
  //       where: {
  //         id,
  //       },
  //     });
  //   }
  //   findOneByEmail(email: string): Promise<User> {
  //     return this.usersRepository.findOne({
  //       select: {
  //         id: true,
  //         name: true,
  //         password: true,
  //       },
  //       where: {
  //         email,
  //       },
  //     });
  //   }
  //   async update(id: number, data: UpdateUserDto): Promise<string> {
  //     const updateUser = await this.usersRepository.update(id, {
  //       email: data.email,
  //       password: data.password,
  //       name: data.name,
  //       phone_number: data.phone_number,
  //       image: data.image,
  //     });
  //     if (!updateUser.affected) {
  //       throw new NotFoundException('이미 삭제된 유저입니다.');
  //     }
  //     // console.log(updateUser, 'update');
  //     return '회원 정보 수정 성공';
  //   }
  //   async remove(id: string): Promise<string> {
  //     const deleteUser = await this.usersRepository.delete(id);
  //     if (!deleteUser.affected) {
  //       throw new NotFoundException('이미 삭제된 유저입니다.');
  //     }
  //     // console.log(deleteUser, 'delete');
  //     return '회원 탈퇴 성공';
  //   }
}
