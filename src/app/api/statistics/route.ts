import { NextResponse } from 'next/server';
import { StudyRecord, BookRecord } from '@/models/StudyRecord';
import { connectDB } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    await connectDB();

    // 获取最近7天的学习记录
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const studyRecords = await StudyRecord.find({
      userId: session.user.id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    // 获取正在阅读的书籍
    const bookRecords = await BookRecord.find({
      userId: session.user.id,
      status: 'reading'
    });

    // 处理学习时长数据
    const studyTimeData = {
      labels: [],
      durations: []
    };

    // 初始化最近7天的数据
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      studyTimeData.labels.push(dateStr);
      studyTimeData.durations.push(0);
    }

    // 填充实际的学习时长数据
    studyRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      const index = studyTimeData.labels.indexOf(dateStr);
      if (index !== -1) {
        studyTimeData.durations[index] += record.duration;
      }
    });

    // 处理阅读进度数据
    const readingProgressData = {
      labels: bookRecords.map(book => book.title),
      progress: bookRecords.map(book => (book.currentPage / book.totalPages) * 100)
    };

    return NextResponse.json({
      studyTimeData,
      readingProgressData,
      totalStudyTime: studyTimeData.durations.reduce((a, b) => a + b, 0),
      activeBooks: bookRecords.length
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}