'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPinIcon, FaceSmileIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Diary {
  id: string;
  title: string;
  content: string;
  location?: string;
  mood?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DiaryListProps {
  diaries: Diary[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function DiaryList({
  diaries,
  totalPages,
  currentPage,
  onPageChange,
  onDelete
}: DiaryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这篇日记吗？')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-8">
        {diaries.map((diary) => (
          <div
            key={diary.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
              border border-gray-200 dark:border-gray-700 hover:border-primary-500
              dark:hover:border-primary-500 transition-colors"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Link
                  href={`/diaries/${diary.id}`}
                  className="text-xl font-semibold text-gray-900 dark:text-white
                    hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {diary.title}
                </Link>
                <div className="flex items-center space-x-2">
                  {diary.isPrivate && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100
                      text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
                      私密
                    </span>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(diary.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                {diary.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    {diary.location}
                  </div>
                )}
                {diary.mood && (
                  <div className="flex items-center">
                    <FaceSmileIcon className="w-4 h-4 mr-1" />
                    {diary.mood}
                  </div>
                )}
              </div>

              <div className="mb-4 text-gray-600 dark:text-gray-300 line-clamp-3">
                {diary.content}
              </div>

              <div className="flex justify-end space-x-4">
                <Link
                  href={`/diaries/${diary.id}/edit`}
                  className="text-sm text-primary-600 hover:text-primary-700
                    dark:text-primary-400 dark:hover:text-primary-300"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(diary.id)}
                  disabled={deletingId === diary.id}
                  className="text-sm text-red-600 hover:text-red-700
                    dark:text-red-400 dark:hover:text-red-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === diary.id ? '删除中...' : '删除'}
                </button>
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