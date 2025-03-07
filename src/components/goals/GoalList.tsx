'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'short_term' | 'long_term';
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  milestones: {
    title: string;
    completed: boolean;
    completedAt?: string;
  }[];
  points: number;
  createdAt: string;
  updatedAt: string;
}

interface GoalListProps {
  goals: Goal[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: Goal['status']) => Promise<void>;
}

export default function GoalList({
  goals,
  totalPages,
  currentPage,
  onPageChange,
  onDelete,
  onUpdateStatus
}: GoalListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个目标吗？')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: Goal['status']) => {
    setUpdatingId(id);
    try {
      await onUpdateStatus(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getStatusBadgeColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
              border border-gray-200 dark:border-gray-700 hover:border-primary-500
              dark:hover:border-primary-500 transition-colors"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/goals/${goal.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white
                    hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {goal.title}
                </Link>
                <span className={`text-sm font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority === 'high' ? '高优先级' : 
                   goal.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>

              <div className="mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                  font-medium ${getStatusBadgeColor(goal.status)}`}>
                  {goal.status === 'completed' ? '已完成' :
                   goal.status === 'in_progress' ? '进行中' : '未开始'}
                </span>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {goal.type === 'short_term' ? '短期目标' : '长期目标'}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  进度：{goal.progress}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <Link
                    href={`/goals/${goal.id}/edit`}
                    className="text-sm text-primary-600 hover:text-primary-700
                      dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    编辑
                  </Link>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    disabled={deletingId === goal.id}
                    className="text-sm text-red-600 hover:text-red-700
                      dark:text-red-400 dark:hover:text-red-300
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === goal.id ? '删除中...' : '删除'}
                  </button>
                </div>

                <select
                  value={goal.status}
                  onChange={(e) => handleStatusUpdate(goal.id, e.target.value as Goal['status'])}
                  disabled={updatingId === goal.id}
                  className="text-sm border border-gray-300 rounded-md
                    dark:border-gray-600 dark:bg-gray-700 dark:text-white
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="not_started">未开始</option>
                  <option value="in_progress">进行中</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300
              dark:border-gray-600 text-sm font-medium rounded-md text-gray-700
              dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50
              dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            上一页
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-3 py-2 border border-gray-300
              dark:border-gray-600 text-sm font-medium rounded-md text-gray-700
              dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50
              dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}