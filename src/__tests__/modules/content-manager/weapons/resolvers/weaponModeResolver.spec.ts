import server from '@root/server';
import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest from 'supertest';
import { createTestContainer } from '@test-utils/createTestContainer';
import { createTestServerWithCredentials } from '@test-utils/mockLogin';

describe('weaponModeResolver', () => {
  describe('Mutation.createWeaponMode', () => {
    it('should call weaponService.createWeaponMode', async () => {
      const weaponService = { createWeaponMode: jest.fn() };
      const weaponId = '1234';
      weaponService.createWeaponMode.mockResolvedValue({
        id: weaponId,
        name: 'Breaker Rifle',
      });

      const request = {
        name: 'Breaker Rifle',
        range: {
          _8: 'ZERO',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'BTS',
        ammoIds: ['2'],
        traitIds: ['3'],
      };

      const testServer = await createTestServerWithCredentials(
        await server(
          createTestContainer({ weaponService }, ['CONTENT_MANAGER']),
        ),
      );

      const response = await testServer
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($weaponId: ID!, $request: WeaponModeRequest!) {
              createWeaponMode(weaponId: $weaponId, request: $request) {
                id
                name
              }
            }
          `),
          variables: { weaponId, request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(weaponService.createWeaponMode).toBeCalledWith(weaponId, request);
    });

    it.each(['USER', 'USER_ADMIN', 'CONTENT_PUBLISHER', undefined])(
      'should deny access if the user has a role of %s',
      async (role) => {
        const weaponId = '1234';
        const request = {
          name: 'Breaker Rifle',
          range: {
            _8: 'ZERO',
            _16: 'PLUS_THREE',
            _24: 'MINUS_THREE',
            _32: 'MINUS_THREE',
            _40: 'MINUS_SIX',
            _48: 'MINUS_SIX',
          },
          damage: '13',
          burst: '3',
          savingAttribute: 'BTS',
          ammoIds: ['2'],
          traitIds: ['3'],
        };

        const testServer = await createTestServerWithCredentials(
          await server(createTestContainer(undefined, [role as never])),
        );

        const response = await testServer
          .post('/graphql')
          .send({
            query: print(gql`
              mutation($weaponId: ID!, $request: WeaponModeRequest!) {
                createWeaponMode(weaponId: $weaponId, request: $request) {
                  id
                  name
                }
              }
            `),
            variables: { weaponId, request },
          })
          .expect(200);

        expect(JSON.parse(response.text).errors[0].extensions.code).toBe(403);
      },
    );

    it('should deny access if a user is not logged in', async () => {
      const weaponId = '1234';
      const request = {
        name: 'Breaker Rifle',
        range: {
          _8: 'ZERO',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'BTS',
        ammoIds: ['2'],
        traitIds: ['3'],
      };

      const response = await httpRequest(await server(createTestContainer()))
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($weaponId: ID!, $request: WeaponModeRequest!) {
              createWeaponMode(weaponId: $weaponId, request: $request) {
                id
                name
              }
            }
          `),
          variables: { weaponId, request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors[0].extensions.code).toBe(401);
    });
  });

  describe('Mutation.updateWeapon', () => {
    it('should call weaponService.updateWeaponMode', async () => {
      const weaponService = { updateWeaponMode: jest.fn() };
      const weaponId = '1234';
      weaponService.updateWeaponMode.mockResolvedValue({
        id: weaponId,
        name: 'Breaker Rifle',
      });
      const weaponModeId = '2345';
      const request = {
        name: 'Breaker Rifle',
        range: {
          _8: 'ZERO',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'BTS',
        ammoIds: ['2'],
        traitIds: ['3'],
      };

      const testServer = await createTestServerWithCredentials(
        await server(
          createTestContainer({ weaponService }, ['CONTENT_MANAGER']),
        ),
      );

      const response = await testServer
        .post('/graphql')
        .send({
          query: print(gql`
            mutation(
              $weaponId: ID!
              $weaponModeId: ID!
              $request: WeaponModeRequest!
            ) {
              updateWeaponMode(
                weaponId: $weaponId
                weaponModeId: $weaponModeId
                request: $request
              ) {
                id
                name
              }
            }
          `),
          variables: { weaponId, weaponModeId, request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(weaponService.updateWeaponMode).toBeCalledWith(
        weaponId,
        weaponModeId,
        request,
      );
    });

    it.each(['USER', 'USER_ADMIN', 'CONTENT_PUBLISHER', undefined])(
      'should deny access if the user has a role of %s',
      async (role) => {
        const weaponId = '1234';
        const weaponModeId = '2345';
        const request = {
          name: 'Breaker Rifle',
          range: {
            _8: 'ZERO',
            _16: 'PLUS_THREE',
            _24: 'MINUS_THREE',
            _32: 'MINUS_THREE',
            _40: 'MINUS_SIX',
            _48: 'MINUS_SIX',
          },
          damage: '13',
          burst: '3',
          savingAttribute: 'BTS',
          ammoIds: ['2'],
          traitIds: ['3'],
        };

        const testServer = await createTestServerWithCredentials(
          await server(createTestContainer(undefined, [role as never])),
        );

        const response = await testServer
          .post('/graphql')
          .send({
            query: print(gql`
              mutation(
                $weaponId: ID!
                $weaponModeId: ID!
                $request: WeaponModeRequest!
              ) {
                updateWeaponMode(
                  weaponId: $weaponId
                  weaponModeId: $weaponModeId
                  request: $request
                ) {
                  id
                  name
                }
              }
            `),
            variables: { weaponId, weaponModeId, request },
          })
          .expect(200);

        expect(JSON.parse(response.text).errors[0].extensions.code).toBe(403);
      },
    );

    it('should deny access if a user is not logged in', async () => {
      const weaponId = '1234';
      const weaponModeId = '2345';
      const request = {
        name: 'Breaker Rifle',
        range: {
          _8: 'ZERO',
          _16: 'PLUS_THREE',
          _24: 'MINUS_THREE',
          _32: 'MINUS_THREE',
          _40: 'MINUS_SIX',
          _48: 'MINUS_SIX',
        },
        damage: '13',
        burst: '3',
        savingAttribute: 'BTS',
        ammoIds: ['2'],
        traitIds: ['3'],
      };

      const response = await httpRequest(await server(createTestContainer()))
        .post('/graphql')
        .send({
          query: print(gql`
            mutation(
              $weaponId: ID!
              $weaponModeId: ID!
              $request: WeaponModeRequest!
            ) {
              updateWeaponMode(
                weaponId: $weaponId
                weaponModeId: $weaponModeId
                request: $request
              ) {
                id
                name
              }
            }
          `),
          variables: { weaponId, weaponModeId, request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors[0].extensions.code).toBe(401);
    });
  });

  describe('removeWeaponMode', () => {
    it('should call weaponService.updateWeaponMode', async () => {
      const weaponService = { removeWeaponMode: jest.fn() };
      const weaponId = '1234';
      const weaponModeId = '2345';
      weaponService.removeWeaponMode.mockResolvedValue(weaponModeId);

      const testServer = await createTestServerWithCredentials(
        await server(
          createTestContainer({ weaponService }, ['CONTENT_MANAGER']),
        ),
      );

      const response = await testServer
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($weaponId: ID!, $weaponModeId: ID!) {
              removeWeaponMode(weaponId: $weaponId, weaponModeId: $weaponModeId)
            }
          `),
          variables: { weaponId, weaponModeId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(weaponService.removeWeaponMode).toBeCalledWith(
        weaponId,
        weaponModeId,
      );
    });
  });
  it.each(['USER', 'USER_ADMIN', 'CONTENT_PUBLISHER', undefined])(
    'should deny access if the user has a role of %s',
    async (role) => {
      const weaponId = '1234';
      const weaponModeId = '2345';

      const testServer = await createTestServerWithCredentials(
        await server(createTestContainer(undefined, [role as never])),
      );

      const response = await testServer
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($weaponId: ID!, $weaponModeId: ID!) {
              removeWeaponMode(weaponId: $weaponId, weaponModeId: $weaponModeId)
            }
          `),
          variables: { weaponId, weaponModeId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors[0].extensions.code).toBe(403);
    },
  );

  it('should deny access if a user is not logged in', async () => {
    const weaponId = '1234';
    const weaponModeId = '2345';

    const response = await httpRequest(await server(createTestContainer()))
      .post('/graphql')
      .send({
        query: print(gql`
          mutation($weaponId: ID!, $weaponModeId: ID!) {
            removeWeaponMode(weaponId: $weaponId, weaponModeId: $weaponModeId)
          }
        `),
        variables: { weaponId, weaponModeId },
      })
      .expect(200);

    expect(JSON.parse(response.text).errors[0].extensions.code).toBe(401);
  });
});
