import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { KafkaService } from '../../kafka/service/kafka.service';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let kafkaService: KafkaService;

  const mockUser: Partial<User> = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St',
    age: 30,
  };

  const mockUserService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateProfilePicture: jest.fn(),
  };

  const mockKafkaService = {
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.getById(1);

      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const expectedUsers = [mockUser, { ...mockUser, id: 2 }];
      mockUserService.findAll.mockResolvedValue(expectedUsers);

      const result = await controller.getAll();

      expect(result).toEqual(expectedUsers);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user and send kafka message', async () => {
      const createDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '456 Oak St',
        age: 25,
      };

      mockUserService.create.mockResolvedValue({ id: 2, ...createDto });

      const result = await controller.create(createDto);

      expect(result).toEqual({ id: 2, ...createDto });
      expect(userService.create).toHaveBeenCalledWith(createDto);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith('user_created', {
        id: 2,
        ...createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a user and send kafka message', async () => {
      const updateDto = { name: 'John Updated' };
      const updatedUser = { ...mockUser, ...updateDto };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedUser);
      expect(userService.update).toHaveBeenCalledWith(1, updateDto);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'user_updated',
        updatedUser,
      );
    });
  });

  describe('remove (profile picture)', () => {
    it('should update user profile picture', async () => {
      const file = {
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;
      const updatedUser = { ...mockUser, profilePicture: file.buffer };

      mockUserService.updateProfilePicture.mockResolvedValue(updatedUser);

      const result = await controller.remove(1, file);

      expect(result).toEqual(updatedUser);
      expect(userService.updateProfilePicture).toHaveBeenCalledWith(1, file);
    });
  });
});
