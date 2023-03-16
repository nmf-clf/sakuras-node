/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-03-16 16:58:41
 */
var express = require('express');
var router = express.Router();
const DictionaryModel = require('../models/Dictionary');
const ArticleModel = require('../models/Article')
const { Utils, pagination } = require('../utils');

// 查询字典-通用
router.post('/list', function(req, res, next) {
    const { userId } = req.body; 
    let query = userId  ? { userId } : {}; // 如果传了 userId ，则表示只查询用户私有信息
    //查询该用户
    let options = {
        page: 1,
        limit: 1000,
        model: DictionaryModel,
        query,
        projection: '', 
    }
    pagination(options)
    .then((result)=>{
        const newRes = Utils.transData(JSON.parse(JSON.stringify(result.list)), '_id', 'pid', 'children');
        res.send({
            code: '1',
            data: newRes,
            message: '查询成功！'
        })
    })
});

// 新增字典
router.post('/addOrUpdate', function(req, res, next) {
    let {  type, label, _id, pid, rename, userId } = req.body;
    if(!label || (!rename && _id && !type)){
        return res.send({
            code: '0',
            data: null,
            message: '新增失败: 字典类型 type / label 不能为空!'
        })
    }
    if(!_id){ // 新增
        DictionaryModel.countDocuments({
            pid, // 通过pid查询 将要插入的对象 与之同级的 对象数量
        })
        .then(count =>{
            new DictionaryModel({ type, label, pid, value: Utils.randomString(8, 'number'), index: count + 1, userId })
            .save((err, result)=>{
                if (err) return console.error('出错啦::', err);
                res.send({
                    code: '1',
                    data: result || {},
                    message: '字典新增成功！'
                });
            })
        })
        
    }else{ // 更新
        DictionaryModel.findByIdAndUpdate(_id, { $set: { 
            label
        }}, { new: true }, function(err, updateDictionary){
            if (err) return console.error('出错啦::', err);
            ArticleModel.updateMany({
                type: updateDictionary.value
            }, { $set: { 
                typeName: label
            }})
            .then(updateres => {
                res.send({
                    code: '1',
                    data: updateDictionary || {},
                    message: '字典更新成功！'
                });
            })
        });
    }
});

// 删除字典
router.post('/delete', function(req, res, next) {
    let { _id } = req.body;
    if(!_id){
        return res.send({
            code: '0',
            data: null,
            message: '字典删除失败: _id 不能为空!'
        })
    }
    DictionaryModel.findByIdAndDelete(_id)
    .then(delDictionary =>{
        const { userId, value } = delDictionary;
        res.send({
            code: '1',
            data: delDictionary,
            message: '字典删除成功!'
        })
        // 如果删除的是文章相关的，则应该清空对应的分类的文章 这里应该使用关联查询
        ArticleModel.deleteMany({
            userId,
            type: value,
        })
        .then(delArticles => {
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
            DictionaryModel.findByIdAndUpdate(_id, { $set: { 
                index: _index + 1
            }}, { new: true }, function(err, updateDictionary){
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
            message: '字典更新成功！'
        });
    })
});

// 查询字典-分组
router.post('/group', function(req, res, next) {
    const { userId } = req.body; 
    let query = {
        userId: userId ? userId : '63feff45423162c275398abf' // 如果传了 userId ，则表示只查询用户私有信息
    }
    //查询该用户
    let options = {
        page: 1,
        limit: 1000,
        model: DictionaryModel,
        query,
        projection: '', 
    }
    pagination(options)
    .then((result)=>{
        const dictionList = Utils.transData(JSON.parse(JSON.stringify(result.list)), '_id', 'pid', 'children'); // 字典表
        ArticleModel.find(query)
        .then(articles =>{
            let cateEnum = {}, tagEnum = {}; // 分类枚举对象 标签枚举对象
            articles?.forEach((item) => {
                cateEnum[item.typeName] ? cateEnum[item.typeName]++ : cateEnum[item.typeName] = 1; // 处理分类类型
                item.tag?.forEach((type) => { tagEnum[type] ? tagEnum[type]++ : tagEnum[type] = 1 }); // 处理文章类型
            })
            let cateList = dictionList.filter(v => v.type == 'articleType')[0]?.children || [];
            let tagList = dictionList.filter(v => v.type == 'articleTag')[0]?.children || [];
            // 如果此类别没有文章，也应该把此类别加上去
            cateList.map(v => {
                if(!cateEnum.hasOwnProperty(v.label)) cateEnum[v.label] = 0;
            })
            tagList.map(v => {
                if(!tagEnum.hasOwnProperty(v.label)) tagEnum[v.label] = 0;
            })
            const cateNumInfo = Utils.createArrByObject(cateEnum, cateList);
            const tagNumInfo = Utils.createArrByObject(tagEnum);
            res.send({
                code: '1',
                data: {
                    dictionList,
                    cateNumInfo,
                    tagNumInfo,
                },
                message: '查询成功！'
            })
        })
        // res.send({
        //     code: '1',
        //     data: newRes,
        //     message: '查询成功！'
        // })
    })
});

module.exports = router;
