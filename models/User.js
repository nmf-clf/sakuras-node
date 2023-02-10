/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-02 16:53:40
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String, // 用户名
    nickname: String, // 昵称 
    password: String, // 密码
    emai: String, // 邮箱
    age: Number, // 年龄
    adress: String, // 住址
    school: String, // 毕业院校
    schedule: Array, // 待办事项
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

