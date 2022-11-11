import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dto/createUserDto';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/dto/loginUserDto';

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
    return user;
  }

  // async login(data: LoginUserDto) {
  //   const { email, password } = data;
  //   const isExistingUser = await this.findOneByEmail(email);
  //   if (!isExistingUser) {
  //     throw new NotFoundException(`User with Email ${email} not found`);
  //   }
  //   const validatePassword = await bcrypt.compare(
  //     password,
  //     isExistingUser.password,
  //   );

  //   if (!validatePassword) {
  //     throw new UnauthorizedException();
  //   }
  //   return '로그인 성공!';
  // }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
