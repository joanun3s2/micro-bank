import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../common/base.entity';
import { BankingDetails } from '../bankingDetails/bankingDetails';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @Column()
  age: number;

  @Column({ type: 'bytea', nullable: true })
  profilePicture: Buffer;

  @OneToMany(() => BankingDetails, (bankingDetails) => bankingDetails.user)
  bankingDetails: BankingDetails[];
}
