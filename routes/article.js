/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei 870424431@qq.com
 * @LastEditTime: 2023-01-12 14:15:10
 */
var express = require('express');
var router = express.Router();
const ArticleModel = require('../models/Article');
const pagination = require('../utils/pagination');

// 测试添加文章
router.get('/addArticleList', function(req, res, next) {
    // let { username, password, age } = req.body;
    const item = {
        uuid: Math.round(Math.random()*10000),
        title: '如何赚钱',
        type: '文学著作',
        content: '查看刑法第N条',
        createDate: '2016-05-02',
        updateDate: '2017-05-02',
        status: '已发布',
        opreation: `<div>123</div>`
    };
    new ArticleModel({ username: 'admin', ...item })
    .save((err, result)=>{
        if (err) return console.error('出错啦::', err);
        console.log('result>>', result);
        res.send({
            code: '1',
            data: result || {},
            message: '新增文章成功！'
        });
    })
});
 
// 查询文章列表
router.post('/list', function(req, res, next) {
    // let { username, page=1, pageSize=10 } = req.query;
    let { username, page=1, pageSize=10 } = req.body;
    if(username){
        //查询该用户
        let options = {
            page,//需要显示的页码
            limit: pageSize,
            model: ArticleModel, //操作的数据模型
            query: {
                username
            }, //查询条件
            projection: '', //投影，
            sort: { _id: -1 } //排序
        }
        pagination(options)
        .then((result)=>{
            // console.log('result::', result);
            res.send({
                code: '1',
                data: result,
                message: '查询成功！'
            })
        })
    }else{
        res.send({
            code: '0',
            data: null,
            message: '用户列表查询失败: username 不能为空！'
        })
    }
});

// 查询文章详情
router.post('/detail', function(req, res, next) {
    // let { username, page=1, pageSize=10 } = req.query;
    let { username, _id } = req.body;
    if(!username || !_id){
        res.send({
            code: '0',
            data: null,
            message: '用户列表查询失败: username 不能为空！'
        })
    }
    ArticleModel.findOne({ username, _id })
    .then(article =>{
        console.log('查询文章详情=>', article);
        res.send({
            code: '1',
            data: article || {},
            message: article ? '查询成功！' : '文章详情暂无数据！'
        })
    })
});

module.exports = router;
