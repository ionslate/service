import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { readFileSync } from 'fs';
import globby from 'globby';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Container } from '@root/container';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';
import { RuleService } from '@content/common/services/RuleService';
import { DriverException, TableNotFoundException } from '@mikro-orm/core';
import { AmmoService } from '@content/ammo/services/AmmoService';
import { AmmoLoader } from '@content/ammo/loaders/AmmoLoader';

export const generateId = customAlphabet(nolookalikesSafe, 12);

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends Record<string, unknown>
    ? RecursivePartial<T[P]>
    : T[P];
};

export type Page<T> = {
  content: T[];
  count: number;
  limit?: number;
  page: number;
  last: boolean;
};

export const paginateEntites = async <T>(
  entities: T[],
  count: number,
  page?: number,
  limit?: number,
): Promise<Page<T>> => {
  if (limit) {
    const pageCount = Math.ceil(count / limit);

    return {
      content: entities,
      limit,
      count,
      page: page || 0,
      last: (page || 0) >= pageCount,
    };
  }

  return {
    content: entities,
    limit,
    count,
    page: 0,
    last: true,
  };
};

export function parseSchema(): string[] {
  return globby
    .sync('src/**/*.graphql')
    .map((path) => readFileSync(path, 'utf-8'));
}

export function formatError(e: GraphQLError): GraphQLFormattedError {
  console.log(e.extensions);
  if (
    [DriverException.name, TableNotFoundException.name].includes(
      e.extensions?.exception?.name,
    )
  ) {
    e.message = 'Internal server error...';
  }

  return {
    message: e.message,
    path: e.path,
    extensions: { code: e.extensions?.code },
  };
}

export type AppContext = {
  ruleService: RuleService;
  ammoService: AmmoService;
  ammoLoader: AmmoLoader;
};

export const createContext = (
  container: Container,
): ContextFunction<ExpressContext, AppContext> => () => ({
  ruleService: container.ruleService,
  ammoService: container.ammoService,
  ammoLoader: container.ammoLoader,
});
