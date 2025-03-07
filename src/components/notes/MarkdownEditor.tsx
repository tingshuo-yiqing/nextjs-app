'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// 动态导入MD编辑器组件以避免SSR问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string | undefined) => void;
  height?: number;
  preview?: 'live' | 'edit' | 'preview';
}

export default function MarkdownEditor({
  initialValue = '',
  onChange,
  height = 400,
  preview = 'live'
}: MarkdownEditorProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string | undefined) => {
    setValue(newValue || '');
    onChange?.(newValue);
  };

  return (
    <div data-color-mode="light" className="w-full">
      <MDEditor
        value={value}
        onChange={handleChange}
        height={height}
        preview={preview}
        className="w-full"
      />
    </div>
  );
}