import ruleResolver from '@content-manager/common/resolvers/ruleResolver';
import ammoResolver from '@root/content-manager/weapons/resolvers/ammoResolver';
import weaponModeResolver from '@root/content-manager/weapons/resolvers/weaponModeResolver';
import weaponResolver from '@root/content-manager/weapons/resolvers/weaponResolver';
import hackingDeviceResolver from '@content-manager/hacking/resolvers/hackingDeviceResolver';
import hackingProgramResolver from '@content-manager/hacking/resolvers/hackingProgramResolvers';
import { Resolvers } from '@root/__generatedTypes__';

export default [
  ruleResolver,
  hackingDeviceResolver,
  hackingProgramResolver,
  ammoResolver,
  weaponModeResolver,
  weaponResolver,
] as Resolvers[];
