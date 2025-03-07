import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  title: string;
  description: string;
  type: 'short_term' | 'long_term';
  startDate: Date;
  endDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  milestones: {
    title: string;
    completed: boolean;
    completedAt?: Date;
  }[];
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | null;
  lastReminderSent?: Date;
  points: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['short_term', 'long_term'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    milestones: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        completedAt: Date,
      },
    ],
    reminderFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', null],
      default: null,
    },
    lastReminderSent: Date,
    points: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);