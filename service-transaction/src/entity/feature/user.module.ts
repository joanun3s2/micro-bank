import { Module } from '@nestjs/common';
import { KafkaModule } from '../../kafka/feature/kafka.module';
import { UserController } from '../user/user.controller';

@Module({
  imports: [KafkaModule],
  providers: [],
  exports: [],
  controllers: [UserController],
})
export class UserModule {}
