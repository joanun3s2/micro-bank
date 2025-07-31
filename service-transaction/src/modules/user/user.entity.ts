import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { BankingDetails } from '../bankingDetails/bankingDetails.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  sourceId: number;

  @Column()
  firstName: string;

  @OneToOne(() => BankingDetails)
  @JoinColumn()
  bankingDetails: BankingDetails;
}
