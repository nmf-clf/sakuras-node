/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei 870424431@qq.com
 * @LastEditTime: 2023-03-30 14:48:08
 */
const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
    articleId: String, // 评论文章id
    author: {
        name: String, // 名称
        site: String, // 网站链接
    }, // 评论人的信息
    content: String, // 评论内容
    pid: String, // 父级评论的 _id
});

const CommentModel = mongoose.model('Comment', Comment);

module.exports = CommentModel;

