import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
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

  async create(createDto: Partial<Transaction>): Promise<Transaction> {
    //   TODO: Add validation to not allow duplicate in less than 5 minutes

    //   const existing = await this.transactionRepository.findOneBy({
    //     name: createDto.name,
    //   });

    //   if (existing) {
    //     throw new ForbiddenException('Transaction already exists');
    //   }

    const newEntity = this.transactionRepository.create(createDto);
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
