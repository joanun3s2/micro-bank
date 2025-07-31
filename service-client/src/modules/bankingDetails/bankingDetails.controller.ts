import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { KafkaService } from '../../kafka/service/kafka.service';
import { BankingDetailsService } from './bankingDetails.service';
import { BankingDetails } from './bankingDetails';

@Controller('banking-details')
export class BankingDetailsController {
  constructor(
    private readonly bankingDetailsService: BankingDetailsService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.bankingDetailsService.findOne(id);
  }

  @Get('/user/:id')
  getAll(@Param('id') id: number) {
    return this.bankingDetailsService.findAllByUserId(id);
  }

  @Post()
  async create(@Body() createDto: Partial<BankingDetails>) {
    const result = await this.bankingDetailsService.create(createDto);

    this.kafkaService.sendMessage('banking_details_created', result);

    return result;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() createDto: Partial<BankingDetails>,
  ) {
    const result = await this.bankingDetailsService.update(id, createDto);

    this.kafkaService.sendMessage('banking_details_updated', result);

    return result;
  }

  //TODO: work on this
  @Patch(':id/profile-picture')
  remove(@Param('id') id: number) {
    // return this.bankingDetailsService.update(id);
  }
}
