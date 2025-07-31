import { DataSource } from 'typeorm';

import { User } from '../modules/user/user.entity';
import { BankingDetails } from '../modules/bankingDetails/bankingDetails.entity';
import { Transaction } from '../modules/transaction/transaction.entity';
import { AccountType } from '../utils/enum/bankingDetails.enum';

export const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const bankingDetailsRepository = dataSource.getRepository(BankingDetails);
  const transactionRepository = dataSource.getRepository(Transaction);

  const userSeed = [
    {
      sourceId: 1,
      firstName: 'Timber',
    },
    {
      sourceId: 2,
      firstName: 'Joao',
    },
    {
      sourceId: 3,
      firstName: 'Bruno',
    },
  ];

  for (const userItem of userSeed) {
    const existing = await userRepository.findOneBy({
      firstName: userItem.firstName,
    });

    if (existing) {
      continue;
    }

    const user = userRepository.create(userItem);
    await userRepository.save(user);
  }

  console.log('Seeded users.');

  const bankingDetailsSeed = [
    {
      userId: 1,
      sourceId: 1,
      accountType: AccountType.CORRENTE,
      agency: 12,
      accountNumber: 5678,
    },
    {
      userId: 2,
      sourceId: 2,
      accountType: AccountType.POUPANCA,
      agency: 12,
      accountNumber: 1234,
    },
    {
      userId: 3,
      sourceId: 3,
      accountType: AccountType.CORRENTE,
      agency: 34,
      accountNumber: 9012,
    },
  ];

  for (const bankingDetailsItem of bankingDetailsSeed) {
    const existing = await bankingDetailsRepository.findOneBy({
      userId: bankingDetailsItem.userId,
    });

    if (existing) {
      continue;
    }

    const bankingDetails = bankingDetailsRepository.create(bankingDetailsItem);
    await bankingDetailsRepository.save(bankingDetails);
  }

  console.log('Seeded banking details.');

  const transactionsSeed = [
    {
      senderUserId: 1,
      receiverUserId: 2,
      amount: 1200,
      description: 'test',
    },
    {
      senderUserId: 1,
      receiverUserId: 3,
      amount: 450,
      description: '',
    },
  ];

  for (const transactionsItem of transactionsSeed) {
    const existing = await transactionRepository.findOneBy({
      senderUserId: transactionsItem.senderUserId,
    });

    if (existing) {
      continue;
    }

    const transactions = transactionRepository.create(transactionsItem);
    await transactionRepository.save(transactions);
  }

  console.log('Seeded transactions.');
};
