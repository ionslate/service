import { RuleEntity } from '@content-manager/common/entities/RuleEntity';
import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Page, paginateEntites } from '@root/utils';
import { RuleRequest, Search } from '@root/__generatedTypes__';
import { AuditService } from '@audit/services/AuditService';

export class RuleService {
  constructor(
    private ruleRepository: EntityRepository<RuleEntity>,
    private auditService: AuditService,
  ) {}

  async createRule(request: RuleRequest): Promise<RuleEntity> {
    const ruleEntity = this.ruleRepository.create({
      name: request.name,
      link: request.link,
      type: request.type,
    });

    await this.ruleRepository.persistAndFlush(ruleEntity);

    await this.auditService.addCreateAudit({
      entityName: RuleEntity.name,
      resourceId: ruleEntity.id,
      resourceName: ruleEntity.name,
      data: ruleEntity.toPOJO(),
    });

    return ruleEntity;
  }

  async updateRule(ruleId: string, request: RuleRequest): Promise<RuleEntity> {
    const ruleEntity = await this.ruleRepository.findOneOrFail({ id: ruleId });

    const originalRule = ruleEntity.toPOJO();

    ruleEntity.assign({
      name: request.name,
      link: request.link,
      type: request.type,
    });

    await this.ruleRepository.persistAndFlush(ruleEntity);

    await this.auditService.addUpdateAudit({
      entityName: RuleEntity.name,
      resourceId: ruleEntity.id,
      resourceName: originalRule.name,
      originalValue: originalRule,
      newValue: ruleEntity.toPOJO(),
    });

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
        offset: page && limit ? page * limit : undefined,
      },
    );

    return paginateEntites(ruleEntities, count, page, limit);
  }
}
