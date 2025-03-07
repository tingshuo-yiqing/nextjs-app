// 导入测试环境所需的全局设置
import '@testing-library/jest-dom';

// 模拟Next.js的路由
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {}
  })
}));

// 模拟next-auth会话
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com'
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    status: 'authenticated'
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(() => Promise.resolve({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com'
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }))
}));

// 全局模拟fetch
global.fetch = jest.fn();

// 清除所有模拟
beforeEach(() => {
  jest.clearAllMocks();
});