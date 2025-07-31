import { AccountType } from '../../utils/enum/bankingDetails.enum';

export type createTransactionDto = {
  senderAccountNumber: number;
  senderAccountType: AccountType;
  senderAgency: number;

  receiverAccountNumber: number;
  receiverAccountType: AccountType;
  receiverAgency: number;

  amount: number;
  description?: string;
};
