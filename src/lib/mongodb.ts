import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-app';

if (!MONGODB_URI) {
  throw new Error('请在环境变量中设置 MONGODB_URI');
}

export async function connect() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接失败:', error);
    throw error;
  }
}

export async function disconnect() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB断开连接');
  } catch (error) {
    console.error('MongoDB断开连接失败:', error);
    throw error;
  }
}