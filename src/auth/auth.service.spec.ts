import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { reqUser, user } from './mockValue';
import { NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService, UserRepository],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate user', () => {
    it('should return a user without password', async () => {
      const { password, ...result } = user;
      userService.findOneByEmail = jest.fn().mockResolvedValue(user);
      expect(await service.validateUser('bcd@naver.com', 'yechan6625')).toEqual(
        result,
      );
      expect(userService.findOneByEmail).toBeCalledTimes(1);
    });

    it('Wrong Email Not Found Error', async () => {
      userService.findOneByEmail = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.validateUser('bbcd@naver.com', 'yechan6625');
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저입니다.'),
      );
    });

    it('Wrong Password Not Found Error', async () => {
      userService.findOneByEmail = jest.fn().mockResolvedValue(user);
      expect(async () => {
        await service.validateUser('bcd@naver.com', 'yechan665');
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저입니다.'),
      );
    });
  });
  describe('login', () => {
    it('should return access token', async () => {
      const result = {
        access_token: 'accessToken',
      };
      const payload = { username: reqUser.name, sub: reqUser.id };
      jwtService.sign = jest.fn().mockReturnValue('accessToken');
      expect(await service.login(reqUser)).toEqual(result);
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });
  });
});
