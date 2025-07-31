import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { BankingDetails } from '../bankingDetails/bankingDetails.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  sourceId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  age: number;

  @OneToMany(() => BankingDetails, (bankingDetails) => bankingDetails.user)
  bankingDetails: BankingDetails[];
}
