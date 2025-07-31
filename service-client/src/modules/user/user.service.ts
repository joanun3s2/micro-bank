import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['bankingDetails'],
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async create(createDto: Partial<User>): Promise<User> {
    const existing = await this.userRepository.findOneBy({
      name: createDto.name,
    });

    if (existing) {
      throw new ForbiddenException('User already exists');
    }

    const newEntity = this.userRepository.create(createDto);
    return await this.userRepository.save(newEntity);
  }

  async update(id: number, updateDto: Partial<User>): Promise<User | null> {
    const entity = await this.userRepository.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    Object.assign(entity, updateDto);

    return await this.userRepository.save(entity);
  }
}
