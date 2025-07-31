import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { AccountType } from '../../utils/enum/bankindDetails.enum';

@Entity()
export class BankingDetails extends BaseEntity {
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
