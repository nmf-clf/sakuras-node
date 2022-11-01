/*
 * @Author: niumengfei
 * @Date: 2022-10-28 16:47:36
 * @LastEditors: niumengfei
 * @LastEditTime: 2022-10-31 17:43:11
 */
const mongoose = require('mongoose'); //数据库
//启动数据库
mongoose.connect('mongodb://localhost:27017/sakuras'); //插入集合和数据，数据库会自动创建

const db = mongoose.connection;

db.on('error',(err)=>{ 
	throw err;
});

db.once('open',()=>{ 
	console.log('DB connected....');
});
