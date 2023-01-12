/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei 870424431@qq.com
 * @LastEditTime: 2023-01-12 16:09:30
 */
const mongoose = require('mongoose');

const Article = new mongoose.Schema({
    uuid: String,
    username: String,
    title: String,
    type: String,
    content: String,
    createDate: String,
    updateDate: String,
    status: String,
    opreation: String,
});

const ArticleModel = mongoose.model('Article', Article);

module.exports = ArticleModel;

