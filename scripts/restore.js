/**
 * 数据恢复脚本
 * 用于从JSON备份文件恢复数据到MongoDB数据库
 * 使用方法: npm run restore -- <备份文件名>
 * 例如: npm run restore -- backup-2023-12-01-10-30.json
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// 导入模型
require('../src/models');

// 数据库连接URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/study-assistant';

// 备份目录
const BACKUP_DIR = path.join(__dirname, '../backups');

// 获取命令行参数中的备份文件名
const getBackupFileName = () => {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    // 如果没有提供文件名，使用最新的备份文件
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(file => file.startsWith('backup-'))
      .map(file => path.join(BACKUP_DIR, file));
    
    if (files.length === 0) {
      console.error('没有找到备份文件');
      process.exit(1);
    }
    
    // 按修改时间排序，获取最新的备份文件
    files.sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());
    return path.basename(files[0]);
  }
  return args[0];
};

// 连接数据库并执行恢复
async function restore() {
  try {
    const backupFileName = getBackupFileName();
    const backupFilePath = path.join(BACKUP_DIR, backupFileName);
    
    if (!fs.existsSync(backupFilePath)) {
      console.error(`备份文件不存在: ${backupFilePath}`);
      process.exit(1);
    }
    
    console.log(`正在从文件恢复数据: ${backupFilePath}`);
    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));
    
    console.log('正在连接数据库...');
    await mongoose.connect(MONGODB_URI);
    console.log('数据库连接成功');
    
    // 确认是否继续恢复（这将清空当前数据库）
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('警告: 恢复操作将清空当前数据库中的数据。是否继续? (y/n) ', async (answer) => {
      readline.close();
      
      if (answer.toLowerCase() !== 'y') {
        console.log('恢复操作已取消');
        await mongoose.disconnect();
        process.exit(0);
      }
      
      // 清空当前数据库中的所有集合
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        console.log(`正在清空集合: ${collections[key].collectionName}`);
        await collections[key].deleteMany({});
      }
      
      // 恢复数据到各个集合
      for (const collectionName in backupData) {
        if (backupData[collectionName].length > 0) {
          console.log(`正在恢复集合: ${collectionName}`);
          await mongoose.connection.collection(collectionName).insertMany(backupData[collectionName]);
          console.log(`已恢复 ${backupData[collectionName].length} 条记录到 ${collectionName}`);
        }
      }
      
      console.log('数据恢复完成');
      await mongoose.disconnect();
      console.log('数据库连接已关闭');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('恢复过程中出错:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// 执行恢复
restore();