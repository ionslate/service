import server from '@root/server';
import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest from 'supertest';
import { createTestContainer } from '@test-utils/createTestContainer';

describe('weaponResolver', () => {
  describe('Query.weaponById', () => {
    it('should call weaponService.findWeaponById, weaponService.getWeaponModesbyWeaponIds, weaponService.getAmmoByWeaponModeIds, and weaponService.getTraitsByWeaponModeIds', async () => {
      const weaponId = '1234';
      const weaponService = {
        findWeaponById: jest.fn(),
        getWeaponModesByWeaponIds: jest.fn(),
        getAmmoByWeaponModeIds: jest.fn(),
        getTraitsByWeaponModeIds: jest.fn(),
      };
      weaponService.findWeaponById.mockResolvedValue({
        id: weaponId,
        name: 'Combi Rifle',
      });
      const weaponModeId = '5678';
      weaponService.getWeaponModesByWeaponIds.mockResolvedValue([
        [
          {
            id: weaponModeId,
            name: 'Combi Rifle',
            damage: '13',
            burst: '3',
            savingAttribute: 'ARM',
            range: {
              _8: 'PLUS_THREE',
              _16: 'PLUS_THREE',
              _24: 'MINUS_THREE',
              _32: 'MINUS_THREE',
              _40: 'MINUS_SIX',
              _48: 'MINUS_SIX',
            },
          },
        ],
      ]);
      const ammoId = '2345';
      weaponService.getAmmoByWeaponModeIds.mockResolvedValue([
        [{ id: ammoId, name: 'N' }],
      ]);
      const traitId = '3456';
      weaponService.getTraitsByWeaponModeIds.mockResolvedValue([
        [{ id: traitId, name: 'Suppresive Fire' }],
      ]);

      const response = await httpRequest(
        await server(createTestContainer({ weaponService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            query($weaponId: ID!) {
              weaponById(weaponId: $weaponId) {
                id
                name
                modes {
                  id
                  name
                  damage
                  burst
                  savingAttribute
                  range {
                    _8
                    _16
                    _24
                    _32
                    _40
                    _48
                    _96
                  }
                  ammo {
                    id
                    name
                  }
                  traits {
                    id
                    name
                  }
                }
              }
            }
          `),
          variables: { weaponId },
        });

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(weaponService.findWeaponById).toBeCalledWith(weaponId);
      expect(weaponService.getWeaponModesByWeaponIds).toBeCalledWith([
        weaponId,
      ]);
      expect(weaponService.getAmmoByWeaponModeIds).toBeCalledWith([
        weaponModeId,
      ]);
      expect(weaponService.getTraitsByWeaponModeIds).toBeCalledWith([
        weaponModeId,
      ]);
    });
  });

  describe('Query.weaponsList', () => {
    it.each`
      search               | searchArg            | page    | pageArg      | limit   | limitArg
      ${{ name: 'rifle' }} | ${{ name: 'rifle' }} | ${0}    | ${0}         | ${0}    | ${0}
      ${null}              | ${undefined}         | ${null} | ${undefined} | ${null} | ${undefined}
    `(
      'should call weaponService.getWeaponsList',
      async ({ search, searchArg, page, pageArg, limit, limitArg }) => {
        const weaponService = { getWeaponsList: jest.fn() };
        weaponService.getWeaponsList.mockResolvedValue({
          limit,
          page: page || 0,
          count: 1,
          last: true,
          content: [{ id: '1', name: 'Rifle' }],
        });

        const response = await httpRequest(
          await server(createTestContainer({ weaponService })),
        )
          .post('/graphql')
          .send({
            query: print(gql`
              query($search: Search, $page: Int, $limit: Int) {
                weaponsList(search: $search, page: $page, limit: $limit) {
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

        expect(weaponService.getWeaponsList).toBeCalledWith(
          searchArg,
          pageArg,
          limitArg,
        );
      },
    );
  });

  describe('Mutation.createWeapon', () => {
    it('should call weaponService.createWeapon', async () => {
      const weaponService = { createWeapon: jest.fn() };
      const weaponId = '1234';
      weaponService.createWeapon.mockResolvedValue({
        id: weaponId,
        name: 'Breaker Rifle',
      });

      // const request = {
      //   name: 'Breaker Rifle',
      //   range: {
      //     _8: 'ZERO',
      //     _16: 'PLUS_THREE',
      //     _24: 'MINUS_THREE',
      //     _32: 'MINUS_THREE',
      //     _40: 'MINUS_SIX',
      //     _48: 'MINUS_SIX',
      //   },
      //   damage: '13',
      //   burst: '3',
      //   savingAttribute: 'BTS',
      //   ammoIds: ['2'],
      //   traitIds: ['3'],
      // };

      const request = {
        name: 'Breaker Rifle',
      };

      const response = await httpRequest(
        await server(createTestContainer({ weaponService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($request: WeaponRequest!) {
              createWeapon(request: $request) {
                id
                name
              }
            }
          `),
          variables: { request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(weaponService.createWeapon).toBeCalledWith(request);
    });
  });

  describe('Mutation.updateWeapon', () => {
    it('should call weaponService.updateWeapon', async () => {
      const weaponService = { updateWeapon: jest.fn() };
      const weaponId = '1234';
      weaponService.updateWeapon.mockResolvedValue({
        id: weaponId,
        name: 'Breaker Rifle',
      });

      const request = {
        name: 'Breaker Rifle',
      };

      const response = await httpRequest(
        await server(createTestContainer({ weaponService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($weaponId: ID!, $request: WeaponRequest!) {
              updateWeapon(weaponId: $weaponId, request: $request) {
                id
                name
              }
            }
          `),
          variables: { weaponId, request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(weaponService.updateWeapon).toBeCalledWith(weaponId, request);
    });
  });
});
