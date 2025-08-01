import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { createTransactionDto } from './createTransaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.transactionService.findOne(id);
  }

  @Get()
  getAll() {
    return this.transactionService.findAll();
  }

  @Post()
  create(@Body() createDto: createTransactionDto) {
    return this.transactionService.create(createDto);
  }

  @Get('user/:id')
  getByUserId(@Param('id') id: number) {
    return this.transactionService.findAllByUserId(id);
  }
}
