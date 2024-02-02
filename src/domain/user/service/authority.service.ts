import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorityEntity } from '../entity/authority.entity';
import { Repository } from 'typeorm';
import { Role } from '../../global/enum/role';


@Injectable()
export class AuthorityService {
  constructor(@InjectRepository(AuthorityEntity) private authorityRepository: Repository<AuthorityEntity>) {
  }

  async findAll(): Promise<AuthorityEntity[]> {
    return await this.authorityRepository.find();
  }

  async findOneByRole(role: Role): Promise<AuthorityEntity> {
    return await this.authorityRepository.findOneBy({ role: role });
  }
}
