import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, '请输入笔记标题'],
      trim: true,
      maxlength: [100, '标题不能超过100个字符']
    },
    content: {
      type: String,
      required: [true, '请输入笔记内容'],
      trim: true
    },
    category: {
      type: String,
      required: [true, '请选择笔记分类'],
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// 添加全文搜索索引
NoteSchema.index(
  {
    title: 'text',
    content: 'text',
    category: 'text',
    tags: 'text'
  },
  {
    weights: {
      title: 10,
      content: 5,
      category: 3,
      tags: 2
    }
  }
);

// 添加常用查询索引
NoteSchema.index({ author: 1, createdAt: -1 });
NoteSchema.index({ category: 1 });
NoteSchema.index({ tags: 1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);