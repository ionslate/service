import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';

export const convertColToCamelCase = (
  row: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [camelCase(key), value]),
  );

export const convertColToSnakeCase = (
  row: Record<string, unknown>,
): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [snakeCase(key), value]),
  );
