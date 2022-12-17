/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2022-12-17 15:13:00
 */
const mongoose = require('mongoose');

const Article = new mongoose.Schema({
    username: String,
    articleList: Array,
});

const ArticleModel = mongoose.model('Article', Article);

module.exports = ArticleModel;

