import server from '@root/server';
import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest from 'supertest';
import { createTestContainer } from '@test-utils/createTestContainer';

describe('hackingDeviceResolver', () => {
  describe('Query.hackingDeviceById', () => {
    it('should call hackingDeviceService.findHackingDeviceById', async () => {
      const hackingDeviceId = '1234';
      const hackingDeviceService = { findHackingDeviceById: jest.fn() };
      hackingDeviceService.findHackingDeviceById.mockResolvedValue({
        id: hackingDeviceId,
        name: 'Hacking Device',
      });
      const hackingProgramService = {
        getHackingProgramsByHackingDeviceIds: jest.fn(),
      };
      hackingProgramService.getHackingProgramsByHackingDeviceIds.mockResolvedValue(
        [
          [
            {
              id: '2345',
              name: 'Carbonite',
              attackMod: '0',
              opponentMod: '0',
              damage: '0',
              burst: '0',
              target: ['TAG', 'HI', 'REM', 'HACKER'],
              skillType: ['SHORT_SKILL', 'ARO'],
            },
          ],
        ],
      );

      const response = await httpRequest(
        await server(
          createTestContainer({ hackingDeviceService, hackingProgramService }),
        ),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            query($hackingDeviceId: ID!) {
              hackingDeviceById(hackingDeviceId: $hackingDeviceId) {
                id
                programs {
                  id
                }
              }
            }
          `),
          variables: { hackingDeviceId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(hackingDeviceService.findHackingDeviceById).toBeCalledWith(
        hackingDeviceId,
      );
      expect(
        hackingProgramService.getHackingProgramsByHackingDeviceIds,
      ).toBeCalledWith([hackingDeviceId]);
    });
  });

  describe('Query.hackingDeviceList', () => {
    it.each`
      search              | searchArg           | page    | pageArg      | limit   | limitArg
      ${{ name: 'hack' }} | ${{ name: 'hack' }} | ${0}    | ${0}         | ${0}    | ${0}
      ${null}             | ${undefined}        | ${null} | ${undefined} | ${null} | ${undefined}
    `(
      'should call hackingDeviceService.getHackingDevicesList',
      async ({ search, searchArg, page, pageArg, limit, limitArg }) => {
        const hackingDeviceService = { getHackingDevicesList: jest.fn() };
        hackingDeviceService.getHackingDevicesList.mockResolvedValue({
          limit,
          page: page || 0,
          count: 1,
          last: true,
          content: [
            {
              id: '1234',
              name: 'Hacking Device',
            },
          ],
        });

        const response = await httpRequest(
          await server(createTestContainer({ hackingDeviceService })),
        )
          .post('/graphql')
          .send({
            query: print(gql`
              query($search: Search, $page: Int, $limit: Int) {
                hackingDevicesList(
                  search: $search
                  page: $page
                  limit: $limit
                ) {
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

        expect(hackingDeviceService.getHackingDevicesList).toBeCalledWith(
          searchArg,
          pageArg,
          limitArg,
        );
      },
    );
  });

  describe('Mutation.createHackingDevice', () => {
    it('should call hackingDeviceService.createHackingDevice', async () => {
      const hackingDeviceService = { createHackingDevice: jest.fn() };
      hackingDeviceService.createHackingDevice.mockResolvedValue({
        id: '1234',
        name: 'Hacking Device',
      });

      const request = {
        name: 'Carbonite',
        programIds: ['2345', '3456'],
      };

      const response = await httpRequest(
        await server(createTestContainer({ hackingDeviceService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($request: HackingDeviceRequest!) {
              createHackingDevice(request: $request) {
                id
                name
              }
            }
          `),
          variables: { request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(hackingDeviceService.createHackingDevice).toBeCalledWith(request);
    });
  });

  describe('Mutation.updateHackingDevice', () => {
    it('should call hackingDeviceService.updateHackingDevice', async () => {
      const hackingDeviceService = { updateHackingDevice: jest.fn() };
      const hackingDeviceId = '1234';
      hackingDeviceService.updateHackingDevice.mockResolvedValue({
        id: hackingDeviceId,
        name: 'Hacking Device',
      });

      const request = {
        name: 'Carbonite',
        programIds: ['2345', '3456'],
      };

      const response = await httpRequest(
        await server(createTestContainer({ hackingDeviceService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($hackingDeviceId: ID!, $request: HackingDeviceRequest!) {
              updateHackingDevice(
                hackingDeviceId: $hackingDeviceId
                request: $request
              ) {
                id
                name
              }
            }
          `),
          variables: { request, hackingDeviceId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(hackingDeviceService.updateHackingDevice).toBeCalledWith(
        hackingDeviceId,
        request,
      );
    });
  });
});
