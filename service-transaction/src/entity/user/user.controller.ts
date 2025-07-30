import { Controller, Post } from '@nestjs/common';
import { KafkaService } from '../../kafka/service/kafka.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor() {}

  @EventPattern('user_created')
  handleUserCreated(message: any) {
    console.log(message);
  }
}
