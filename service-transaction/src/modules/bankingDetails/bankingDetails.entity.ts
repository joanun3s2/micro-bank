import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { AccountType } from '../../utils/enum/bankingDetails.enum';
import { User } from '../user/user.entity';

@Entity()
export class BankingDetails extends BaseEntity {
  @ManyToOne(() => User, (user) => user.bankingDetails)
  @JoinColumn({ name: 'userId' })
  user: User;

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
