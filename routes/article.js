/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei 870424431@qq.com
 * @LastEditTime: 2023-03-31 14:34:44
 */
var express = require('express');
var router = express.Router();
const ArticleModel = require('../models/Article');
const UserModel = require('../models/User');
const { Utils, pagination, Const } = require('../utils');
 
// 查询文章列表
router.post('/list', function(req, res, next) {
    let { notlogin, username, page=1, pageSize=10, title, type, tag, createDate=[], updateDate=[], status, sortByIndex } = req.body;
    username = username || (notlogin && Const.rootName); // 是否默认查询 开发者 的数据列表
    if(!username){
        return res.send({
            code: '0',
            data: null,
            message: '文章列表查询失败: username 不能为空！'
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
            type, 
            status: sortByIndex ? null : (status || '已发布'), // 目前 sortByIndex 仅表示发布编辑文章页面需要的入参
            tag: Utils.isEmpty(tag) ? null : { $in: tag }, 
            createDate: Utils.isEmpty(createDate) ? null : { $gte: createDate[0], $lte: createDate[1] },
            updateDate: Utils.isEmpty(updateDate) ? null : { $gte: updateDate[0], $lte: updateDate[1] },
        }, //查询条件
        projection: '', //投影，
        sort: { createDate: -1, _id: -1 } // 优先按照创建日期排序，其次相同创建日期按照 _id 插入顺序排序
    }
    pagination(options)
    .then((result)=>{
        let _res = result;
        if(sortByIndex){ // 指定通过 index 或者 查询非全部数据时，要自动根据 index 排序   || (type && type !== '全部')
            let rlt = JSON.parse(JSON.stringify({ result }));
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
        ArticleModel.findByIdAndUpdate(_id, { $set: { // 暂时这样写，并不规范
           hot: article.hot + 1
        }}, { new: true }, function(err, updateArticle){
            if (err) return console.error('出错啦::', err);
        });
    })
});

// 新增文章
router.post('/addOrUpdate', function(req, res, next) {
    let { _id, userId, username, title, type, typeName, content, status='已发布', tag=[], hot=0, good=0, index } = req.body;
    const currentDate = Utils.moment().currentDate();
    const currentStamp =  new Date().getTime();
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
            typeName,
            content, 
            createDate: currentDate, 
            createDateStamp: currentStamp,
            updateDate: currentDate, 
            updateDateStamp: currentStamp,
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
            updateDateStamp: currentStamp,
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
