import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  profile: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '用户名是必需的'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少需要3个字符'],
      maxlength: [20, '用户名不能超过20个字符']
    },
    email: {
      type: String,
      required: [true, '邮箱是必需的'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
    },
    password: {
      type: String,
      required: [true, '密码是必需的'],
      minlength: [6, '密码至少需要6个字符']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    profile: {
      name: {
        type: String,
        default: ''
      },
      avatar: String,
      bio: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    timestamps: true
  }
);

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 密码比对方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;