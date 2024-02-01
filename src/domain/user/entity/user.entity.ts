import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { UserAuthorityEntity } from './user-authority.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserAuthorityEntity, userAuthority => userAuthority.user)
  userAuthorities: UserAuthorityEntity[];
}

