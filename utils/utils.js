/*
 * @Author: niumengfei
 * @Date: 2022-10-29 14:04:02
 * @LastEditors: niumengfei 870424431@qq.com
 * @LastEditTime: 2023-03-27 15:59:28
 */
const NodeRSA = require('node-rsa');
const CryptoJS = require("crypto-js");
const moment = require("moment");
const { RSAPrivatecKey, StaticKey } = require('./Const');

let DynamicKey;

// 公共方法
class _Utils{
    
    constructor() {
        this.encrypt = { // 加密
            DynamicDES: (message, DynamicKey) => { // 动态DES
                var keyHex = CryptoJS.enc.Utf8.parse(DynamicKey);
                var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.ciphertext.toString();
            },
            StaticDES: (message) =>{  // 静态DES 
                var keyHex = CryptoJS.enc.Utf8.parse(StaticKey);
                var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.ciphertext.toString();
            }, 
            RSA(Key24) { // RSA
                const RSAPublicKey = 'RSA-公钥';
                const encrypt = new NodeRSA(RSAPublicKey);
                encrypt.setOptions({encryptionScheme: 'pkcs1'}); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
                const encrypted = encrypt.encrypt(Key24, 'base64');
                return encrypted;
            }
        }
        // 解密
        this.decrypt = {
            DynamicDES: (ciphertext, DynamicKey) => {
                try{
                    var keyHex = CryptoJS.enc.Utf8.parse(DynamicKey);
        
                    var decrypted = CryptoJS.DES.decrypt({
                        ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
                    }, keyHex, {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    var result_value = decrypted.toString(CryptoJS.enc.Utf8);
                    return result_value;
                }catch(err){
                    console.log('decryptByDES-err====================>',err)
                }
            },
            RSA(Key24) {
                const privateKey = new NodeRSA(RSAPrivatecKey);
                privateKey.setOptions({encryptionScheme: 'pkcs1'}); // 因为jsencrypt自身使用的是pkcs1加密方案, nodejs需要修改成pkcs1。
                let decrypted = privateKey.decrypt(Key24, 'utf8');
                return decrypted;
            }
        }
    }
    moment = () => {
        return {
            // 获取当前日期
            currentDate: (type) => {
                return type ? moment().format(type) : moment().format('YYYY-MM-DD');
            }
        }
    }
    /**
     * 根据id和pid把json结构 转 树状结构
     * @param  jsonArr  {json}      json数据
     * @param  idStr  {String}    id的属性名
     * @param  pidStr  {String}    父id的属性名
     * @param  childrenStr  {String}    children的属性名
     * @return  {Array}     数组
    **/
    transData = (jsonArr, idStr, pidStr, childrenStr) => {
        if(!jsonArr) return[];
        const result = [];
        const id = idStr;
        const pid = pidStr;
        const children = childrenStr;
        const len = jsonArr.length;
        const hash = {};
        jsonArr.forEach(item => {
            hash[item[id]] = item; 
        });
        for (let j = 0; j < len; j++) {
            const jsonArrItem = jsonArr[j];
            const hashItem = hash[jsonArrItem[pid]]; 
            if (hashItem) { // 子节点
                !hashItem[children] && (hashItem[children] = []);
                hashItem['children'].push(jsonArrItem);
                hashItem['children'].sort((a,b)=>{
                    return a.index && b.index ? a.index - b.index : true
                })
            } else if(!jsonArrItem.pid){ // 一级节点
                jsonArrItem['children'] = [];
                result.push(jsonArrItem);
                result.sort((a,b)=>{
                    return a.index && b.index ? a.index - b.index : true
                })
            }
        }
        return result;
    };
    // 浅比较空值
    isEmpty(val){
        return !val || JSON.stringify(val) === '{}' || JSON.stringify(val) === '[]' || JSON.stringify(val) === 'null'
    }
    // 生成随机数
    randomString = (len, type) => {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        type == 'number' ? $chars = '1234567890' : null;
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
    // 根据对象创建数组 objEnum: 枚举对象
    createArrByObject = (objEnum, arr) => {
        if(this.isEmpty(objEnum)) return [];
        return Object.keys(objEnum).map((type) => { 
            return { 
                type: type, 
                num: objEnum[type],
                value: arr ? (arr.filter(v => v.label == type)[0] || {}).value : type
            } 
        })
    }
}

// export default new Utils();
let Utils = new _Utils();

module.exports = Utils;