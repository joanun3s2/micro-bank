import { Module } from '@nestjs/common';
import { KafkaService } from '../service/kafka.service';
import { ConfigModule } from '../../config/feature/config.module';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
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
  providers: [KafkaService, ClientKafka],
  exports: [KafkaService],
})
export class KafkaModule {}
