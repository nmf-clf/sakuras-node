/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-03 16:15:44
 */
const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    // _id: 主键
    articleId: String, // 评论文章id
    username: String, // 当前评论者的用户名
    content: String, // 评论内容
});

const CommentModel = mongoose.model('Comment', Comment);

module.exports = CommentModel;

