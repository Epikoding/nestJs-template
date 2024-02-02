import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthorityEntity } from './authority.entity';
import { BaseEntity } from '../../../base.entity';


@Entity('user_authority')
export class UserAuthorityEntity extends BaseEntity {
    @JoinColumn({ name: 'user_id' })
    @ManyToOne(() => UserEntity, user => user.userAuthorities)
    user: UserEntity;

    @JoinColumn({ name: 'authority_id' })
    @ManyToOne(() => AuthorityEntity, authority => authority.userAuthorities)
    authority: AuthorityEntity;
}