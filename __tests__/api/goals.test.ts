import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/goals/route';
import { Goal } from '@/models';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// 模拟getServerSession
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com'
    }
  }))
}));

// 模拟NextRequest
const createMockRequest = (method: string, body?: any, searchParams?: Record<string, string>) => {
  const request = {
    json: jest.fn().mockResolvedValue(body || {}),
    nextUrl: {
      searchParams: new URLSearchParams()
    }
  } as unknown as NextRequest;

  // 添加搜索参数
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      request.nextUrl.searchParams.set(key, value);
    });
  }

  return request;
};

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // 创建内存MongoDB服务器用于测试
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  // 断开连接并停止服务器
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // 每次测试前清空集合
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Goals API', () => {
  describe('GET /api/goals', () => {
    it('应该返回用户的目标列表', async () => {
      // 创建测试数据
      const userId = 'test-user-id';
      await Goal.create([
        {
          title: '测试目标1',
          description: '描述1',
          type: 'short_term',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          userId,
          status: 'not_started'
        },
        {
          title: '测试目标2',
          description: '描述2',
          type: 'long_term',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          priority: 'high',
          userId,
          status: 'in_progress'
        }
      ]);

      // 调用API
      const req = createMockRequest('GET');
      const res = await GET(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(200);
      expect(data.goals.length).toBe(2);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.total).toBe(2);
    });

    it('应该根据查询参数过滤目标', async () => {
      // 创建测试数据
      const userId = 'test-user-id';
      await Goal.create([
        {
          title: '短期目标',
          description: '描述1',
          type: 'short_term',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          userId,
          status: 'not_started'
        },
        {
          title: '长期目标',
          description: '描述2',
          type: 'long_term',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          priority: 'high',
          userId,
          status: 'in_progress'
        }
      ]);

      // 调用API并按类型过滤
      const req = createMockRequest('GET', null, { type: 'short_term' });
      const res = await GET(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(200);
      expect(data.goals.length).toBe(1);
      expect(data.goals[0].title).toBe('短期目标');
    });
  });

  describe('POST /api/goals', () => {
    it('应该创建新目标', async () => {
      const goalData = {
        title: '新目标',
        description: '新目标描述',
        type: 'short_term',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium'
      };

      // 调用API
      const req = createMockRequest('POST', goalData);
      const res = await POST(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(200);
      expect(data.title).toBe(goalData.title);
      expect(data.userId).toBe('test-user-id');
      expect(data.status).toBe('not_started');
      expect(data.progress).toBe(0);

      // 验证数据库中是否存在
      const savedGoal = await Goal.findById(data._id);
      expect(savedGoal).toBeDefined();
      expect(savedGoal!.title).toBe(goalData.title);
    });
  });

  describe('PUT /api/goals', () => {
    it('应该更新现有目标', async () => {
      // 创建测试目标
      const goal = await Goal.create({
        title: '测试目标',
        description: '描述',
        type: 'short_term',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        userId: 'test-user-id',
        status: 'not_started'
      });

      // 更新数据
      const updateData = {
        id: goal._id.toString(),
        title: '更新后的标题',
        status: 'in_progress',
        progress: 50
      };

      // 调用API
      const req = createMockRequest('PUT', updateData);
      const res = await PUT(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(200);
      expect(data.title).toBe(updateData.title);
      expect(data.status).toBe(updateData.status);
      expect(data.progress).toBe(updateData.progress);

      // 验证数据库中是否更新
      const updatedGoal = await Goal.findById(goal._id);
      expect(updatedGoal!.title).toBe(updateData.title);
    });

    it('完成目标时应该分配积分', async () => {
      // 创建测试目标
      const goal = await Goal.create({
        title: '测试目标',
        description: '描述',
        type: 'long_term',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        priority: 'high',
        userId: 'test-user-id',
        status: 'in_progress',
        progress: 80
      });

      // 更新为已完成
      const updateData = {
        id: goal._id.toString(),
        status: 'completed',
        progress: 100
      };

      // 调用API
      const req = createMockRequest('PUT', updateData);
      const res = await PUT(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(200);
      expect(data.status).toBe('completed');
      expect(data.points).toBe(100); // 长期目标应得100分

      // 验证数据库中是否更新
      const updatedGoal = await Goal.findById(goal._id);
      expect(updatedGoal!.points).toBe(100);
    });
  });

  describe('DELETE /api/goals', () => {
    it('应该删除目标', async () => {
      // 创建测试目标
      const goal = await Goal.create({
        title: '测试目标',
        description: '描述',
        type: 'short_term',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        userId: 'test-user-id',
        status: 'not_started'
      });

      // 调用API
      const req = createMockRequest('DELETE', null, { id: goal._id.toString() });
      const res = await DELETE(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(200);
      expect(data.message).toBe('目标删除成功');

      // 验证数据库中是否删除
      const deletedGoal = await Goal.findById(goal._id);
      expect(deletedGoal).toBeNull();
    });

    it('删除不存在的目标应返回404', async () => {
      // 调用API
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const req = createMockRequest('DELETE', null, { id: nonExistentId });
      const res = await DELETE(req);
      const data = await res.json();

      // 验证结果
      expect(res.status).toBe(404);
      expect(data.error).toBe('目标不存在');
    });
  });
});