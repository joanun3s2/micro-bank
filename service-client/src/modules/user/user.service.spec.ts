import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUser: Partial<User> = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main St',
    age: 30,
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a user with banking details', async () => {
      const expectedUser = { ...mockUser, bankingDetails: [] };
      mockRepository.findOne.mockResolvedValue(expectedUser);

      const result = await service.findOne(1);

      expect(result).toEqual(expectedUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['bankingDetails'],
      });
    });

    it('should return undefined when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOne(999);

      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const expectedUsers = [mockUser, { ...mockUser, id: 2 }];
      mockRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.findAll();

      expect(result).toEqual(expectedUsers);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '456 Oak St',
        age: 25,
      };

      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockResolvedValue({ id: 2, ...createDto });

      const result = await service.create(createDto);

      expect(result).toEqual({ id: 2, ...createDto });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        name: createDto.name,
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });

    it('should throw ForbiddenException when user already exists', async () => {
      const createDto = { name: 'John Doe' };
      mockRepository.findOneBy.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        name: createDto.name,
      });
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const updateDto = { name: 'John Updated' };
      const updatedUser = { ...mockUser, ...updateDto };

      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const updateDto = { name: 'John Updated' };
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('updateProfilePicture', () => {
    it('should update user profile picture', async () => {
      const file = {
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;
      const updatedUser = { ...mockUser, profilePicture: file.buffer };

      mockRepository.findOneBy.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfilePicture(1, file);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const file = {
        buffer: Buffer.from('fake-image-data'),
      } as Express.Multer.File;
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateProfilePicture(999, file)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
