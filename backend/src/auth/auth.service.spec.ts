import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = { findOneByDNI: jest.fn() };
  const mockJwtService = { sign: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should return user details if valid', async () => {
    const user = { id: 1, dni: "1234", password: 'hashedPassword', role: 'admin' };
    mockUsersService.findOneByDNI.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.validateUser(1234, 'correctPass');
    expect(result).toEqual({ id: 1, dni: "1234", role: 'admin' });
  });

  it('should return token on login', async () => {
    const user = { id: 1, dni: "1234", role: 'admin' } as any;
    mockJwtService.sign.mockReturnValue('test-token');

    const result = await service.login(user);
    expect(result).toEqual({ access_token: 'test-token' });
  });
});