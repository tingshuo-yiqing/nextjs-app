/**
 * 数据备份脚本
 * 用于将MongoDB数据库中的数据导出到JSON文件
 * 使用方法: npm run backup
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// 导入模型
require('../src/models');

// 数据库连接URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-app';

// 备份目录
const BACKUP_DIR = path.join(__dirname, '../backups');

// 确保备份目录存在
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 获取当前日期时间作为文件名
const getBackupFileName = () => {
  const now = new Date();
  return `backup-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}.json`;
};

// 连接数据库并执行备份
async function backup() {
  try {
    console.log('正在连接数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');

    // 获取所有集合
    const collections = mongoose.connection.collections;
    const backupData = {};

    // 遍历所有集合并获取数据
    for (const key in collections) {
      const collection = collections[key];
      console.log(`正在备份集合: ${collection.collectionName}`);
      
      // 获取集合中的所有文档
      const documents = await collection.find({}).toArray();
      backupData[collection.collectionName] = documents;
    }

    // 将数据写入文件
    const backupFileName = getBackupFileName();
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);
    
    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
    console.log(`备份完成，文件保存在: ${backupFilePath}`);

    // 清理旧备份文件（保留最近10个备份）
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-'))
      .map(file => path.join(BACKUP_DIR, file));
    
    if (files.length > 10) {
      // 按修改时间排序
      files.sort((a, b) => fs.statSync(a).mtime.getTime() - fs.statSync(b).mtime.getTime());
      
      // 删除最旧的文件
      const filesToDelete = files.slice(0, files.length - 10);
      filesToDelete.forEach(file => {
        fs.unlinkSync(file);
        console.log(`已删除旧备份文件: ${file}`);
      });
    }

  } catch (error) {
    console.error('备份过程中出错:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.disconnect();
    console.log('数据库连接已关闭');
    process.exit(0);
  }
}

// 执行备份
backup();