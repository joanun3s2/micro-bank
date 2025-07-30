import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { ConfigService } from './config/service/config.service';

export const getAppDataSource = (configService: ConfigService) => {
  return new DataSource({
    type: 'postgres',
    host: configService.get('TRANSACTION_DATABASE_HOST'),
    port: configService.get('TRANSACTION_DATABASE_PORT') as unknown as number,
    username: configService.get('TRANSACTION_DATABASE_USER'),
    password: configService.get('TRANSACTION_DATABASE_PASSWORD'),
    database: configService.get('TRANSACTION_DATABASE_NAME'),
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });
};
