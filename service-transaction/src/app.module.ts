import { Module } from '@nestjs/common';
import { ConfigModule } from './config/feature/config.module';
import { KafkaModule } from './kafka/feature/kafka.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { BankingDetails } from './modules/bankingDetails/bankingDetails.entity';
import { Transaction } from './modules/transaction/transaction.entity';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BankingDetailsModule } from './modules/bankingDetails/bankingDetails.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TRANSACTION_DATABASE_HOST,
      port: process.env.TRANSACTION_DATABASE_PORT as unknown as number,
      username: process.env.TRANSACTION_DATABASE_USER,
      password: process.env.TRANSACTION_DATABASE_PASSWORD,
      database: process.env.TRANSACTION_DATABASE_NAME,
      synchronize: true,
      logging: false,
      entities: [User, BankingDetails, Transaction],
      subscribers: [],
    }),
    ConfigModule,
    KafkaModule,
    UserModule,
    TransactionModule,
    BankingDetailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
