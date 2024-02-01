import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { AuthorityEntity } from './authority.entity';


@Entity('user_authority')
export class UserAuthorityEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.userAuthorities)
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => AuthorityEntity, authority => authority.userAuthorities)
    @JoinColumn({ name: 'authority_id' })
    authority: AuthorityEntity;
}