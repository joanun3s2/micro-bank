import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankingDetails } from './bankingDetails.entity';
import { BankingDetailsService } from './bankingDetails.service';
import { BankingDetailsController } from './bankingDetails.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankingDetails])],
  providers: [BankingDetailsService],
  controllers: [BankingDetailsController],
  exports: [BankingDetailsService],
})
export class BankingDetailsModule {}
