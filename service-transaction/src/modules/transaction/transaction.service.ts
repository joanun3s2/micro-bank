import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { createTransactionDto } from './createTransaction.dto';
import { BankingDetailsService } from '../bankingDetails/bankingDetails.service';
import { UserService } from '../user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly bankingDetailsService: BankingDetailsService,
    private readonly userService: UserService,
  ) {}

  async findOne(id: number): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOne({
      where: { id },
    });
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.transactionRepository.delete(id);
  }

  async create(createDto: createTransactionDto): Promise<Transaction> {
    if (createDto.amount <= 0) {
      throw new ForbiddenException('Amount must be greater than 0');
    }

    const senderBankingDetail = await this.bankingDetailsService.findOneBy({
      where: {
        accountNumber: createDto.senderAccountNumber,
        agency: createDto.senderAgency,
        accountType: createDto.senderAccountType,
      },
    });

    const receiverBankingDetail = await this.bankingDetailsService.findOneBy({
      where: {
        accountNumber: createDto.receiverAccountNumber,
        agency: createDto.receiverAgency,
        accountType: createDto.receiverAccountType,
      },
    });

    if (!senderBankingDetail || !receiverBankingDetail) {
      throw new ForbiddenException('BankingDetails not found');
    }

    const senderUser = await this.userService.findOne(
      senderBankingDetail.user?.id,
    );
    const receiverUser = await this.userService.findOne(
      receiverBankingDetail.user?.id,
    );

    if (!senderUser || !receiverUser) {
      throw new NotFoundException(
        'Users not found! This must be an internal problem.',
      );
    }

    const transaction: Partial<Transaction> = {
      amount: createDto.amount,
      description: createDto.description,
      receiverUserId: receiverUser.id,
      senderUserId: senderUser.id,
    };

    const newEntity = this.transactionRepository.create(transaction);
    return await this.transactionRepository.save(newEntity);
  }

  async update(
    id: number,
    updateDto: Partial<Transaction>,
  ): Promise<Transaction | null> {
    const entity = await this.transactionRepository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('Transaction not found');
    }

    Object.assign(entity, updateDto);

    return await this.transactionRepository.save(entity);
  }
}
