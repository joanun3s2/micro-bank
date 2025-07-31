import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { ConfigService } from '../../config/service/config.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  sendMessage(topic: string, message: any) {
    console.log(`Sending message to Kafka topic: ${topic}`);
    this.kafkaClient.emit(topic, JSON.stringify(message));
  }
}
