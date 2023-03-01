/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-03-01 15:26:32
 */
var express = require('express');
var router = express.Router();
const UserModel = require('../models/User');
const DictionaryModel = require('../models/Dictionary')
const Utils = require('../utils/Utils');

// 校验必填项
const verifyUser = (req, res) =>{
    let { sid } = req.headers;
    let { params } = req.body;
    let _sid = JSON.parse(Utils.decrypt.RSA(sid)); // 解密后的sid
    let _pms;
    try{
        _pms = JSON.parse(Utils.decrypt.DynamicDES(params, _sid));
    }catch(err){
        res.send({
            code: '0',
            data: null,
            message: '登录信息验证失败！'
        })
    }
    let { username, password } = _pms;
    if(!username || !password){
        res.send({
            code: '0',
            data: null,
            message: '账号和密码不能为空！'
        })
    }
    return {
        params: _pms,
        sid: _sid,
    };
}

// 注册
router.post('/register', function(req, res, next) {
    const verify = verifyUser(req, res);
    if(verify){
        const { params: { username, password, age, nickname, emai, adress, school, schedule } } = verify;
        UserModel.findOne({ username })
        .then(user => {
            if(!user){
                new UserModel({ isAdmin: username == 'niumengfei' ? true : false, username, password, age, nickname, emai, adress, school, schedule })
                .save((err, newUser)=>{
                    if (err) return console.error(err);
                    res.send({
                        code: '1',
                        data: {},
                        message: '注册成功！'
                    });
                    // 注册成功后应该为用户默认生成文章分类和标签分类
                    DictionaryModel.insertMany( [
                        { pid: null, type: 'articleType', label: '文章类型',value: Utils.randomString(8, 'number'), index: 1, userId: newUser._id },
                        { pid: null, type: 'articleTag', label: '文章标签',value: Utils.randomString(8, 'number'), index: 2, userId: newUser._id }
                    ]).then(res=>{
                        
                    })
                })
            }else{
                res.send({
                    code: '0',
                    data: null,
                    message: '该账号已存在！'
                });
            }
        })
    }
});

// 登录
router.post('/login', function(req, res, next) {
    const verify = verifyUser(req, res);
    if(verify){
        const { params: { username, password }, sid } = verify;
        UserModel.findOne({ username, password })
        .then(user =>{
            if(user){
                const { username, password, age, nickname, emai, adress, school, schedule } = user;
                let encrypt = Utils.encrypt.DynamicDES(JSON.stringify({
                    ...user._doc,
                    token: 'test-----------token'
                }), sid);
                res.send({
                    code: '1',
                    data: encrypt,
                    message: '登录成功'
                })
            }else{
                res.send({
                    code: '0',
                    data: null,
                    message: '账号名或密码不正确！'
                })
            }
        })
    }
});

// 添加待办事项

module.exports = router;
