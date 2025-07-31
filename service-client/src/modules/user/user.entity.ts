import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { OneToOne, JoinColumn } from 'typeorm';
import { BankingDetails } from '../bankingDetails/bankingDetails';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @OneToOne(() => BankingDetails)
  @JoinColumn()
  bankingDetails: BankingDetails;
}
