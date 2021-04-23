import OktaJwtVerifier from '@okta/jwt-verifier';
import config from '@config/config';
import { RequestHandler } from 'express-serve-static-core';
import { UserRole } from '@root/container';

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: config.authIssuer as string,
});

export const getUser: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  const accessToken = match?.[1] || '';

  return oktaJwtVerifier
    .verifyAccessToken(accessToken as string, config.expectedAudience as string)
    .then((jwt) => {
      req.user = {
        id: jwt.claims.uid as string,
        roles: jwt.claims.roles as UserRole[],
        name: jwt.claims.preferred_name as string,
      };
    })
    .catch(() => null)
    .finally(() => {
      next();
    });
};
