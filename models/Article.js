/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei 870424431@qq.com
 * @LastEditTime: 2023-03-27 15:45:27
 */
const mongoose = require('mongoose');

const Article = new mongoose.Schema({
    userId: String, // 用户唯一 id
    username: String, // 用户名
    title: String, // 文章标题 
    type: Number, // 文章类型 code
    typeName: String, // 文章类型 name
    content: String, // 文章内容
    createDate: String, // 创建时间
    createDateStamp: Number, // 创建时间戳
    updateDate: String, // 更新时间
    updateDateStamp: String, // 更新时间时间戳
    status: String, // 发布状态
    tag: Array, // 标签
    hot: Number, // 热度
    good: Number, // 点赞
    index: Number, // 排序
});

const ArticleModel = mongoose.model('Article', Article);

module.exports = ArticleModel;

