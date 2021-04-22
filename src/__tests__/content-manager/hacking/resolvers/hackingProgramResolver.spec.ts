import server from '@root/server';
import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest from 'supertest';
import { createTestContainer } from '@test-utils/createTestContainer';

describe('hackingProgramResolver', () => {
  describe('Query.hackingProgramById', () => {
    it('should call hackingProgramService.findHackingProgramById', async () => {
      const hackingProgramId = '1234';
      const hackingProgramService = { findHackingProgramById: jest.fn() };
      hackingProgramService.findHackingProgramById.mockResolvedValue({
        id: hackingProgramId,
        name: 'Carbonite',
        attackMod: '0',
        opponentMod: '0',
        damage: '0',
        burst: '0',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
      });

      const response = await httpRequest(
        await server(createTestContainer({ hackingProgramService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            query($hackingProgramId: ID!) {
              hackingProgramById(hackingProgramId: $hackingProgramId) {
                id
              }
            }
          `),
          variables: { hackingProgramId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(hackingProgramService.findHackingProgramById).toBeCalledWith(
        hackingProgramId,
      );
    });
  });

  describe('Query.hackingProgramList', () => {
    it.each`
      search             | searchArg          | page    | pageArg      | limit   | limitArg
      ${{ name: 'car' }} | ${{ name: 'car' }} | ${0}    | ${0}         | ${0}    | ${0}
      ${null}            | ${undefined}       | ${null} | ${undefined} | ${null} | ${undefined}
    `(
      'should call hackingProgramService.getHackingProgramsList',
      async ({ search, searchArg, page, pageArg, limit, limitArg }) => {
        const hackingProgramService = { getHackingProgramsList: jest.fn() };
        hackingProgramService.getHackingProgramsList.mockResolvedValue({
          limit,
          page: page || 0,
          count: 1,
          last: true,
          content: [
            {
              id: '1234',
              name: 'Carbonite',
              attackMod: '0',
              opponentMod: '0',
              damage: '0',
              burst: '0',
              target: ['TAG', 'HI', 'REM', 'HACKER'],
              skillType: ['SHORT_SKILL', 'ARO'],
            },
          ],
        });

        const response = await httpRequest(
          await server(createTestContainer({ hackingProgramService })),
        )
          .post('/graphql')
          .send({
            query: print(gql`
              query($search: Search, $page: Int, $limit: Int) {
                hackingProgramsList(
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

        expect(hackingProgramService.getHackingProgramsList).toBeCalledWith(
          searchArg,
          pageArg,
          limitArg,
        );
      },
    );
  });

  describe('Mutation.createHackingProgram', () => {
    it('should call hackingProgramService.createHackingProgram', async () => {
      const hackingProgramService = { createHackingProgram: jest.fn() };
      hackingProgramService.createHackingProgram.mockResolvedValue({
        id: '1234',
        name: 'Carbonite',
        attackMod: '0',
        opponentMod: '0',
        damage: '0',
        burst: '0',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
      });

      const request = {
        name: 'Carbonite',
        attackMod: '0',
        opponentMod: '0',
        damage: '0',
        burst: '0',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
      };

      const response = await httpRequest(
        await server(createTestContainer({ hackingProgramService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($request: HackingProgramRequest!) {
              createHackingProgram(request: $request) {
                id
                name
              }
            }
          `),
          variables: { request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(hackingProgramService.createHackingProgram).toBeCalledWith(
        request,
      );
    });
  });

  describe('Mutation.updateHackingProgram', () => {
    it('should call hackingProgramService.updateHackingProgram', async () => {
      const hackingProgramService = { updateHackingProgram: jest.fn() };
      const hackingProgramId = '1234';
      hackingProgramService.updateHackingProgram.mockResolvedValue({
        id: hackingProgramId,
        name: 'Carbonite',
        attackMod: '0',
        opponentMod: '0',
        damage: '0',
        burst: '0',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
      });

      const request = {
        name: 'Carbonite',
        attackMod: '0',
        opponentMod: '0',
        damage: '0',
        burst: '0',
        target: ['TAG', 'HI', 'REM', 'HACKER'],
        skillType: ['SHORT_SKILL', 'ARO'],
      };

      const response = await httpRequest(
        await server(createTestContainer({ hackingProgramService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($hackingProgramId: ID!, $request: HackingProgramRequest!) {
              updateHackingProgram(
                hackingProgramId: $hackingProgramId
                request: $request
              ) {
                id
                name
              }
            }
          `),
          variables: { request, hackingProgramId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(hackingProgramService.updateHackingProgram).toBeCalledWith(
        hackingProgramId,
        request,
      );
    });
  });
});
