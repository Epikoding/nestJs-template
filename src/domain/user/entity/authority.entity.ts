import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { Role } from '../enum/role';
import { UserAuthorityEntity } from './user-authority.entity';

@Entity()
export class AuthorityEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @OneToMany(()  => UserAuthorityEntity, userAuthorityEntity => userAuthorityEntity.authority)
  userAuthorities: UserAuthorityEntity[];


  constructor(role?: Role, userAuthorities?: UserAuthorityEntity[]) {
    super();
    this.role = role;
    this.userAuthorities = userAuthorities;
  }
}
  
