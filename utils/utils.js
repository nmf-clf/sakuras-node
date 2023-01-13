/*
 * @Author: niumengfei
 * @Date: 2022-10-29 14:04:02
 * @LastEditors: niumengfei
 * @LastEditTime: 2023-01-13 17:25:25
 */
// const JSEncrypt = require('jsencrypt');
// console.log('JSEncrypt::', JSEncrypt);
const CryptoJS = require("crypto-js");
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
   
}

// export default new Utils();
let Utils = new _Utils();

module.exports = Utils;