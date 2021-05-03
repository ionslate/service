import { Resolvers, MutationResolvers, User } from '@root/__generatedTypes__';

const resetPasswordRequest: MutationResolvers['resetPasswordRequest'] = async (
  _,
  { email },
  { authService },
) => {
  await authService.resetPasswordRequest(email);

  return null;
};

const resetPassword: MutationResolvers['resetPassword'] = async (
  _,
  { resetId, password },
  { authService },
) => {
  await authService.resetPassword(resetId, password);

  return null;
};

const login: MutationResolvers['login'] = async (
  _,
  { request },
  { authService, req },
) => {
  const userEntity = await authService.login(request);

  const user: User = {
    id: userEntity.id,
    username: userEntity.username,
    email: userEntity.email,
    roles: userEntity.roles,
  };

  req.session.user = user;

  return user;
};

const logout: MutationResolvers['logout'] = async (_, __, { req, res }) => {
  const destroy = () =>
    new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });

  await destroy();
  res.clearCookie('user_sid');

  return null;
};

export default {
  Mutation: {
    resetPasswordRequest,
    resetPassword,
    login,
    logout,
  },
} as Resolvers;
