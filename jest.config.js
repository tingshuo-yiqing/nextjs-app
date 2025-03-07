const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 指定Next.js应用的根目录，用于加载next.config.js和.env文件
  dir: './'
});

// Jest配置
const customJestConfig = {
  // 添加更多自定义配置
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 处理模块别名
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};

// createJestConfig会自动处理一些配置，比如转换路径别名
module.exports = createJestConfig(customJestConfig);