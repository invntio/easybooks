import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  rootDir: 'src',
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'config',
    'interfaces',
    'jestGlobalMocks.ts',
    '.module.ts',
    'main.ts',
    '.mock.ts',
  ],
  testEnvironment: 'node',
  moduleNameMapper: {
    '@modules/(.*)': '<rootDir>/modules/$1',
    '@common/(.*)': '<rootDir>/common/$1',
    '@config/(.*)': '<rootDir>/config/$1',
  },
};

export default config;
