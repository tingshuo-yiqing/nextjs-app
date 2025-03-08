import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-app';

export async function connectToDatabase() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('成功连接到数据库');
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}