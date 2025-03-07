import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Goal from '@/models/Goal';
import { connectToDatabase } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectToDatabase();

    const query: any = { userId: session.user.id };
    if (type) query.type = type;
    if (status) query.status = status;

    const [goals, total] = await Promise.all([
      Goal.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Goal.countDocuments(query)
    ]);

    return NextResponse.json({
      goals,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('获取目标列表失败:', error);
    return NextResponse.json({ error: '获取目标列表失败' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const data = await req.json();
    await connectToDatabase();

    const goal = new Goal({
      ...data,
      userId: session.user.id,
      status: 'not_started',
      progress: 0,
      points: 0
    });

    await goal.save();
    return NextResponse.json(goal);
  } catch (error) {
    console.error('创建目标失败:', error);
    return NextResponse.json({ error: '创建目标失败' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const data = await req.json();
    const { id, ...updateData } = data;

    await connectToDatabase();
    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      updateData,
      { new: true }
    );

    if (!goal) {
      return NextResponse.json({ error: '目标不存在' }, { status: 404 });
    }

    // 检查目标是否完成，分配积分
    if (updateData.status === 'completed' && goal.status !== 'completed') {
      const points = goal.type === 'long_term' ? 100 : 50;
      goal.points = points;
      await goal.save();
    }

    return NextResponse.json(goal);
  } catch (error) {
    console.error('更新目标失败:', error);
    return NextResponse.json({ error: '更新目标失败' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: '缺少目标ID' }, { status: 400 });
    }

    await connectToDatabase();
    const goal = await Goal.findOneAndDelete({
      _id: id,
      userId: session.user.id
    });

    if (!goal) {
      return NextResponse.json({ error: '目标不存在' }, { status: 404 });
    }

    return NextResponse.json({ message: '目标删除成功' });
  } catch (error) {
    console.error('删除目标失败:', error);
    return NextResponse.json({ error: '删除目标失败' }, { status: 500 });
  }
}