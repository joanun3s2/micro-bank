import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUserService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleUserCreated', () => {
    it('should handle user created message', async () => {
      const userData = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        address: '123 Main St',
        age: 30,
      };

      mockUserService.create.mockResolvedValue({
        id: 1,
        ...userData,
        sourceId: userData.id,
      });

      const result = await controller.handleUserCreated(userData);

      expect(result).toEqual({ id: 1, ...userData, sourceId: userData.id });
      expect(userService.create).toHaveBeenCalledWith({
        ...userData,
        sourceId: userData.id,
      });
    });
  });

  describe('handleUserUpdated', () => {
    it('should handle user updated message', async () => {
      const updateData = {
        id: 1,
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      mockUserService.update.mockResolvedValue(updateData);

      const result = await controller.handleUserUpdated(updateData);

      expect(result).toEqual(updateData);
      expect(userService.update).toHaveBeenCalledWith(
        updateData.id,
        updateData,
      );
    });
  });

  describe('handleUserDeleted', () => {
    it('should handle user deleted message', async () => {
      const message = { value: 1 };

      mockUserService.remove.mockResolvedValue(undefined);

      const result = await controller.handleUserDeleted(message);

      expect(result).toBeUndefined();
      expect(userService.remove).toHaveBeenCalledWith(message.value);
    });
  });
});
