import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/feature/config.module';
import { KafkaModule } from './kafka/feature/kafka.module';
import { UserModule } from './entity/feature/user.module';

@Module({
  imports: [ConfigModule, KafkaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
