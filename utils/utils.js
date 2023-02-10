/*
 * @Author: niumengfei
 * @Date: 2022-10-29 14:04:02
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-02-10 17:54:49
 */
// const JSEncrypt = require('jsencrypt');
// console.log('JSEncrypt::', JSEncrypt);
const CryptoJS = require("crypto-js");
const moment = require("moment");

let DynamicKey;
// 公共方法
class _Utils{
    
    constructor() {
        // 加密
        this.encrypt = {
            // 动态DES
            DynamicDES: (message) => { 
                var keyHex = CryptoJS.enc.Utf8.parse(DynamicKey);
                var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                });
                return encrypted.ciphertext.toString();
            },
            // RSA
            RSA(Key24) {
                // const encrypt = new JSEncrypt();
                // encrypt.setPublicKey(RSAKey);
                // const encrypted = encrypt.encrypt(Key24);
                // return encrypted;
            }
        }
        // 解密
        this.decrypt = {
            DynamicDES: (ciphertext, DynamicKey) => {
                console.log('Des解密::', ciphertext, DynamicKey);
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
            if (hashItem) { 
                !hashItem[children] && (hashItem[children] = []);
                hashItem['children'].push(jsonArrItem);
                hashItem['children'].sort((a,b)=>{
                    return a.index && b.index ? a.index - b.index : true
                })
            } else if(!jsonArrItem.pid){
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
}

// export default new Utils();
let Utils = new _Utils();

module.exports = Utils;