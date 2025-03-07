import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Goal from '@/models/Goal';
import { connectToDatabase } from '@/lib/db';
import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const { type, format, startDate, endDate } = await req.json();

    await connectToDatabase();

    // 获取指定时间范围内的目标数据
    const query: any = {
      userId: session.user.id,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const goals = await Goal.find(query).sort({ createdAt: -1 });

    // 生成HTML内容
    const htmlContent = generateHtmlContent(goals, type);

    if (format === 'html') {
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${type}-${startDate}-${endDate}.html"`
        }
      });
    }

    // 生成PDF
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${type}-${startDate}-${endDate}.pdf"`
      }
    });
  } catch (error) {
    console.error('导出文档失败:', error);
    return NextResponse.json({ error: '导出文档失败' }, { status: 500 });
  }
}

function generateHtmlContent(goals: any[], type: string) {
  const title = type === 'weekly' ? '周报' : '月报';
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const inProgressGoals = goals.filter(goal => goal.status === 'in_progress');
  const notStartedGoals = goals.filter(goal => goal.status === 'not_started');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; text-align: center; }
        h2 { color: #34495e; margin-top: 20px; }
        .goal-list { margin-left: 20px; }
        .goal-item { margin: 10px 0; }
        .status-completed { color: #27ae60; }
        .status-in-progress { color: #f39c12; }
        .status-not-started { color: #95a5a6; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      
      <h2>已完成的目标</h2>
      <div class="goal-list">
        ${completedGoals.map(goal => `
          <div class="goal-item status-completed">
            ${goal.title} - 完成时间: ${new Date(goal.updatedAt).toLocaleDateString()}
          </div>
        `).join('')}
      </div>

      <h2>进行中的目标</h2>
      <div class="goal-list">
        ${inProgressGoals.map(goal => `
          <div class="goal-item status-in-progress">
            ${goal.title} - 进度: ${goal.progress}%
          </div>
        `).join('')}
      </div>

      <h2>未开始的目标</h2>
      <div class="goal-list">
        ${notStartedGoals.map(goal => `
          <div class="goal-item status-not-started">
            ${goal.title} - 计划开始时间: ${new Date(goal.startDate).toLocaleDateString()}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `;
}