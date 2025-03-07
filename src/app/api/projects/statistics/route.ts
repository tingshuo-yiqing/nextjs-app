import { NextResponse } from 'next/server';
import { Goal } from '@/models';
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

    // 获取所有项目
    const goals = await Goal.find({
      userId: session.user.id
    }).sort({ targetDate: 1 });

    // 按类别分组统计项目状态
    const categoryStats = {};
    goals.forEach(goal => {
      if (!categoryStats[goal.category]) {
        categoryStats[goal.category] = {
          completed: 0,
          inProgress: 0,
          pending: 0
        };
      }
      categoryStats[goal.category][goal.status]++;
    });

    // 处理项目进度数据
    const projectProgressData = {
      labels: Object.keys(categoryStats),
      completed: Object.values(categoryStats).map(stat => stat.completed),
      inProgress: Object.values(categoryStats).map(stat => stat.inProgress)
    };

    // 计算总体完成率
    const totalGoals = goals.length;
    const completedGoals = goals.filter(goal => goal.status === 'completed').length;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return NextResponse.json({
      projectProgressData,
      totalGoals,
      completedGoals,
      completionRate,
      categoryStats
    });
  } catch (error) {
    console.error('获取项目统计数据失败:', error);
    return NextResponse.json({ error: '获取项目统计数据失败' }, { status: 500 });
  }
}