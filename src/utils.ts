import { BaseEntity, Dictionary } from '@mikro-orm/core';
import { IPrimaryKeyValue } from '@mikro-orm/core/typings';
import { readFileSync } from 'fs';
import globby from 'globby';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';

export const generateId = customAlphabet(nolookalikesSafe, 12);

export type Page<T> = {
  content: T[];
  count: number;
  limit?: number;
  page: number;
  last: boolean;
};

export const paginateEntites = <T extends BaseEntity<T, keyof T, T>>(
  entities: T[],
  count: number,
  page?: number,
  limit?: number,
): Page<T> => {
  if (limit) {
    const pageCount = Math.ceil(count / limit) - 1;

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

export function findOneOrFailHandler(
  entityName: string,
  _where: Dictionary<never> | IPrimaryKeyValue,
): ResourceNotFound {
  return new ResourceNotFound(`${entityName.replace('Entity', '')} not found`);
}
