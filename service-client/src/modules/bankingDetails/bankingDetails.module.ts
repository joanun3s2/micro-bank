import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingDetailsService } from './bankingDetails.service';
import { BankingDetails } from './bankingDetails';
import { BankingDetailsController } from './bankingDetails.controller';
import { KafkaModule } from '../../kafka/feature/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([BankingDetails]), KafkaModule],
  providers: [BankingDetailsService],
  controllers: [BankingDetailsController],
  exports: [BankingDetailsService],
})
export class BankingDetailsModule {}
