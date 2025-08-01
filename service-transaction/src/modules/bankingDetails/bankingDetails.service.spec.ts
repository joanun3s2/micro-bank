import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BankingDetailsService } from './bankingDetails.service';
import { BankingDetails } from './bankingDetails.entity';
import { AccountType } from '../../utils/enum/bankingDetails.enum';

describe('BankingDetailsService', () => {
  let service: BankingDetailsService;

  const mockBankingDetails: Partial<BankingDetails> = {
    id: 1,
    accountNumber: 123456,
    agency: 1,
    accountType: AccountType.CORRENTE,
    user: { id: 1 } as any,
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
        BankingDetailsService,
        {
          provide: getRepositoryToken(BankingDetails),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BankingDetailsService>(BankingDetailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a banking details by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockBankingDetails);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBankingDetails);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return undefined when banking details not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOne(999);

      expect(result).toBeUndefined();
    });
  });

  describe('findOneBy', () => {
    it('should return banking details by options', async () => {
      const options = { where: { accountNumber: 123456 } };
      mockRepository.findOne.mockResolvedValue(mockBankingDetails);

      const result = await service.findOneBy(options);

      expect(result).toEqual(mockBankingDetails);
      expect(mockRepository.findOne).toHaveBeenCalledWith(options);
    });
  });

  describe('findAll', () => {
    it('should return all banking details', async () => {
      const expectedBankingDetails = [
        mockBankingDetails,
        { ...mockBankingDetails, id: 2 },
      ];
      mockRepository.find.mockResolvedValue(expectedBankingDetails);

      const result = await service.findAll();

      expect(result).toEqual(expectedBankingDetails);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete banking details', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create new banking details successfully', async () => {
      const createDto = {
        accountNumber: 654321,
        agency: 2,
        accountType: AccountType.POUPANCA,
        user: { id: 2 } as any,
      };

      mockRepository.findOneBy.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(createDto);
      mockRepository.save.mockResolvedValue({ id: 2, ...createDto });

      const result = await service.create(createDto);

      expect(result).toEqual({ id: 2, ...createDto });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        accountNumber: createDto.accountNumber,
        agency: createDto.agency,
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createDto);
    });

    it('should throw ForbiddenException when banking details already exists', async () => {
      const createDto = {
        accountNumber: 123456,
        agency: 1,
      };
      mockRepository.findOneBy.mockResolvedValue(mockBankingDetails);

      await expect(service.create(createDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        accountNumber: createDto.accountNumber,
        agency: createDto.agency,
      });
    });
  });

  describe('update', () => {
    it('should update existing banking details', async () => {
      const updateDto = { accountNumber: 999999 };
      const updatedBankingDetails = { ...mockBankingDetails, ...updateDto };

      mockRepository.findOneBy.mockResolvedValue(mockBankingDetails);
      mockRepository.save.mockResolvedValue(updatedBankingDetails);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedBankingDetails);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedBankingDetails);
    });

    it('should throw NotFoundException when banking details not found', async () => {
      const updateDto = { accountNumber: 999999 };
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
