import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedNewPassword'),
}));

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    update: jest.fn().mockResolvedValue(true),
    findOne: jest.fn().mockResolvedValue({ id: 1, password: 'hashedNewPassword' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should hash password if provided and update user', async () => {
    const dto = { password: 'newPassword' };
    const result = await controller.update('1', dto);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 'salt');
    expect(service.update).toHaveBeenCalledWith(1, { password: 'hashedNewPassword' });
    expect(result).toEqual({ id: 1, password: 'hashedNewPassword' });
  });
});