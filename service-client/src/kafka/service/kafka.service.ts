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
    this.kafkaClient.emit(topic, message);
  }

  // private kafka = new Kafka({
  //   brokers: [this.configService.get('KAFKA_BROKER') || 'kafka:9092'],
  // });
  // private producer = this.kafka.producer();

  // async onModuleInit() {
  //   await this.producer.connect();
  // }

  // async sendMessage(topic: string, message: any) {
  //   await this.producer.send({
  //     topic,
  //     messages: [{ value: JSON.stringify(message) }],
  //   });
  // }

  //------------------------------------------------------------

  // constructor(
  //   private readonly kafkaClient: ClientKafka,
  //   private readonly configService: ConfigService,
  // ) {}

  // async sendMessage(topic: string, message: any) {
  //   console.log(`Sending message to Kafka topic: ${topic}`);
  //   this.kafkaClient.emit(topic, message);
  // }
}
