import {
  Resolvers,
  QueryResolvers,
  MutationResolvers,
  User,
  PagedUsers,
} from '@root/__generatedTypes__';

const ONE_DAY_IN_SECONDS = 86400;

const user: QueryResolvers['user'] = (_, __, { req }) => {
  return req.session.user || null;
};

const userById: QueryResolvers['userById'] = async (
  _,
  { userId },
  { userService },
) => {
  const userEntity = await userService.getUserById(userId);

  return userEntity as never;
};

const userList: QueryResolvers['userList'] = async (
  _,
  { search, page, limit },
  { userService },
) => {
  const pagedUserEntities = await userService.getUsersList(
    search ?? undefined,
    page ?? undefined,
    limit ?? undefined,
  );

  return pagedUserEntities as PagedUsers;
};

const createUser: MutationResolvers['createUser'] = async (
  _,
  { request },
  { userService, rateLimiter },
  info,
) => {
  await rateLimiter.limit(info.fieldName, 10, ONE_DAY_IN_SECONDS);

  await userService.createUser(request);

  return null;
};

const adminCreateUser: MutationResolvers['adminCreateUser'] = async (
  _,
  { request },
  { userService },
) => {
  const userEntity = await userService.adminCreateUser(request);

  return userEntity as never;
};

const changePassword: MutationResolvers['changePassword'] = async (
  _,
  { request },
  { userService, req },
) => {
  if (!req.session.user) {
    throw new Error('FORBIDDEN');
  }

  await userService.changeUserPassword(req.session.user.id, request);

  return null;
};

const updateUser: MutationResolvers['updateUser'] = async (
  _,
  { userId, request, logUserOut },
  { userService },
) => {
  const userEntity = await userService.updateUser(userId, request, logUserOut);

  return userEntity as User;
};

const removeUser: MutationResolvers['removeUser'] = async (
  _,
  { userId },
  { userService },
) => {
  return await userService.removeUser(userId);
};

const remove: MutationResolvers['remove'] = async (
  _,
  __,
  { userService, req },
) => {
  return await userService.removeUser(req.session.user?.id || '');
};

const disableUser: MutationResolvers['disableUser'] = async (
  _,
  { userId },
  { userService },
) => {
  return await userService.disableUser(userId);
};

const enableUser: MutationResolvers['enableUser'] = async (
  _,
  { userId },
  { userService },
) => {
  return await userService.enableUser(userId);
};

const forceLogoutUser: MutationResolvers['forceLogoutUser'] = async (
  _,
  { userId },
  { userService },
) => {
  return await userService.forceLogoutUser(userId);
};

const resetPasswordRequest: MutationResolvers['resetPasswordRequest'] = async (
  _,
  { email },
  { userService, rateLimiter },
  info,
) => {
  await rateLimiter.limit(info.fieldName, 10, ONE_DAY_IN_SECONDS);
  await userService.resetPasswordRequest(email);

  return null;
};

const resetPassword: MutationResolvers['resetPassword'] = async (
  _,
  { resetId, password },
  { userService },
) => {
  const userEntity = await userService.resetPassword(resetId, password);

  return userEntity as never;
};

export default {
  Query: {
    user,
    userById,
    userList,
  },
  Mutation: {
    createUser,
    adminCreateUser,
    changePassword,
    updateUser,
    removeUser,
    remove,
    disableUser,
    enableUser,
    forceLogoutUser,
    resetPasswordRequest,
    resetPassword,
  },
} as Resolvers;
