import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    ruleById: (_, { ruleId }, { ruleService }) =>
      ruleService.findRuleById(ruleId),
    rulesList: (_, { search, page, limit }, { ruleService }) =>
      ruleService.getRulesList(
        search ?? undefined,
        page ?? undefined,
        limit ?? undefined,
      ),
  },
  Mutation: {
    createRule: (_, { request }, { ruleService }) =>
      ruleService.createRule(request),
    updateRule: (_, { ruleId, request }, { ruleService }) =>
      ruleService.updateRule(ruleId, request),
  },
} as Resolvers;
