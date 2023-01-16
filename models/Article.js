/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-01-16 11:04:59
 */
const mongoose = require('mongoose');

const Article = new mongoose.Schema({
    uuid: String,
    username: String, // 用户名 
    title: String, // 文章标题 
    type: String, // 文章类型 
    content: String, // 文章内容
    createDate: String, // 创建时间
    updateDate: String, // 更新时间
    status: String, // 发布状态
    opreation: String, // 操作
});

const ArticleModel = mongoose.model('Article', Article);

module.exports = ArticleModel;

