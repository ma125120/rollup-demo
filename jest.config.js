module.exports = {
  collectCoverageFrom: [
    'packages/*/src/**/*',
    '!**/index.ts*',
    '!**/*test*/**',
    '!**/*fixture*/**',
    '!**/*template*/**',
    '!**/*stories*',
    '!**/*.development.*',
  ],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/scripts/styleMock.js',
  },
  testEnvironment: 'jsdom',
  testRegex: '(test|spec).tsx?$',
  transform: {
    '.*': ['ts-jest'],
  },
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTests.ts'],
};
