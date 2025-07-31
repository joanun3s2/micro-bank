import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ConfigService } from './config/service/config.service';
import { getAppDataSource } from './data-source';
import { Transport } from '@nestjs/microservices';
import { seed } from './migrations/seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const appDataSource = getAppDataSource(configService);

  appDataSource
    .initialize()
    .then(async () => {
      seed(appDataSource);
    })
    .catch((error) => console.log(error));

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER') || 'kafka:9092'],
        consumer: {
          groupId: 'consumer-group',
        },
      },
    },
  });

  await app.listen(configService.get('TRANSACTION_PORT') ?? 3000);
  await app.startAllMicroservices();
}
bootstrap();
