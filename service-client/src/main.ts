import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka } from 'kafkajs';
import 'reflect-metadata';
import { ConfigService } from './config/service/config.service';

import { getAppDataSource } from './data-source';
import { seed } from './migrations/seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const appDataSource = getAppDataSource(configService);

  appDataSource
    .initialize()
    .then(async () => {
      await seed(appDataSource);
    })
    .catch((error) => console.log(error));

  await app.listen(configService.get('CLIENT_PORT') ?? 3000);
}
bootstrap();
