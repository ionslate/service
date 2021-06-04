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
    createRule: (_, { request }, { ruleService, req }) =>
      ruleService.createRule(request, req.session.user?.id),
    updateRule: (_, { ruleId, request }, { ruleService, req }) =>
      ruleService.updateRule(ruleId, request, req.session.user?.id),
  },
} as Resolvers;
