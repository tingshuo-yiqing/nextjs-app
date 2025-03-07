import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Goal } from '@/models';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // 创建内存MongoDB服务器用于测试
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
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

describe('Goal Model', () => {
  it('应该成功创建一个目标', async () => {
    const mockGoalData = {
      title: '测试目标',
      description: '这是一个测试目标',
      type: 'short_term',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      userId: new mongoose.Types.ObjectId(),
    };

    const goal = new Goal(mockGoalData);
    const savedGoal = await goal.save();

    // 验证保存的目标
    expect(savedGoal._id).toBeDefined();
    expect(savedGoal.title).toBe(mockGoalData.title);
    expect(savedGoal.description).toBe(mockGoalData.description);
    expect(savedGoal.type).toBe(mockGoalData.type);
    expect(savedGoal.status).toBe('not_started'); // 默认状态
    expect(savedGoal.progress).toBe(0); // 默认进度
  });

  it('缺少必填字段时应该失败', async () => {
    const invalidGoal = new Goal({
      // 缺少必填字段
      title: '测试目标',
    });

    // 使用try/catch捕获验证错误
    let error;
    try {
      await invalidGoal.save();
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
  });

  it('应该正确更新目标状态', async () => {
    // 创建测试目标
    const goal = new Goal({
      title: '测试目标',
      description: '这是一个测试目标',
      type: 'short_term',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'medium',
      userId: new mongoose.Types.ObjectId(),
    });
    await goal.save();

    // 更新状态为进行中
    goal.status = 'in_progress';
    goal.progress = 50;
    await goal.save();

    // 从数据库重新获取并验证
    const updatedGoal = await Goal.findById(goal._id);
    expect(updatedGoal).toBeDefined();
    expect(updatedGoal!.status).toBe('in_progress');
    expect(updatedGoal!.progress).toBe(50);
  });
});