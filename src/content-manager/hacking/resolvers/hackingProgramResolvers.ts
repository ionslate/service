import { Resolvers } from '@root/__generatedTypes__';

export default {
  Query: {
    hackingProgramById: (_, { hackingProgramId }, { hackingProgramService }) =>
      hackingProgramService.findHackingProgramById(hackingProgramId),
    allHackingPrograms: (_, { page, limit }, { hackingProgramService }) =>
      hackingProgramService.findAllHackingPrograms(
        page || undefined,
        limit || undefined,
      ),
    searchHackingPrograms: (
      _,
      { name, page, limit },
      { hackingProgramService },
    ) =>
      hackingProgramService.findHackingProgramByName(
        name,
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
