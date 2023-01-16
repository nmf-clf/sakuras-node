/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-01-16 17:45:01
 */
var express = require('express');
var router = express.Router();
const ArticleModel = require('../models/Article');
const { Utils, pagination } = require('../utils');
 
// 查询文章列表
router.post('/list', function(req, res, next) {
    let { username, page = 1, pageSize = 10 } = req.body;
    if(!username){
        return res.send({
            code: '0',
            data: null,
            message: '用户列表查询失败: username 不能为空！'
        })
    }
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
        res.send({
            code: '1',
            data: result,
            message: '查询成功！'
        })
    })
});

// 查询文章详情
router.post('/detail', function(req, res, next) {
    let { _id } = req.body;
    if(!_id){
        return res.send({
            code: '0',
            data: null,
            message: '用户列表查询失败: _id 不能为空！'
        })
    }
    ArticleModel.findOne({ _id })
    .then(article =>{
        res.send({
            code: '1',
            data: article || {},
            message: article ? '查询成功！' : '文章详情暂无数据！'
        })
    })
});

// 新增文章
router.post('/addOrUpdate', function(req, res, next) {
    let {  username, title, type, content, status, _id } = req.body;
    const currentDate = Utils.moment().currentDate();
    if(!username || !title){
        return res.send({
            code: '0',
            data: null,
            message: '新增失败: username 和 title 不能为空!'
        })
    }
    if(!_id){ // 新增
        new ArticleModel({ 
            username, 
            title,  
            type,  
            content, 
            createDate: currentDate, 
            updateDate: currentDate, 
            status,
        })
        .save((err, result)=>{
            if (err) return console.error('出错啦::', err);
            res.send({
                code: '1',
                data: result || {},
                message: '新增文章成功！'
            });
        })
    }else{ // 更新
        ArticleModel.findByIdAndUpdate(_id, { $set: { 
            title,  
            type,  
            content, 
            updateDate: currentDate, 
            status,
        }}, { new: true }, function(err, updateArticle){
            if (err) return console.error('出错啦::', err);
            res.send({
                code: '1',
                data: updateArticle || {},
                message: '更新文章成功！'
            });
        });
    }
});

// 删除文章
router.post('/delete', function(req, res, next) {
    let { _id } = req.body;
    if(!_id){
        return res.send({
            code: '0',
            data: null,
            message: '文章删除失败: _id 不能为空!'
        })
    }
    ArticleModel.findByIdAndDelete(_id)
    .then(delArticle =>{
        res.send({
            code: '1',
            data: null,
            message: '文章删除成功!'
        })
    })
    .catch(err =>{
        console.error('出错啦::', err);
    })
});

module.exports = router;
