import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      const loginDto = { dni: 1234, password: 'password' } as any;
      const validUser = { id: 1, dni: 1234, role: 'admin' };
      
      mockAuthService.validateUser.mockResolvedValue(validUser);
      mockAuthService.login.mockResolvedValue({ access_token: 'token123' });

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(1234, 'password');
      expect(authService.login).toHaveBeenCalledWith(validUser);
      expect(result).toEqual({ access_token: 'token123' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto = { dni: 1234, password: 'wrong' } as any;
      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});