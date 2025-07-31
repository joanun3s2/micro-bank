import { DataSource } from 'typeorm';

import { BankingDetails } from '../modules/bankingDetails/bankingDetails';
import { AccountType } from '../utils/enum/bankindDetails.enum';
import { User } from '../modules/user/user.entity';

export const seed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const bankingDetailsRepository = dataSource.getRepository(BankingDetails);

  const userSeed = [
    {
      firstName: 'Timber',
      lastName: 'Saw',
      age: 27,
    },
    {
      firstName: 'Joao',
      lastName: 'Paulo',
      age: 26,
    },
    {
      firstName: 'Bruno',
      lastName: 'Loomi',
      age: 19,
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
      accountType: AccountType.CORRENTE,
      agency: 12,
      accountNumber: 5678,
    },
    {
      userId: 2,
      accountType: AccountType.POUPANCA,
      agency: 12,
      accountNumber: 1234,
    },
    {
      userId: 3,
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
};
