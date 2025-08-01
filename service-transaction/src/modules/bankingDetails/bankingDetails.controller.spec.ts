import { Test, TestingModule } from '@nestjs/testing';
import { BankingDetailsController } from './bankingDetails.controller';
import { BankingDetailsService } from './bankingDetails.service';
import { AccountType } from '../../utils/enum/bankingDetails.enum';

describe('BankingDetailsController', () => {
  let controller: BankingDetailsController;
  let bankingDetailsService: BankingDetailsService;

  const mockBankingDetailsService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankingDetailsController],
      providers: [
        {
          provide: BankingDetailsService,
          useValue: mockBankingDetailsService,
        },
      ],
    }).compile();

    controller = module.get<BankingDetailsController>(BankingDetailsController);
    bankingDetailsService = module.get<BankingDetailsService>(
      BankingDetailsService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleBankingDetailsCreated', () => {
    it('should handle banking details created message', async () => {
      const userData = {
        id: 1,
        accountNumber: 123456,
        agency: 1,
        accountType: AccountType.CORRENTE,
      };

      mockBankingDetailsService.create.mockResolvedValue({
        id: 1,
        ...userData,
        sourceId: userData.id,
      });

      const result = await controller.handleBankingDetailsCreated(userData);

      expect(result).toEqual({ id: 1, ...userData, sourceId: userData.id });
      expect(bankingDetailsService.create).toHaveBeenCalledWith({
        ...userData,
        sourceId: userData.id,
      });
    });
  });

  describe('handleBankingDetailsUpdated', () => {
    it('should handle banking details updated message', async () => {
      const updateData = {
        id: 1,
        accountNumber: 999999,
        agency: 1,
        accountType: AccountType.POUPANCA,
      };

      mockBankingDetailsService.update.mockResolvedValue(updateData);

      const result = await controller.handleBankingDetailsUpdated(updateData);

      expect(result).toEqual(updateData);
      expect(bankingDetailsService.update).toHaveBeenCalledWith(
        updateData.id,
        updateData,
      );
    });
  });

  describe('handleBankingDetailsDeleted', () => {
    it('should handle banking details deleted message', async () => {
      const message = { value: 1 };

      mockBankingDetailsService.remove.mockResolvedValue(undefined);

      const result = await controller.handleBankingDetailsDeleted(message);

      expect(result).toBeUndefined();
      expect(bankingDetailsService.remove).toHaveBeenCalledWith(message.value);
    });
  });
});
