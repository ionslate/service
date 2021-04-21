import server from '@root/server';
import { gql } from 'apollo-server-core';
import { print } from 'graphql';
import httpRequest from 'supertest';
import { createTestContainer } from '@test-utils/createTestContainer';

describe('ruleResolver', () => {
  describe('Query.ruleById', () => {
    it('should call ruleService.findRuleById', async () => {
      const ruleId = '1234';
      const ruleService = { findRuleById: jest.fn() };
      ruleService.findRuleById.mockResolvedValue({
        id: ruleId,
        name: 'Motorcycle',
        type: 'MOTORCYLE',
      });

      const response = await httpRequest(
        await server(createTestContainer({ ruleService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            query($ruleId: ID!) {
              ruleById(ruleId: $ruleId) {
                id
                name
              }
            }
          `),
          variables: { ruleId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(ruleService.findRuleById).toBeCalledWith(ruleId);
    });
  });

  describe('Query.rulesList', () => {
    it.each`
      search             | searchArg          | page    | pageArg      | limit   | limitArg
      ${{ name: 'mot' }} | ${{ name: 'mot' }} | ${0}    | ${0}         | ${0}    | ${0}
      ${null}            | ${undefined}       | ${null} | ${undefined} | ${null} | ${undefined}
    `(
      'should call rulesService.getRulesList',
      async ({ search, searchArg, page, pageArg, limit, limitArg }) => {
        const ruleService = { getRulesList: jest.fn() };
        ruleService.getRulesList.mockResolvedValue({
          limit,
          count: 1,
          page: page || 0,
          last: true,
          content: [{ id: '1234', name: 'Motorcyle', type: 'MOTORCYLE' }],
        });

        const response = await httpRequest(
          await server(createTestContainer({ ruleService })),
        )
          .post('/graphql')
          .send({
            query: print(gql`
              query($search: Search, $page: Int, $limit: Int) {
                rulesList(search: $search, page: $page, limit: $limit) {
                  limit
                  count
                  page
                  last
                  content {
                    id
                    name
                  }
                }
              }
            `),
            variables: { search, page, limit },
          })
          .expect(200);

        expect(JSON.parse(response.text).errors).toBeFalsy();

        expect(ruleService.getRulesList).toBeCalledWith(
          searchArg,
          pageArg,
          limitArg,
        );
      },
    );
  });

  describe('Mutation.createRule', () => {
    it('should call ruleService.createRule', async () => {
      const ruleService = { createRule: jest.fn() };
      ruleService.createRule.mockResolvedValue({
        id: '1234',
        name: 'Motorcyle',
        type: 'MOTORCYLE',
      });

      const request = {
        name: 'Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };

      const response = await httpRequest(
        await server(createTestContainer({ ruleService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($request: RuleRequest!) {
              createRule(request: $request) {
                id
                name
              }
            }
          `),
          variables: { request },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(ruleService.createRule).toBeCalledWith(request);
    });
  });

  describe('Mutation.updateRule', () => {
    it('should call ruleService.createRule', async () => {
      const ruleService = { updateRule: jest.fn() };
      ruleService.updateRule.mockResolvedValue({
        id: '1234',
        name: 'Motorcyle',
        type: 'MOTORCYLE',
      });

      const ruleId = '1234';
      const request = {
        name: 'Motorcycle',
        link: null,
        type: 'MOTORCYCLE',
      };

      const response = await httpRequest(
        await server(createTestContainer({ ruleService })),
      )
        .post('/graphql')
        .send({
          query: print(gql`
            mutation($ruleId: ID!, $request: RuleRequest!) {
              updateRule(ruleId: $ruleId, request: $request) {
                id
                name
              }
            }
          `),
          variables: { request, ruleId },
        })
        .expect(200);

      expect(JSON.parse(response.text).errors).toBeFalsy();

      expect(ruleService.updateRule).toBeCalledWith(ruleId, request);
    });
  });
});
