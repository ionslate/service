import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import { RuleRequest, Search } from '@root/__generatedTypes__';

export class RuleService {
  constructor(private ruleRepository: EntityRepository<RuleEntity>) {}

  async createRule(request: RuleRequest): Promise<RuleEntity> {
    const ruleEntity = this.ruleRepository.create({
      name: request.name,
      link: request.link,
      type: request.type,
    });

    await this.ruleRepository.persistAndFlush(ruleEntity);

    return ruleEntity;
  }

  async updateRule(ruleId: string, request: RuleRequest): Promise<RuleEntity> {
    const ruleEntity = await this.ruleRepository.findOneOrFail({ id: ruleId });

    ruleEntity.assign({
      name: request.name,
      link: request.link,
      type: request.type,
    });

    this.ruleRepository.persistAndFlush(ruleEntity);

    return ruleEntity;
  }

  async findRuleById(ruleId: string): Promise<RuleEntity> {
    return await this.ruleRepository.findOneOrFail({ id: ruleId });
  }

  async getRulesList(
    search?: Search,
    page?: number,
    limit?: number,
  ): Promise<Page<RuleEntity>> {
    const [ruleEntities, count] = await this.ruleRepository.findAndCount(
      search ? { name: { $ilike: `%${search.name}%` } } : {},
      {
        orderBy: { name: QueryOrder.ASC },
        limit,
        offset: page,
      },
    );

    return paginateEntites(ruleEntities, count, page, limit);
  }
}
