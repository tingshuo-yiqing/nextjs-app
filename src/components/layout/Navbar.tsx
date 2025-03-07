'use client';

import { useState } from 'react';
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
    <nav className="bg-ivory-200 dark:bg-gray-900 shadow-custom sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                学习助手
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400
                    inline-flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-ivory-300 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400
                hover:bg-ivory-300 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换主题"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300
                  hover:text-primary-600 hover:bg-ivory-300 dark:hover:bg-gray-800 transition-colors"
                aria-expanded={isOpen}
                aria-label="主菜单"
              >
                {isOpen ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-ivory-100 dark:bg-gray-800 shadow-lg`}>
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400
                block px-4 py-2 text-base font-medium hover:bg-ivory-300 dark:hover:bg-gray-700 transition-colors"
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