import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../base.entity';
import { UserAuthorityEntity } from './user-authority.entity';
import { AuthorityEntity } from './authority.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // @OneToMany(() => UserAuthorityEntity, userAuthority => userAuthority.user)
  @OneToMany(() => UserAuthorityEntity, userAuthority => userAuthority.user, { cascade: true })
  userAuthorities: UserAuthorityEntity[];


  constructor(name: string, email: string, password: string, authorityEntity: AuthorityEntity) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;

    if (authorityEntity) { // 권한 매핑
      const userAuthorityEntity = new UserAuthorityEntity();
      userAuthorityEntity.user = this;
      userAuthorityEntity.authority = authorityEntity;
      this.userAuthorities = [userAuthorityEntity];
    }
  }
}

