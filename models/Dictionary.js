/*
 * @Author: niumengfei
 * @Date: 2022-10-28 17:29:24
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-03-01 14:24:23
 */
const mongoose = require('mongoose');

const Dictionary = new mongoose.Schema({
    pid: String, // 父级节点
    type: String, // 类型
    label: String, // 类型描述
    value: Number, // 类型枚举值
    index: Number, // 下标顺序
    userId: String, // 用户id
    public: Number, // 是否公共数据 
});

const DictionaryModel = mongoose.model('Dictionary', Dictionary);

module.exports = DictionaryModel;

