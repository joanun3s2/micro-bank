import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BankingDetailsService } from './bankingDetails.service';
import { BankingDetails } from './bankingDetails.entity';

@Controller('banking-details')
export class BankingDetailsController {
  constructor(private readonly bankingDetailsService: BankingDetailsService) {}

  @MessagePattern('banking_details_created')
  async handleBankingDetailsCreated(user: any) {
    return await this.bankingDetailsService.create({
      ...user,
      sourceId: user.id,
    });
  }

  @MessagePattern('banking_details_updated')
  async handleBankingDetailsUpdated(@Payload() user: Partial<BankingDetails>) {
    return await this.bankingDetailsService.update(user.id, user);
  }

  @MessagePattern('banking_details_deleted')
  async handleBankingDetailsDeleted(message: any) {
    return await this.bankingDetailsService.remove(message.value as number);
  }
}
