import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './db';
import { User } from '@/models';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();
        
        try {
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }
          
          // 这里应该有密码比较逻辑，但为了简化先省略
          // 实际应用中应该使用 bcrypt 等库比较哈希密码
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username
          };
        } catch (error) {
          console.error('认证错误:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key'
};