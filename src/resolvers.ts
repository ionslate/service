import ruleResolver from '@content-manager/common/resolvers/ruleResolver';
import ammoResolver from '@content-manager/ammo/resolvers/ammoResolver';
import hackingDeviceResolver from '@content-manager/hacking/resolvers/hackingDeviceResolver';
import hackingProgramResolver from '@content-manager/hacking/resolvers/hackingProgramResolvers';
import { Resolvers } from '@root/__generatedTypes__';

export default [
  ruleResolver,
  ammoResolver,
  hackingDeviceResolver,
  hackingProgramResolver,
] as Resolvers[];
