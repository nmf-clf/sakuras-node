/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-10 18:01:08
 */
var express = require('express');
var router = express.Router();
const DictionaryModel = require('../models/Dictionary');
const { Utils, pagination } = require('../utils');

// 查询字典
router.post('/list', function(req, res, next) {
    //查询该用户
    let options = {
        page: 1,
        limit: 1000,
        model: DictionaryModel,
        query: {},
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
    let {  type, label, value, _id, pid, index, rename } = req.body;
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
            console.log('count:::', count);
            new DictionaryModel({ type, label, pid, value: value || label, index: count+1 })
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
            label, type, value
        }}, { new: true }, function(err, updateDictionary){
            if (err) return console.error('出错啦::', err);
            res.send({
                code: '1',
                data: updateDictionary || {},
                message: '字典更新成功！'
            });
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
        res.send({
            code: '1',
            data: null,
            message: '字典删除成功!'
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

module.exports = router;