/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2022-12-18 22:33:18
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

