import { Resolvers, MutationResolvers, User } from '@root/__generatedTypes__';

const FIVE_MINUTES_IN_SECONDS = 300;

const login: MutationResolvers['login'] = async (
  _,
  { request },
  { authService, req, rateLimiter },
  info,
) => {
  await rateLimiter.limit(info.fieldName, 3, FIVE_MINUTES_IN_SECONDS);

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
    login,
    logout,
  },
} as Resolvers;
