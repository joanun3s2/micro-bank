import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { AccountType } from '../../utils/enum/bankingDetails.enum';

@Entity()
export class BankingDetails extends BaseEntity {
  @Column()
  sourceId: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @Column()
  agency: number;

  @Column()
  accountNumber: number;
}
