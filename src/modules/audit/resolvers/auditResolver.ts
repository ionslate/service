import { QueryResolvers, Resolvers } from '@root/__generatedTypes__';

const auditList: QueryResolvers['auditList'] = async (
  _,
  { page, limit },
  { auditService },
) => await auditService.getAuditList(page ?? undefined, limit ?? undefined);

export default {
  Query: {
    auditList,
  },
} as Resolvers;
