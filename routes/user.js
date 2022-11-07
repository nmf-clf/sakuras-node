/*
 * @Author: niumengfei
 * @Date: 2022-10-26 18:01:07
 * @LastEditors: niumengfei
 * @LastEditTime: 2022-11-07 13:29:10
 */
var express = require('express');
var router = express.Router();
const UserModel = require('../models/User.js');

const verifyUser = (req, res) =>{
    let { username, password } = req.body;
    if(!username || !password){
        res.send({
            code: '0',
            data: null,
            message: '账号和密码不能为空！'
        })
    }
    return !username || !password;
}
router.get('/test', function(req, res, next) {
    console.log('请求::', req.body);
    res.send({
        code: 1,
        resbody: {
            a: 'test2'
        },
        message: '测试成功！'
    })
});
//注册
router.post('/register', function(req, res, next) {
    let { username, password, age } = req.body;
    if(!verifyUser(req, res)){
        UserModel.findOne({ username })
        .then(user => {
            if(!user){
                new UserModel({ username, password, age })
                .save((err, newUser)=>{
                    if (err) return console.error(err);
                    res.send({
                        code: '1',
                        data: {
                            name: username,
                            ps: password,
                            token: 'asdasdwqeqweqweqweqeeqw'
                        },
                        message: '注册成功！'
                    });
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

//登录
router.post('/login', function(req, res, next) {
    let { username, password } = req.body;
    if(!verifyUser(req, res)){
        UserModel.findOne({ username, password })
        .then(user =>{
            if(user){
                res.send({
                    code: '1',
                    data: {
                        name: username,
                        ps: password,
                        token: 'asdasdwqeqweqweqweqeeqw'
                    },
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

module.exports = router;
