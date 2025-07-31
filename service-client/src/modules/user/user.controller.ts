import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { KafkaService } from '../../kafka/service/kafka.service';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() createDto: Partial<User>) {
    const result = await this.userService.create(createDto);

    this.kafkaService.sendMessage('user_created', result);

    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() createDto: Partial<User>) {
    const result = await this.userService.update(id, createDto);

    this.kafkaService.sendMessage('user_updated', result);

    return result;
  }

  //TODO: work on this
  @Patch(':id/profile-picture')
  remove(@Param('id') id: number) {
    // return this.userService.update(id);
  }

  // For testing purposes
  @Post('test')
  async sendTestMessage() {
    await this.kafkaService.sendMessage('user_created', {
      id: Date.now(),
      name: 'João',
    });

    console.log('Message sent');

    return { status: 'sent' };
  }
}
