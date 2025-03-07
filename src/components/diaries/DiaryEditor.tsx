'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPinIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '../notes/MarkdownEditor';

interface DiaryEditorProps {
  initialData?: {
    title: string;
    content: string;
    location?: string;
    mood?: string;
    isPrivate?: boolean;
  };
  onSubmit: (data: {
    title: string;
    content: string;
    location?: string;
    mood?: string;
    isPrivate: boolean;
  }) => Promise<void>;
  isEditing?: boolean;
}

const moodOptions = [
  '开心', '平静', '疲惫', '兴奋',
  '伤心', '生气', '焦虑', '充满希望'
];

export default function DiaryEditor({
  initialData = {
    title: '',
    content: '',
    location: '',
    mood: '',
    isPrivate: true
  },
  onSubmit,
  isEditing = false
}: DiaryEditorProps) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [location, setLocation] = useState(initialData.location);
  const [mood, setMood] = useState(initialData.mood);
  const [isPrivate, setIsPrivate] = useState(initialData.isPrivate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('请填写标题和内容');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        location: location?.trim(),
        mood: mood?.trim(),
        isPrivate: isPrivate ?? true // 确保 isPrivate 始终为 boolean 类型
      });
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          标题
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
            shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700
            dark:text-white sm:text-sm"
          required
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <MapPinIcon className="inline-block w-5 h-5 mr-1" />
            位置
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="添加位置标记"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
              shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700
              dark:text-white sm:text-sm"
          />
        </div>

        <div className="flex-1">
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <FaceSmileIcon className="inline-block w-5 h-5 mr-1" />
            心情
          </label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
              shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700
              dark:text-white sm:text-sm"
          >
            <option value="">选择心情</option>
            {moodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          内容
        </label>
        <div className="mt-1">
          <MarkdownEditor
            initialValue={content}
            onChange={(value) => setContent(value || '')}
            height={400}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500
              border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            设为私密日记
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent
            shadow-sm text-sm font-medium rounded-md text-white bg-primary-600
            hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : (isEditing ? '更新日记' : '创建日记')}
        </button>
      </div>
    </form>
  );
}