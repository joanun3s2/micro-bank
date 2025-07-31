import { DataSource } from 'typeorm';

import { ConfigService } from './config/service/config.service';

import { BankingDetails } from './modules/bankingDetails/bankingDetails';
import { User } from './modules/user/user.entity';

export const getAppDataSource = (configService: ConfigService) => {
  return new DataSource({
    type: 'postgres',
    host: configService.get('CLIENT_DATABASE_HOST'),
    port: configService.get('CLIENT_DATABASE_PORT') as unknown as number,
    username: configService.get('CLIENT_DATABASE_USER'),
    password: configService.get('CLIENT_DATABASE_PASSWORD'),
    database: configService.get('CLIENT_DATABASE_NAME'),
    synchronize: true,
    logging: false,
    entities: [User, BankingDetails],
    subscribers: [],
  });
};
