/* eslint-disable @typescript-eslint/no-var-requires */
const tsconfig = require('./tsconfig');
const { resolve } = require('path');

const nameMapper = Object.entries(tsconfig.compilerOptions.paths).map(
  ([key, value]) => {
    const newKey = `^${key.replace('*', '(.*)$')}`;
    const newValue = value.map((path) => {
      return path === '*'
        ? resolve(__dirname, './src/$1')
        : resolve(__dirname, `./src/${path.replace('/*', '/$1')}`);
    });

    return [newKey, newValue];
  },
);

module.exports = {
  moduleNameMapper: Object.fromEntries(nameMapper),
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/dist',
    '/coverage',
    '/__testUtils__/',
    '/node_modules',
  ],
  testMatch: ['**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setupTests.ts'],
  setupFiles: ['<rootDir>/src/__tests__/__testUtils__/setupEnv.ts'],
};
