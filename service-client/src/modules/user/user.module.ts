import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { KafkaModule } from '../../kafka/feature/kafka.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), KafkaModule],
})
export class UserModule {}
