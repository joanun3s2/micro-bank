import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ConfigService } from '../../config/service/config.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class KafkaService {
  constructor(
    private readonly configService: ConfigService,
    // private readonly kafka: Kafka,
  ) {}

  // @MessagePattern('user_created')
  // handleUserCreated(@Payload() message: any): string {
  //   console.log('Received message from Kafka:', message);
  //   return `Processed user_created message: ${JSON.stringify(message)}`;
  // }
}
