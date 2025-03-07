import mongoose from 'mongoose';

// 用户模型
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 学习笔记模型
const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 生活日记模型
const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },
  weather: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 学习目标模型
const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  status: { type: String, enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' },
  progress: { type: Number, default: 0 },
  type: { type: String, enum: ['short_term', 'long_term'], default: 'short_term' },
  points: { type: Number, default: 0 },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 数据统计模型
const statisticSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noteCount: { type: Number, default: 0 },
  diaryCount: { type: Number, default: 0 },
  completedGoals: { type: Number, default: 0 },
  studyTime: { type: Number, default: 0 }, // 单位：分钟
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 导出模型
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export const Diary = mongoose.models.Diary || mongoose.model('Diary', diarySchema);
export const Goal = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
export const Statistic = mongoose.models.Statistic || mongoose.model('Statistic', statisticSchema);