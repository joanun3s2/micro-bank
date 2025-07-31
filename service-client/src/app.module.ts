import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/feature/config.module';
import { KafkaModule } from './kafka/feature/kafka.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { BankingDetails } from './modules/bankingDetails/bankingDetails';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.CLIENT_DATABASE_HOST,
      port: process.env.CLIENT_DATABASE_PORT as unknown as number,
      username: process.env.CLIENT_DATABASE_USER,
      password: process.env.CLIENT_DATABASE_PASSWORD,
      database: process.env.CLIENT_DATABASE_NAME,
      synchronize: true,
      logging: false,
      entities: [User, BankingDetails],
      subscribers: [],
    }),
    ConfigModule,
    KafkaModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
