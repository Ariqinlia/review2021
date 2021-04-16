/* --------- Common.js  node.js ---------*/


// 定义模块math.js
var basicNum = 0;
function add(a,b) {
    return a+b;
}
// 需要向外暴露的函数及其变量
module.exports = {
    add: add,
    basicNum: basicNum
}

//引用自定义模块时，参数包含路径，可省略.js
var math = require('./math');
math.add(1,2);
// 引用核心模块时，不需要带路径
var http = require('http');


/* --------- AMD & require.js ---------*/


/** 网页中引入require.js及main.js **/
<script src="js/require.js" data-main="js/main"></script>

/** main.js 入口文件/主模块 **/
// 首先用config()指定各模块路径和引用名
require.config({
  baseUrl: "js/lib",
  paths: {
    "jquery": "jquery.min",  //实际路径为js/lib/jquery.min.js
    "underscore": "underscore.min",
  }
});
// 执行基本操作
// 引用模块，将模块放在[]内
require(["jquery","underscore"],function($,_){
  // some code here
});


/* --------- CMD & sea.js ---------*/


/** sea.js **/
// 定义模块 math.js
define(function(require, exports, module) {
    var $ = require('jquery.js');
    var add = function(a,b){
        return a+b;
    }
    exports.add = add;
});
// 加载模块
seajs.use(['math.js'], function(math){
    var sum = math.add(1,2);
});
