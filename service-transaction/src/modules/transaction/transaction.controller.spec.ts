import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { createTransactionDto } from './createTransaction.dto';
import { AccountType } from '../../utils/enum/bankingDetails.enum';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;

  const mockTransaction: Partial<Transaction> = {
    id: 1,
    senderUserId: 1,
    receiverUserId: 2,
    amount: 100.5,
    description: 'Test transaction',
  };

  const mockTransactionService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    findAllByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return a transaction by id', async () => {
      mockTransactionService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.getById(1);

      expect(result).toEqual(mockTransaction);
      expect(transactionService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getAll', () => {
    it('should return all transactions', async () => {
      const expectedTransactions = [
        mockTransaction,
        { ...mockTransaction, id: 2 },
      ];
      mockTransactionService.findAll.mockResolvedValue(expectedTransactions);

      const result = await controller.getAll();

      expect(result).toEqual(expectedTransactions);
      expect(transactionService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
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

      mockTransactionService.create.mockResolvedValue(mockTransaction);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockTransaction);
      expect(transactionService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getByUserId', () => {
    it('should return transactions for a user', async () => {
      const expectedTransactions = [
        { ...mockTransaction, senderUserId: 1 },
        { ...mockTransaction, id: 2, receiverUserId: 1 },
      ];
      mockTransactionService.findAllByUserId.mockResolvedValue(
        expectedTransactions,
      );

      const result = await controller.getByUserId(1);

      expect(result).toEqual(expectedTransactions);
      expect(transactionService.findAllByUserId).toHaveBeenCalledWith(1);
    });
  });
});
