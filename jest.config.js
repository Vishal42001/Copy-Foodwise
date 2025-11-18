/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // Mock CSS/asset imports which Jest can't handle
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // Automatically mock the geminiService for all tests
  moduleDirectories: ['node_modules', '<rootDir>'],
};

module.exports = config;
