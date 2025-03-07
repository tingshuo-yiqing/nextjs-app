import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // 不需要验证的公开路由
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password',
  ];

  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: '未授权访问' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  try {
    // 验证JWT令牌
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: '无效的令牌' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }
    );
  }
}

// 配置需要进行身份验证的路由
export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/notes/:path*',
    '/api/diaries/:path*',
    '/api/goals/:path*',
    '/api/statistics/:path*',
  ],
};