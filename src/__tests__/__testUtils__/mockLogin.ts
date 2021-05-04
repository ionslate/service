import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest, { Test } from 'supertest';
import { Express } from 'express-serve-static-core';

interface WithCredentials {
  post: (url: string) => Test;
  get: (url: string) => Test;
  put: (url: string) => Test;
  patch: (url: string) => Test;
  delete: (url: string) => Test;
  options: (url: string) => Test;
}

export async function createTestServerWithCredentials(
  server: Express,
): Promise<WithCredentials> {
  const login = await httpRequest(server)
    .post('/graphql')
    .send({
      query: print(gql`
        mutation($request: LoginRequest!) {
          login(request: $request) {
            id
          }
        }
      `),
      variables: { request: { username: 'foo', password: 'bar' } },
    });

  const cookies = login.get('Set-Cookie');

  return {
    post: (url: string) => httpRequest(server).post(url).set('Cookie', cookies),
    get: (url: string) => httpRequest(server).get(url).set('Cookie', cookies),
    put: (url: string) => httpRequest(server).put(url).set('Cookie', cookies),
    patch: (url: string) =>
      httpRequest(server).patch(url).set('Cookie', cookies),
    delete: (url: string) =>
      httpRequest(server).delete(url).set('Cookie', cookies),
    options: (url: string) =>
      httpRequest(server).options(url).set('Cookie', cookies),
  };
}
