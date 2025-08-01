import { Test, TestingModule } from '@nestjs/testing';
import { BankingDetailsController } from './bankingDetails.controller';
import { BankingDetailsService } from './bankingDetails.service';
import { KafkaService } from '../../kafka/service/kafka.service';
import { BankingDetails } from './bankingDetails';
import { AccountType } from '../../utils/enum/bankindDetails.enum';

describe('BankingDetailsController', () => {
  let controller: BankingDetailsController;
  let bankingDetailsService: BankingDetailsService;
  let kafkaService: KafkaService;

  const mockBankingDetails: Partial<BankingDetails> = {
    id: 1,
    accountNumber: 123456,
    agency: 1,
    accountType: AccountType.CORRENTE,
    user: { id: 1 } as any,
  };

  const mockBankingDetailsService = {
    findOne: jest.fn(),
    findAllByUserId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockKafkaService = {
    sendMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankingDetailsController],
      providers: [
        {
          provide: BankingDetailsService,
          useValue: mockBankingDetailsService,
        },
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    controller = module.get<BankingDetailsController>(BankingDetailsController);
    bankingDetailsService = module.get<BankingDetailsService>(
      BankingDetailsService,
    );
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return banking details by id', async () => {
      mockBankingDetailsService.findOne.mockResolvedValue(mockBankingDetails);

      const result = await controller.getById(1);

      expect(result).toEqual(mockBankingDetails);
      expect(bankingDetailsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('getAll', () => {
    it('should return banking details for a user', async () => {
      const expectedBankingDetails = [
        mockBankingDetails,
        { ...mockBankingDetails, id: 2 },
      ];
      mockBankingDetailsService.findAllByUserId.mockResolvedValue(
        expectedBankingDetails,
      );

      const result = await controller.getAll(1);

      expect(result).toEqual(expectedBankingDetails);
      expect(bankingDetailsService.findAllByUserId).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create banking details and send kafka message', async () => {
      const createDto = {
        accountNumber: 654321,
        agency: 2,
        accountType: AccountType.POUPANCA,
        user: { id: 2 } as any,
      };

      mockBankingDetailsService.create.mockResolvedValue({
        id: 2,
        ...createDto,
      });

      const result = await controller.create(createDto);

      expect(result).toEqual({ id: 2, ...createDto });
      expect(bankingDetailsService.create).toHaveBeenCalledWith(createDto);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'banking_details_created',
        { id: 2, ...createDto },
      );
    });
  });

  describe('update', () => {
    it('should update banking details and send kafka message', async () => {
      const updateDto = { accountNumber: 999999 };
      const updatedBankingDetails = { ...mockBankingDetails, ...updateDto };

      mockBankingDetailsService.update.mockResolvedValue(updatedBankingDetails);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedBankingDetails);
      expect(bankingDetailsService.update).toHaveBeenCalledWith(1, updateDto);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'banking_details_updated',
        updatedBankingDetails,
      );
    });
  });
});
