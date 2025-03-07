'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NoteListProps {
  notes: Note[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function NoteList({
  notes,
  totalPages,
  currentPage,
  onPageChange,
  onDelete
}: NoteListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这篇笔记吗？')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
              border border-gray-200 dark:border-gray-700 hover:border-primary-500
              dark:hover:border-primary-500 transition-colors"
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link
                  href={`/notes/${note.id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white
                    hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {note.title}
                </Link>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                  font-medium bg-primary-100 text-primary-800 dark:bg-primary-900
                  dark:text-primary-200">
                  {note.category}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs
                      font-medium bg-gray-100 text-gray-800 dark:bg-gray-700
                      dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href={`/notes/${note.id}/edit`}
                  className="text-sm text-primary-600 hover:text-primary-700
                    dark:text-primary-400 dark:hover:text-primary-300"
                >
                  编辑
                </Link>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deletingId === note.id}
                  className="text-sm text-red-600 hover:text-red-700
                    dark:text-red-400 dark:hover:text-red-300
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === note.id ? '删除中...' : '删除'}
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