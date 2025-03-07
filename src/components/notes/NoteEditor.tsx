'use client';

import { useState } from 'react';
import MarkdownEditor from './MarkdownEditor';

interface NoteEditorProps {
  initialData?: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  };
  onSubmit: (data: {
    title: string;
    content: string;
    category: string;
    tags: string[];
  }) => Promise<void>;
  isEditing?: boolean;
}

export default function NoteEditor({
  initialData = {
    title: '',
    content: '',
    category: '',
    tags: []
  },
  onSubmit,
  isEditing = false
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [category, setCategory] = useState(initialData.category);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData.tags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !category.trim()) {
      setError('请填写标题、内容和分类');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags
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

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          分类
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600
            shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700
            dark:text-white sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          标签
        </label>
        <div className="mt-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-sm
                  font-medium bg-primary-100 text-primary-700 dark:bg-primary-900
                  dark:text-primary-300"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-primary-600 hover:text-primary-800
                    dark:text-primary-400 dark:hover:text-primary-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="输入标签并按回车添加"
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600
              shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700
              dark:text-white sm:text-sm"
          />
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent
            shadow-sm text-sm font-medium rounded-md text-white bg-primary-600
            hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '保存中...' : (isEditing ? '更新笔记' : '创建笔记')}
        </button>
      </div>
    </form>
  );
}