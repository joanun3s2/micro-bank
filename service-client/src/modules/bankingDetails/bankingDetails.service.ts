import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { BankingDetails } from './bankingDetails';

@Injectable()
export class BankingDetailsService {
  constructor(
    @InjectRepository(BankingDetails)
    private readonly bankingDetailsRepository: Repository<BankingDetails>,
  ) {}

  async findOne(id: number): Promise<BankingDetails | undefined> {
    return await this.bankingDetailsRepository.findOne({
      where: { id },
    });
  }

  async findOneBy(
    options: FindOneOptions<BankingDetails>,
  ): Promise<BankingDetails | undefined> {
    return await this.bankingDetailsRepository.findOne(options);
  }

  findAll(): Promise<BankingDetails[]> {
    return this.bankingDetailsRepository.find();
  }

  async findAllByUserId(id: number): Promise<BankingDetails[] | undefined> {
    return await this.bankingDetailsRepository.find({
      where: { user: { id } },
    });
  }

  async remove(id: number): Promise<void> {
    await this.bankingDetailsRepository.delete(id);
  }

  async create(createDto: Partial<BankingDetails>): Promise<BankingDetails> {
    const existing = await this.bankingDetailsRepository.findOneBy({
      accountNumber: createDto.accountNumber,
      agency: createDto.agency,
    });

    if (existing) {
      throw new ForbiddenException('BankingDetails already exists');
    }

    const newEntity = this.bankingDetailsRepository.create(createDto);
    return await this.bankingDetailsRepository.save(newEntity);
  }

  async update(
    id: number,
    updateDto: Partial<BankingDetails>,
  ): Promise<BankingDetails | null> {
    const entity = await this.bankingDetailsRepository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('BankingDetails not found');
    }

    Object.assign(entity, updateDto);

    return await this.bankingDetailsRepository.save(entity);
  }
}
