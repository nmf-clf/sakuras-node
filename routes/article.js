/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-28 14:46:38
 */
var express = require('express');
var router = express.Router();
const ArticleModel = require('../models/Article');
const UserModel = require('../models/User');
const { Utils, pagination } = require('../utils');
 
// 查询文章列表
router.post('/list', function(req, res, next) {
    let { username, page=1, pageSize=10, title, type, tag, createDate=[], updateDate=[], status, sortByIndex } = req.body;
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
            username, 
            title, 
            type: type == '全部' ? '' : type, 
            status: status == '全部' ? '' : status,
            tag, 
            createDate: Utils.isEmpty(createDate) ? null : { "$gte": createDate[0], "$lte": createDate[1] },
            updateDate: Utils.isEmpty(updateDate) ? null : { "$gte": updateDate[0], "$lte": updateDate[1] },
        }, //查询条件
        projection: '', //投影，
        sort: { _id: -1 } //排序
    }
    pagination(options)
    .then((result)=>{
        let _res = result;
        if(sortByIndex || (type && type !== '全部')){ // 指定通过 index 或者 查询非全部数据时，要自动根据 index 排序
            let rlt = JSON.parse(JSON.stringify({result}));
            rlt?.result?.list?.sort((a,b)=> a.index - b.index);
            _res = rlt.result;
        }
        res.send({
            code: '1',
            data: _res,
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
        UserModel.findOne({ username: article.username })
        .then(user =>{
            res.send({
                code: '1',
                data: {
                    ...article._doc,
                    nickname: user.nickname
                } || {},
                message: article ? '查询成功！' : '文章详情暂无数据！'
            })
        })
    })
});

// 新增文章
router.post('/addOrUpdate', function(req, res, next) {
    let { _id, userId, username, title, type, content, status='已发布', tag=[], hot=0, good=0, index } = req.body;
    const currentDate = Utils.moment().currentDate();
    if(!_id && (!username || !title || !userId)){
        return res.send({
            code: '0',
            data: null,
            message: '新增失败: userId / username / title 不能为空!'
        })
    }
    if(!_id){ // 新增
        new ArticleModel({ 
            userId,
            username, 
            title,  
            type,  
            content, 
            createDate: currentDate, 
            updateDate: currentDate, 
            status,
            tag,
            hot,
            good,
            index,
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
            tag,
            hot,
            good,
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

// 重置Index值
router.post('/resetIndex', function(req, res, next) {
    let {  newChildrenIdList=[] } = req.body;
    let ln = newChildrenIdList.length;
    let sign = 0;
    new Promise((resolve, reject)=> {
        newChildrenIdList.map((_id, _index) => {
            ArticleModel.findByIdAndUpdate(_id, { $set: { 
                index: _index + 1
            }}, { new: true }, function(err){
                if(err){
                    res.send({
                        code: '0',
                        data: {},
                        message: `${_id} 更新失败！`
                    });
                }
                sign = sign + 1;
                if(sign === ln){
                    resolve();
                }
            });
        })
    })
    .then(()=> {
        res.send({
            code: '1',
            data: {},
            message: '文章排序成功！'
        });
    })
});

module.exports = router;
