/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2022-12-20 10:51:57
 */
var express = require('express');
var router = express.Router();
const ArticleModel = require('../models/Article');
const pagination = require('../utils/pagination');

//注册
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
    new ArticleModel({ username: 'test', ...item })
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
//查询文章
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
            // sort: {_id:-1} //排序
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

        // ArticleModel.findOne({ username })
        // .then(article =>{
        //     console.log('查询文章列表', article);
        //     res.send({
        //         code: '0',
        //         data: article?.articleList || [],
        //         message: article ? '查询成功！' : '文章列表为空'
        //     })
        // })
    }else{
        res.send({
            code: '0',
            data: null,
            message: '用户列表查询失败: username 不能为空！'
        })
    }
});

module.exports = router;
