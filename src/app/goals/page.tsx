'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlusIcon, FilterIcon } from 'lucide-react';
import GoalForm from '@/components/goals/GoalForm';

export default function GoalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({ type: '', status: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchGoals();
    }
  }, [status, router, filters]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.status) queryParams.append('status', filters.status);
      
      const res = await fetch(`/api/goals?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setGoals(data.goals);
      } else {
        console.error('获取目标失败:', data.error);
      }
    } catch (error) {
      console.error('获取目标出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      
      if (res.ok) {
        setShowForm(false);
        fetchGoals();
      } else {
        const data = await res.json();
        console.error('创建目标失败:', data.error);
      }
    } catch (error) {
      console.error('创建目标出错:', error);
    }
  };

  const handleUpdateGoal = async (id, updateData) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      });
      
      if (res.ok) {
        fetchGoals();
      } else {
        const data = await res.json();
        console.error('更新目标失败:', data.error);
      }
    } catch (error) {
      console.error('更新目标出错:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (confirm('确定要删除这个目标吗？')) {
      try {
        const res = await fetch(`/api/goals?id=${id}`, {
          method: 'DELETE'
        });
        
        if (res.ok) {
          fetchGoals();
        } else {
          const data = await res.json();
          console.error('删除目标失败:', data.error);
        }
      } catch (error) {
        console.error('删除目标出错:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'not_started': return 'bg-gray-200 text-gray-800';
      case 'in_progress': return 'bg-blue-200 text-blue-800';
      case 'completed': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'not_started': return '未开始';
      case 'in_progress': return '进行中';
      case 'completed': return '已完成';
      default: return '未知状态';
    }
  };

  if (status === 'loading') {
    return <div className="flex justify-center p-8">加载中...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">学习目标</h1>
        <Button onClick={() => setShowForm(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> 创建目标
        </Button>
      </div>

      {/* 筛选器 */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select 
          className="border rounded p-2"
          value={filters.type}
          onChange={(e) => setFilters({...filters, type: e.target.value})}
        >
          <option value="">所有类型</option>
          <option value="short_term">短期目标</option>
          <option value="long_term">长期目标</option>
        </select>
        
        <select 
          className="border rounded p-2"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">所有状态</option>
          <option value="not_started">未开始</option>
          <option value="in_progress">进行中</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      {/* 目标列表 */}
      {loading ? (
        <div className="text-center p-8">加载中...</div>
      ) : goals.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">暂无学习目标</p>
          <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
            创建第一个目标
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{goal.title}</CardTitle>
                  <Badge className={getStatusColor(goal.status)}>
                    {getStatusText(goal.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{goal.description}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>进度</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="flex justify-between mt-4">
                  <Badge variant="outline">
                    {goal.type === 'short_term' ? '短期' : '长期'}
                  </Badge>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateGoal(goal._id, {
                        status: 'in_progress',
                        progress: Math.min(goal.progress + 10, 100)
                      })}
                    >
                      更新进度
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteGoal(goal._id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 创建目标表单 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">创建新目标</h2>
            <GoalForm 
              onSubmit={handleCreateGoal} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}