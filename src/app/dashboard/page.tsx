'use client';

import { useEffect, useState } from 'react';
import { StudyTimeChart, ReadingProgressChart, ProjectProgressChart } from '@/components/dashboard/ChartComponents';

interface DashboardData {
  studyTimeData: {
    labels: string[];
    durations: number[];
  };
  readingProgressData: {
    labels: string[];
    progress: number[];
  };
  totalStudyTime: number;
  activeBooks: number;
}

interface ProjectStats {
  projectProgressData: {
    labels: string[];
    completed: number[];
    inProgress: number[];
  };
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, projectsResponse] = await Promise.all([
          fetch('/api/statistics'),
          fetch('/api/projects/statistics')
        ]);

        if (!statsResponse.ok || !projectsResponse.ok) {
          throw new Error('获取数据失败');
        }

        const statsData = await statsResponse.json();
        const projectsData = await projectsResponse.json();

        setDashboardData(statsData);
        setProjectStats(projectsData);
      } catch (err) {
        setError('加载数据时出错');
        console.error('加载仪表盘数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">个人学习仪表盘</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 学习时长统计 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">学习时长统计</h2>
          {dashboardData && (
            <>
              <div className="mb-4">
                <p className="text-gray-600">最近7天总学习时长：{dashboardData.totalStudyTime} 分钟</p>
              </div>
              <StudyTimeChart data={dashboardData.studyTimeData} />
            </>
          )}
        </div>

        {/* 阅读进度追踪 */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">阅读进度追踪</h2>
          {dashboardData && (
            <>
              <div className="mb-4">
                <p className="text-gray-600">当前在读书籍：{dashboardData.activeBooks} 本</p>
              </div>
              <ReadingProgressChart data={dashboardData.readingProgressData} />
            </>
          )}
        </div>

        {/* 项目完成进度 */}
        <div className="bg-white p-6 rounded-lg shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">项目完成进度</h2>
          {projectStats && (
            <>
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-gray-600">总项目数</p>
                  <p className="text-2xl font-bold">{projectStats.totalGoals}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">已完成项目</p>
                  <p className="text-2xl font-bold">{projectStats.completedGoals}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">完成率</p>
                  <p className="text-2xl font-bold">{projectStats.completionRate.toFixed(1)}%</p>
                </div>
              </div>
              <ProjectProgressChart data={projectStats.projectProgressData} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}