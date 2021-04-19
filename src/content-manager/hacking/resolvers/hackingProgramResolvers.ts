import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    hackingProgramById: (_, { hackingProgramId }, { hackingProgramService }) =>
      hackingProgramService.findHackingProgramById(hackingProgramId),
    hackingProgramsList: (
      _,
      { search, page, limit },
      { hackingProgramService },
    ) =>
      hackingProgramService.getHackingProgramsList(
        search || undefined,
        page || undefined,
        limit || undefined,
      ),
  },
  Mutation: {
    createHackingProgram: (_, { request }, { hackingProgramService }) =>
      hackingProgramService.createHackingProgram(request),
    updateHackingProgram: (
      _,
      { hackingProgramId, request },
      { hackingProgramService },
    ) => hackingProgramService.updateHackingProgram(hackingProgramId, request),
  },
} as Resolvers;
