import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    ruleById: (_, { id }, { ruleService }) => ruleService.findRuleById(id),
    searchRules: (_, { name, page, limit }, { ruleService }) =>
      ruleService.findRulesByName(name, page || undefined, limit || undefined),
    allRules: (
      _,
      { page, limit }: { page: number; limit: number },
      { ruleService },
    ) => ruleService.findAllRules(page, limit),
  },
  Mutation: {
    createRule: (_, { request }, { ruleService }) =>
      ruleService.createRule(request),
    updateRule: (_, { ruleId, request }, { ruleService }) =>
      ruleService.updateRule(ruleId, request),
  },
} as Resolvers;
