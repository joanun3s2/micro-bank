import { DataSource } from 'typeorm';

import { BankingDetails } from '../modules/bankingDetails/bankingDetails';
import { AccountType } from '../utils/enum/bankindDetails.enum';
import { User } from '../modules/user/user.entity';

export const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const bankingDetailsRepository = dataSource.getRepository(BankingDetails);

  const userSeed = [
    {
      name: 'Timber Saw',
      email: 'timber@me.com',
      address: 'Rua A, 123',
      age: 27,
    },
    {
      name: 'Joao Paulo',
      email: 'joao@me.com.br',
      address: 'Rua B, 456',
      age: 26,
    },
    {
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
    const userCreated = await userRepository.save(user);

    createdUsers.push(userCreated);
  }

  console.log('Seeded users.');

  const bankingDetailsSeed = [
    {
      user: createdUsers[0],
      accountType: AccountType.CORRENTE,
      agency: 12,
      accountNumber: 5678,
    },
    {
      user: createdUsers[1],
      accountType: AccountType.POUPANCA,
      agency: 12,
      accountNumber: 1234,
    },
    {
      user: createdUsers[2],
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
};
