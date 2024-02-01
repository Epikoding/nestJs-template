import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { Role } from '../../global/enum/role';

@Entity()
export class AuthorityEntity extends BaseEntity {
  @Column()
  role: Role;

}
