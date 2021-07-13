import ruleResolver from '@content-manager/common/resolvers/ruleResolver';
import hackingDeviceResolver from '@content-manager/hacking/resolvers/hackingDeviceResolver';
import hackingProgramResolver from '@content-manager/hacking/resolvers/hackingProgramResolvers';
import ammoResolver from '@content-manager/weapons/resolvers/ammoResolver';
import weaponModeResolver from '@content-manager/weapons/resolvers/weaponModeResolver';
import weaponResolver from '@content-manager/weapons/resolvers/weaponResolver';
import userResolver from '@users/resolvers/userResolver';
import authResolver from '@auth/resolvers/authResolver';
import auditResolver from '@audit/resolvers/auditResolver';
import { Resolvers } from '@root/__generatedTypes__';

export default [
  ruleResolver,
  hackingDeviceResolver,
  hackingProgramResolver,
  ammoResolver,
  weaponModeResolver,
  weaponResolver,
  authResolver,
  userResolver,
  auditResolver,
] as Resolvers[];
