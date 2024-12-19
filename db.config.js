/*
 * @Author: niumengfei
 * @Date: 2022-10-28 16:47:36
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-09-21 11:01:32
 */
const mongoose = require('mongoose'); //数据库
require('colors');// 颜色模块

const pk_config = require('./package.json');
const dbPath = pk_config.runDBPath[process.env.dbPath || 'pro']; //默认连接服务器数据库
const dbUsername = "niumengfei"; // 数据库管理员连接账号 app
const dbPassword = "niumengfei"; // 数据库管理员的密码 app

//启动数据库 插入集合和数据，数据库会自动创建
mongoose.connect('mongodb://127.0.0.1:27017/sakuras'); //本地数据库
// mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@127.0.0.1:27017/sakuras`); //本地数据库
// mongoose.connect(`mongodb://${dbUsername}:${dbPassword}@${dbPath}`); //通过本地连接远程数据库

const db = mongoose.connection;

db.on('error',(err)=>{ 
	throw err;
});

db.once('open',()=>{ 
	console.log(`DB is connected on ${dbPath}...`.green);
});
