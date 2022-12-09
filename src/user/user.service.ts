import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/user/createUser.dto';
import { UpdateUserDto } from 'src/dto/user/updateUser.dto';
import { User } from '../entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: CreateUserDto) {
    const user = this.userRepository.createUser(data);
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.findUsers();
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findUser(id);
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    return user;
  }
  async update(id: number, data: UpdateUserDto) {
    const userUpdate = await this.userRepository.updateUser(id, data);
    return userUpdate;
  }

  async remove(id: string) {
    const userDelete = await this.userRepository.deleteUser(id);
    return userDelete;
  }
}
