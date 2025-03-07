import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models';
import { SignJWT } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // 验证请求数据
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: '请提供所有必需的字段' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {    // 验证请求数据
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: '请提供所有必需的字段' },
        { status: 400 }
      );
    }

    // 连接数据库
    await connectToDatabase();

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
      return NextResponse.json(
        { success: false, message: '用户名已被使用' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: '邮箱已被注册' },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      profile: { name: username }
    });

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
      { success: true, message: '注册成功' },
      { status: 201 }
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
    console.error('注册错误:', error);
    return NextResponse.json(
      { success: false, message: '注册失败', error: error.message },
      { status: 500 }
    );
  }
}