import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Kafka } from 'kafkajs';
import 'reflect-metadata';
import { ConfigService } from './config/service/config.service';
import { getAppDataSource } from './data-source';
import { User } from './entity/User';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.KAFKA,
  //     options: {
  //       client: {
  //         brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  //       },
  //       consumer: {
  //         groupId: 'consumer-group',
  //       },
  //     },
  //   },
  // );

  const configService = app.get(ConfigService);

  const appDataSource = getAppDataSource(configService);

  appDataSource
    .initialize()
    .then(async () => {
      console.log('Inserting a new user into the database...');
      const user = new User();
      user.firstName = 'Timber';
      user.lastName = 'Saw';
      user.age = 25;
      await appDataSource.manager.save(user);
      console.log('Saved a new user with id: ' + user.id);

      console.log('Loading users from the database...');
      const users = await appDataSource.manager.find(User);
      console.log('Loaded users: ', users);

      console.log(
        'Here you can setup and run express / fastify / any other framework.',
      );
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

  // await app.listen();
}
bootstrap();
