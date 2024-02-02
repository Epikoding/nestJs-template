// src/data/authorityData.seeder.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorityEntity } from '../user/entity/authority.entity';
import { Role } from '../global/enum/role';


@Injectable()
export class AuthorityDataSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(AuthorityEntity)
    private readonly authorityRepository: Repository<AuthorityEntity>,
  ) {}

  async onModuleInit() {
    await this.loadInitialData();
  }

  private async loadInitialData() {
    // Here, you might want to check for the existence of roles to prevent duplicates
    const count = await this.authorityRepository.count();
    if (count === 0) {
      const temporaryEntity = new AuthorityEntity(Role.TEMPORARY);
      const blockedEntity = new AuthorityEntity(Role.BLOCKED);
      const userEntity = new AuthorityEntity(Role.USER);
      const adminEntity = new AuthorityEntity(Role.ADMIN);
      const authorityEntityList = [temporaryEntity, blockedEntity, userEntity, adminEntity];
      await this.authorityRepository.save(authorityEntityList);
    }
  }
}
