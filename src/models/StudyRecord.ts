import mongoose, { Schema, Document } from 'mongoose';

export interface IStudyRecord extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  duration: number; // 学习时长（分钟）
  subject: string; // 学习科目
  notes: string; // 学习笔记
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookRecord extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  startDate: Date;
  lastReadDate: Date;
  status: 'reading' | 'completed' | 'planned';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const studyRecordSchema = new Schema<IStudyRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    duration: {
      type: Number,
      required: true,
      min: 0
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

const bookRecordSchema = new Schema<IBookRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    totalPages: {
      type: Number,
      required: true,
      min: 1
    },
    currentPage: {
      type: Number,
      default: 0,
      min: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    lastReadDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['reading', 'completed', 'planned'],
      default: 'planned'
    },
    notes: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// 添加索引以提高查询性能
studyRecordSchema.index({ userId: 1, date: -1 });
bookRecordSchema.index({ userId: 1, status: 1 });

export const StudyRecord = mongoose.models.StudyRecord || mongoose.model<IStudyRecord>('StudyRecord', studyRecordSchema);
export const BookRecord = mongoose.models.BookRecord || mongoose.model<IBookRecord>('BookRecord', bookRecordSchema);