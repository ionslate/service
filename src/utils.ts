import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { Dictionary } from '@mikro-orm/core';
import { IPrimaryKeyValue } from '@mikro-orm/core/typings';
import { readFile } from 'fs';
import globby from 'globby';
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';
import { promisify } from 'util';

const asyncReadFile = promisify(readFile);

export const generateId = customAlphabet(nolookalikesSafe, 12);

export type Page<T> = {
  content: T[];
  count: number;
  limit?: number;
  page: number;
  last: boolean;
};

export const paginateEntites = <T>(
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

export async function parseSchema(): Promise<string[]> {
  const paths = await globby('src/**/*.graphql');
  return await Promise.all(paths.map((path) => asyncReadFile(path, 'utf-8')));
}

export function findOneOrFailHandler(
  entityName: string,
  _where: Dictionary<never> | IPrimaryKeyValue,
): ResourceNotFound {
  return new ResourceNotFound(`${entityName.replace('Entity', '')} not found`);
}
