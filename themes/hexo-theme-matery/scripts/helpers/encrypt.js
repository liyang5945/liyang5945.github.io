/* global hexo */


'use strict';

const CryptoJS = require('crypto-js');

hexo.extend.helper.register('aes', function(content,password){

  content = escape(content);
  content = CryptoJS.enc.Utf8.parse(content);
  content = CryptoJS.enc.Base64.stringify(content);
  content = CryptoJS.AES.encrypt(content, String(password)).toString();

  return content;
});


