import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser = { id: 1, dni: 12345678, name: 'Test User', password: 'hashedPassword', role: 'cocinero' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should hash password and save user', async () => {
    const createUserDto = { dni: 12345678, name: 'Test', password: 'password', role: 'admin' } as any;
    mockUserRepository.create.mockReturnValue(mockUser);
    mockUserRepository.save.mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(mockUserRepository.create).toHaveBeenCalledWith({ ...createUserDto, password: 'hashedPassword' });
    expect(result).toEqual(mockUser);
  });
});