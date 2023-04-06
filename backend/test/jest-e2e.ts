import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  rootDir: '../.',
  modulePaths: ['<rootDir>'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@modules/(.*)': '<rootDir>/src/modules/$1',
    '@common/(.*)': '<rootDir>/src/common/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
  },
};

export default config;
