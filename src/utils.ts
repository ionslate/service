import { AmmoLoader } from '@content-manager/ammo/loaders/AmmoLoader';
import { AmmoService } from '@content-manager/ammo/services/AmmoService';
import { RuleService } from '@content-manager/common/services/RuleService';
import { Container } from '@root/container';
import { ContextFunction } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import { readFileSync } from 'fs';
import globby from 'globby';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';

export const generateId = customAlphabet(nolookalikesSafe, 12);

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
