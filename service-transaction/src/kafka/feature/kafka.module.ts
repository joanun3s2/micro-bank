import { Module } from '@nestjs/common';
import { KafkaService } from '../service/kafka.service';
import { ConfigModule } from '../../config/feature/config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Kafka } from 'kafkajs';

@Module({
  imports: [
    ConfigModule,

    // ClientsModule.register([
    //   {
    //     name: 'KAFKA_SERVICE',
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: 'client-service',
    //         brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    //       },
    //       consumer: {
    //         groupId: 'client-consumer',
    //       },
    //     },
    //   },
    // ]),
    // Kafka,

    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'kafka',
            brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
          },
          consumer: {
            groupId: 'consumer-group',
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}

// {
//   transport: Transport.KAFKA,
//   options: {
//     client: {
//       brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
//     },
//     consumer: {
//       groupId: 'consumer-group',
//     },
//   },
// },
