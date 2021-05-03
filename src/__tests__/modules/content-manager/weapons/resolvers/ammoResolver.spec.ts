import server from '@root/server';
import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest from 'supertest';
import { createTestContainer } from '@test-utils/createTestContainer';

describe('ammoResolver', () => {
  describe('Query.ammoById', () => {
    it('should call ammoService.findAmmoById and ammoService.getCombinedAmmoByIds', async () => {
      const ammoId = '1234';
      const ammoService = {
        findAmmoById: jest.fn(),
        getCombinedAmmoByAmmoIds: jest.fn(),
      };
      ammoService.findAmmoById.mockResolvedValue({
        id: ammoId,
        name: 'AP+EXP',
      });
      ammoService.getCombinedAmmoByAmmoIds.mockResolvedValue([
        [
          { id: '1', name: 'AP' },
          { id: '2', name: 'EXP' },
        ],
      ]);

      const response = await httpRequest(
        await server(createTestContainer({ ammoService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            query($ammoId: ID!) {
              ammoById(ammoId: $ammoId) {
                id
                name
                combinedAmmo {
                  id
                  name
                }
              }
            }
          `),
          variables: { ammoId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(ammoService.findAmmoById).toBeCalledWith(ammoId);
      expect(ammoService.getCombinedAmmoByAmmoIds).toBeCalledWith([ammoId]);
    });
  });

  describe('Query.ammoList', () => {
    it.each`
      search            | searchArg         | page    | pageArg      | limit   | limitArg
      ${{ name: 'ap' }} | ${{ name: 'ap' }} | ${0}    | ${0}         | ${0}    | ${0}
      ${null}           | ${undefined}      | ${null} | ${undefined} | ${null} | ${undefined}
    `(
      'should call ammoService.getAmmoList',
      async ({ search, searchArg, page, pageArg, limit, limitArg }) => {
        const ammoService = { getAmmoList: jest.fn() };
        ammoService.getAmmoList.mockResolvedValue({
          limit,
          page: page || 0,
          count: 1,
          last: true,
          content: [{ id: '1', name: 'AP' }],
        });

        const response = await httpRequest(
          await server(createTestContainer({ ammoService })),
        )
          .post('/graphql')
          .send({
            query: print(gql`
              query($search: Search, $page: Int, $limit: Int) {
                ammoList(search: $search, page: $page, limit: $limit) {
                  limit
                  count
                  page
                  last
                  content {
                    id
                  }
                }
              }
            `),
            variables: { search, page, limit },
          })
          .expect(200);

        expect(JSON.parse(response.text).errors).toBeFalsy();

        expect(ammoService.getAmmoList).toBeCalledWith(
          searchArg,
          pageArg,
          limitArg,
        );
      },
    );
  });

  describe('Mutation.createAmmo', () => {
    it('should call ammoService.createAmmo', async () => {
      const ammoService = { createAmmo: jest.fn() };
      ammoService.createAmmo.mockResolvedValue({
        id: '1234',
        name: 'AP',
      });

      const request = { name: 'AP', combinedAmmoIds: [] };

      const response = await httpRequest(
        await server(createTestContainer({ ammoService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($request: AmmoRequest!) {
              createAmmo(request: $request) {
                id
                name
              }
            }
          `),
          variables: { request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(ammoService.createAmmo).toBeCalledWith(request);
    });
  });

  describe('Mutation.updateAmmo', () => {
    it('should call ammoService.updateAmmo', async () => {
      const ammoService = { updateAmmo: jest.fn() };
      const ammoId = '1234';
      ammoService.updateAmmo.mockResolvedValue({
        id: ammoId,
        name: 'AP',
      });

      const request = { name: 'AP', combinedAmmoIds: [] };

      const response = await httpRequest(
        await server(createTestContainer({ ammoService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($ammoId: ID!, $request: AmmoRequest!) {
              updateAmmo(ammoId: $ammoId, request: $request) {
                id
                name
              }
            }
          `),
          variables: { request, ammoId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(ammoService.updateAmmo).toBeCalledWith(ammoId, request);
    });
  });
});
