import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import {
  findUsers,
  findUser,
  updateUserDto,
  createUserDto,
  createReturnValue,
} from './mockValue';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of User', async () => {
      const result = findUsers;
      repository.findUsers = jest.fn().mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
      expect(repository.findUsers).toBeCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a User', async () => {
      const result = findUser;
      repository.findUser = jest.fn().mockResolvedValue(result);
      expect(await service.findOne(3)).toBe(result);
      expect(repository.findUser).toBeCalledTimes(1);
      expect(repository.findUser).toHaveBeenCalledWith(3);
    });

    it('Not Found Error', async () => {
      repository.findUser = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.findOne(3);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저입니다.'),
      );
    });
  });

  describe('createUser', () => {
    it('should return a User', async () => {
      const result = createReturnValue;
      repository.createUser = jest.fn().mockResolvedValue(result);
      expect(await service.create(createUserDto)).toBe(result);
      expect(repository.createUser).toBeCalledTimes(1);
      expect(repository.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('updateUser', () => {
    it('should return a success message object', async () => {
      const result = {
        message: '회원 정보 업데이트 완료',
      };
      repository.findUser = jest.fn().mockResolvedValue(findUser);
      repository.updateUser = jest.fn().mockResolvedValue(result);
      expect(await service.update(3, updateUserDto)).toBe(result);
      expect(repository.findUser).toBeCalledTimes(1);
      expect(repository.updateUser).toBeCalledTimes(1);
      expect(repository.findUser).toHaveBeenCalledWith(3);
      expect(repository.updateUser).toHaveBeenCalledWith(3, updateUserDto);
    });

    it('Not Found Error', async () => {
      repository.findUser = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.update(3, updateUserDto);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저입니다.'),
      );
    });
  });

  describe('deleteUser', () => {
    it('should return a success message object', async () => {
      const result = {
        message: '회원 탈퇴 완료',
      };
      repository.findUser = jest.fn().mockResolvedValue(findUser);
      repository.deleteUser = jest.fn().mockResolvedValue(result);
      expect(await service.remove(3)).toBe(result);
      expect(repository.findUser).toBeCalledTimes(1);
      expect(repository.deleteUser).toBeCalledTimes(1);
      expect(repository.findUser).toHaveBeenCalledWith(3);
      expect(repository.deleteUser).toHaveBeenCalledWith(3);
    });

    it('Not Found Error', async () => {
      repository.findUser = jest.fn().mockResolvedValue(null);
      expect(async () => {
        await service.remove(3);
      }).rejects.toThrowError(
        new NotFoundException('존재하지 않는 유저입니다.'),
      );
    });
  });
});
