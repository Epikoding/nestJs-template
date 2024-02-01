import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;
}
