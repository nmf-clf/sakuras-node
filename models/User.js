/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2022-11-01 16:23:16
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    age: Number,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

