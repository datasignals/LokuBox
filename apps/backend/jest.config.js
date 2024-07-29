// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/test/**/*.test.ts'],
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.json',
      },
    },
  };