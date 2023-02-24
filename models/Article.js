/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-14 14:09:54
 */
const mongoose = require('mongoose');

const Article = new mongoose.Schema({
    username: String, // 用户名
    title: String, // 文章标题 
    type: String, // 文章类型 
    content: String, // 文章内容
    createDate: String, // 创建时间
    updateDate: String, // 更新时间
    status: String, // 发布状态
    tag: Array, // 标签
    hot: Number, // 热度
    good: Number, // 点赞
    index: Number, // 排序
});

const ArticleModel = mongoose.model('Article', Article);

module.exports = ArticleModel;

