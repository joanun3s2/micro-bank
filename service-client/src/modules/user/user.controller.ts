import { Controller, Post } from '@nestjs/common';
import { KafkaService } from '../../kafka/service/kafka.service';

@Controller('user')
export class UserController {
  constructor(private readonly kafkaService: KafkaService) {}

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
