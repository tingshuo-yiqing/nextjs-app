'use client';

import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon, PencilSquareIcon, ChartBarIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const features = [
    {
      name: "学习笔记",
      description: "记录学习过程中的重要知识点和心得体会",
      icon: BookOpenIcon,
      href: "/notes"
    },
    {
      name: "生活日记",
      description: "记录每一天的生活点滴和感悟",
      icon: PencilSquareIcon,
      href: "/diaries"
    },
    {
      name: "学习目标",
      description: "设定并追踪你的学习目标和进度",
      icon: CalendarIcon,
      href: "/goals"
    },
    {
      name: "数据统计",
      description: "可视化展示你的学习情况和进步",
      icon: ChartBarIcon,
      href: "/statistics"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* 英雄区域 */}
      <section className="bg-ivory-200 dark:bg-gray-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
                简洁高效的<span className="text-primary-600">学习管理平台</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                帮助你管理学习目标、记录笔记和日记，追踪学习进度，提高学习效率。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/goals" 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors shadow-sm"
                >
                  开始使用
                </Link>
                <Link 
                  href="/statistics" 
                  className="bg-ivory-100 dark:bg-gray-800 hover:bg-ivory-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-md font-medium transition-colors shadow-sm border border-ivory-300 dark:border-gray-700"
                >
                  查看统计
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80 bg-ivory-100 dark:bg-gray-800 rounded-lg shadow-custom overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900 dark:to-gray-800 opacity-50"></div>
                <div className="relative p-6 flex flex-col justify-center items-center h-full">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">学习进度概览</h3>
                  <div className="w-full bg-ivory-300 dark:bg-gray-700 rounded-full h-4 mb-2">
                    <div className="bg-primary-600 h-4 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">本周学习目标完成度: 65%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能特点 */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">主要功能</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">全方位满足你的学习管理需求</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Link 
                key={feature.name} 
                href={feature.href}
                className="bg-ivory-100 dark:bg-gray-900 rounded-lg p-6 shadow-custom hover:shadow-lg transition-all hover:translate-y-[-4px] border border-ivory-200 dark:border-gray-700"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{feature.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 使用说明 */}
      <section className="py-16 bg-ivory-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">如何使用</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">简单几步，开始你的学习之旅</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-custom border border-ivory-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">{step}</span>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {step === 1 ? '设定目标' : step === 2 ? '记录进度' : '查看统计'}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {step === 1 
                    ? '在学习目标页面创建短期和长期学习目标' 
                    : step === 2 
                    ? '记录每日学习笔记和进度，更新目标完成情况' 
                    : '查看数据统计，了解自己的学习情况和进步'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-ivory-200 dark:bg-gray-900 py-8 border-t border-ivory-300 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">© 2023 学习助手. 保留所有权利.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">关于我们</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">使用条款</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
