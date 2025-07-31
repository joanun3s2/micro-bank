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
      name: 'Timber Saw',
      email: 'timber@me.com',
      address: 'Rua A, 123',
      age: 27,
    },
    {
      sourceId: 2,
      name: 'Joao Paulo',
      email: 'joao@me.com.br',
      address: 'Rua B, 456',
      age: 26,
    },
    {
      sourceId: 3,
      name: 'Bruno Loomi',
      email: 'bruno@me.com',
      address: 'Rua C, 789',
      age: 19,
    },
  ];

  const createdUsers: User[] = [];

  for await (const userItem of userSeed) {
    const existing = await userRepository.findOneBy({
      name: userItem.name,
    });

    if (existing) {
      continue;
    }

    const user = userRepository.create(userItem);
    await userRepository.save(user);
    const userCreated = await userRepository.save(user);

    createdUsers.push(userCreated);
  }

  console.log('Seeded users.');

  const bankingDetailsSeed = [
    {
      user: createdUsers[0],
      sourceId: 1,
      accountType: AccountType.CORRENTE,
      agency: 12,
      accountNumber: 5678,
    },
    {
      user: createdUsers[1],
      sourceId: 2,
      accountType: AccountType.POUPANCA,
      agency: 12,
      accountNumber: 1234,
    },
    {
      user: createdUsers[2],
      sourceId: 3,
      accountType: AccountType.CORRENTE,
      agency: 34,
      accountNumber: 9012,
    },
  ];

  for (const bankingDetailsItem of bankingDetailsSeed) {
    const existing = await bankingDetailsRepository.findOneBy({
      accountNumber: bankingDetailsItem.accountNumber,
      agency: bankingDetailsItem.agency,
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
      receiverUserId: transactionsItem.receiverUserId,
    });

    if (existing) {
      continue;
    }

    const transactions = transactionRepository.create(transactionsItem);
    await transactionRepository.save(transactions);
  }

  console.log('Seeded transactions.');
};
