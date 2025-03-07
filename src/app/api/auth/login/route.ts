import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import User from '@/models/User';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // 验证请求数据
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: '请提供用户名和密码' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connect();

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 验证密码
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 生成JWT令牌
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-secret-key'
    );
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    // 设置cookie
    const response = NextResponse.json(
      { success: true, message: '登录成功' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { success: false, message: '登录失败', error: error.message },
      { status: 500 }
    );
  }
}