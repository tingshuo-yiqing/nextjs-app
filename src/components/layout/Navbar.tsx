'use client';

import { useState } from 'react';
// 需要先安装 next-themes 包
// 运行: npm install next-themes
// 或者: yarn add next-themes
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navigation = [
    { name: '首页', href: '/' },
    { name: '学习笔记', href: '/notes' },
    { name: '生活日记', href: '/diaries' },
    { name: '学习目标', href: '/goals' },
    { name: '数据统计', href: '/statistics' },
  ];

  return (
    <nav className="bg-background border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                学习助手
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400
                    inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400
                  hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800
                block pl-3 pr-4 py-2 text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}