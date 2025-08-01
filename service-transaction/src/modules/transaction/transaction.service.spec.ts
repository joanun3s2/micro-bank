import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { BankingDetailsService } from '../bankingDetails/bankingDetails.service';
import { UserService } from '../user/user.service';
import { createTransactionDto } from './createTransaction.dto';
import { AccountType } from '../../utils/enum/bankingDetails.enum';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockTransaction: Partial<Transaction> = {
    id: 1,
    senderUserId: 1,
    receiverUserId: 2,
    amount: 100.5,
    description: 'Test transaction',
  };

  const mockBankingDetails = {
    id: 1,
    accountNumber: 123456,
    agency: 1,
    accountType: AccountType.CORRENTE,
    user: { id: 1 },
  };

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockBankingDetailsService = {
    findOneBy: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: BankingDetailsService,
          useValue: mockBankingDetailsService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTransaction);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTransaction);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return undefined when transaction not found', async () => {
      mockRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findOne(999);

      expect(result).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const expectedTransactions = [
        mockTransaction,
        { ...mockTransaction, id: 2 },
      ];
      mockRepository.find.mockResolvedValue(expectedTransactions);

      const result = await service.findAll();

      expect(result).toEqual(expectedTransactions);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a transaction', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    const createDto: createTransactionDto = {
      amount: 100.5,
      description: 'Test transaction',
      senderAccountNumber: 123456,
      senderAgency: 1,
      senderAccountType: AccountType.CORRENTE,
      receiverAccountNumber: 654321,
      receiverAgency: 2,
      receiverAccountType: AccountType.POUPANCA,
    };

    it('should create a new transaction successfully', async () => {
      mockBankingDetailsService.findOneBy
        .mockResolvedValueOnce(mockBankingDetails)
        .mockResolvedValueOnce({
          ...mockBankingDetails,
          id: 2,
          user: { id: 2 },
        });

      mockUserService.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce({ ...mockUser, id: 2 });

      mockRepository.create.mockReturnValue(mockTransaction);
      mockRepository.save.mockResolvedValue(mockTransaction);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTransaction);
      expect(mockBankingDetailsService.findOneBy).toHaveBeenCalledTimes(2);
      expect(mockUserService.findOne).toHaveBeenCalledTimes(2);
      expect(mockRepository.create).toHaveBeenCalledWith({
        amount: createDto.amount,
        description: createDto.description,
        receiverUserId: 2,
        senderUserId: 1,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockTransaction);
    });

    it('should throw ForbiddenException when amount is less than or equal to 0', async () => {
      const invalidDto = { ...createDto, amount: 0 };

      await expect(service.create(invalidDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw ForbiddenException when sender banking details not found', async () => {
      mockBankingDetailsService.findOneBy.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockBankingDetailsService.findOneBy).toHaveBeenCalledWith({
        where: {
          accountNumber: createDto.senderAccountNumber,
          agency: createDto.senderAgency,
          accountType: createDto.senderAccountType,
        },
      });
    });

    it('should throw ForbiddenException when receiver banking details not found', async () => {
      mockBankingDetailsService.findOneBy
        .mockResolvedValueOnce(mockBankingDetails)
        .mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when sender user not found', async () => {
      mockBankingDetailsService.findOneBy
        .mockResolvedValueOnce(mockBankingDetails)
        .mockResolvedValueOnce({
          ...mockBankingDetails,
          id: 2,
          user: { id: 2 },
        });

      mockUserService.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when receiver user not found', async () => {
      mockBankingDetailsService.findOneBy
        .mockResolvedValueOnce(mockBankingDetails)
        .mockResolvedValueOnce({
          ...mockBankingDetails,
          id: 2,
          user: { id: 2 },
        });

      mockUserService.findOne
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllByUserId', () => {
    it('should return transactions for a user (as sender or receiver)', async () => {
      const expectedTransactions = [
        { ...mockTransaction, senderUserId: 1 },
        { ...mockTransaction, id: 2, receiverUserId: 1 },
      ];
      mockRepository.find.mockResolvedValue(expectedTransactions);

      const result = await service.findAllByUserId(1);

      expect(result).toEqual(expectedTransactions);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: [{ senderUserId: 1 }, { receiverUserId: 1 }],
      });
    });
  });

  describe('update', () => {
    it('should update an existing transaction', async () => {
      const updateDto = { description: 'Updated description' };
      const updatedTransaction = { ...mockTransaction, ...updateDto };

      mockRepository.findOneBy.mockResolvedValue(mockTransaction);
      mockRepository.save.mockResolvedValue(updatedTransaction);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedTransaction);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedTransaction);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      const updateDto = { description: 'Updated description' };
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
