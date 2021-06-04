import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
} from '@root/__generatedTypes__';

const hackingProgramById: QueryResolvers['hackingProgramById'] = (
  _,
  { hackingProgramId },
  { hackingProgramService },
) => hackingProgramService.findHackingProgramById(hackingProgramId);

const hackingProgramsList: QueryResolvers['hackingProgramsList'] = (
  _,
  { search, page, limit },
  { hackingProgramService },
) =>
  hackingProgramService.getHackingProgramsList(
    search ?? undefined,
    page ?? undefined,
    limit ?? undefined,
  );

const createHackingProgram: MutationResolvers['createHackingProgram'] = (
  _,
  { request },
  { hackingProgramService, req },
) => hackingProgramService.createHackingProgram(request, req.session.user?.id);

const updateHackingProgram: MutationResolvers['updateHackingProgram'] = (
  _,
  { hackingProgramId, request },
  { hackingProgramService, req },
) =>
  hackingProgramService.updateHackingProgram(
    hackingProgramId,
    request,
    req.session.user?.id,
  );

export default {
  Query: {
    hackingProgramById,
    hackingProgramsList,
  },
  Mutation: {
    createHackingProgram,
    updateHackingProgram,
  },
} as Resolvers;
