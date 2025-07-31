import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base.entity';

@Entity()
export class Transaction extends BaseEntity {
  @Column()
  senderUserId: number;

  @Column()
  receiverUserId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;
}
