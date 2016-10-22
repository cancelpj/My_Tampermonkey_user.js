// ==UserScript==
// @name         按键机器人
// @namespace    https://github.com/cancelpj/My_Tampermonkey_user.js
// @version      2016.10.22.1
// @description  定时模拟点击页面按钮。因 GM 无法存储数组，故只能在脚本中自行添加页面地址、按钮实例、刷新时间（分钟）。
// @author       Peng Sir（QQ：9997452）
// @match        http*://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @icon         data:image/gif;base64,R0lGODlhEAAQAIcAABBYsRhcvRhuzhR0xiBxzyZ4zyd70yd71SR72Cp50Dd3yTp%2FzT16yEN5w0J8x1J%2BwhqI3BqA7ByQ%2BCKA1iqA0iyE0SqC2jyK1iyL5SqV%2FCqX%2FzSL4jqh%2Fz2n%2F0qHyEqMzkqH1UqG20%2BJ1kKQ30qS1liOzVaR3VSb10Sa4Eyf6VKf40uh4Uii60On%2F0it%2F0%2Bu%2F1Kj4Vqk6lew%2F1my%2F2Wb3Wuc1W%2Bc2nCNx26n3G6q33Sj3GCm7G%2Bq5Guz72O3%2F3ax53a3%2BHS%2B%2F3W%2B%2F3W%2F%2F3nB%2F37D%2F4Wl1oOn25Sx3YWp4Iq1442y4Y%2B66JC%2B552%2B5ojC74XC%2FYjK%2F47J%2F5TM%2F5bM%2F5jP%2F5vM%2Fp7P%2F5%2FP%2F6XA5qHK763C5KzE6arM7KDT%2F6LR%2F6HU%2F6TS%2F6DZ%2F7TM6rDU87Df%2F7fc%2F73W87Hg%2F7rk%2F73g%2F7zi%2F7zl%2F8Tb9MTd9s7d88Dk%2F8Xi%2F87k99bh9Nbm9tHp%2F9rm9uPr%2BeXz%2F%2Bb0%2F%2Bvy%2FO31%2FPb7%2F%2Fj5%2FP3%2B%2F%2F7%2B%2F%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAAIAALAAAAAAQABAAAAiuAAEJHEiwoMEmKCZQ%2BDDG4MAeEjJwaDHkgBOHWiA8IfMDgwwiCeaYCEGQR56BbjYIiQLAigKHA5cAmVKlTAOYgPQYWeDlC5oHArusgMEihQo5NcSwgbMmzQ2BOPDEMQOmSI43NESA8OBgi8ATdcJgqaDEYJ%2BBJNRcobKDCU5AF6AMkBLEQpuBd5IQHBGDTgEfMxDo4HIkQBaHZwy8cNFBQwQbOO2UICCAAZK3mAMCADs%3D
// ==/UserScript==

// 菜单设计：
// 添加/修改页面按钮
// 设置点击间隔时间（秒）

var urlTable = [];    // 匹配页面（通配符），获取按钮元素的方法 (getElementsByClassName /getElementsByName /getElementById)，获取按钮元素的条件，刷新时间（分钟）
urlTable[0] = ['http://192.168.2.13:8008/UIProcessor?*','getElementsByClassName',' x-btn-text x-tbar-loading',10];
urlTable[1] = ['http://liveoa.fingu.com:8008/UIProcessor?*','getElementsByClassName',' x-btn-text x-tbar-loading',10];

var refreshTime = GM_getValue("sec",60)*1000;
var oldRefreshTime = refreshTime;

function setRefreshTime() {
    var sec1 = prompt('请输入刷新时间（秒）：',GM_getValue("sec",60));
    if(sec1 !==null && sec1!=='' && parseInt(sec1)>0){
        GM_setValue("sec",Math.round(sec1));    // 四舍五入取整
        GM_log('设置LiveBOS挂机刷新时间：'+ GM_getValue("sec",60));
    } else {
        alert('请输入数字（自动四舍五入取整）！');
    }
}
GM_registerMenuCommand("LiveBOS挂机刷新时间", setRefreshTime, '');

function run(){
    var timer = window.setInterval(function(){
        refreshTime = GM_getValue("sec",60)*1000;
        GM_log('LiveBOS挂机页面：'+ this.location.href);
        GM_log('LiveBOS挂机刷新时间（秒）：'+ refreshTime/1000 + '    当前时间：'+ (new Date()).toLocaleTimeString());

        // 之所以本段不放在 setRefreshTime() 中处理，是因为 LiveBO S网站是 frame 框架结构，内有多个页面分别执行本挂机脚本。
        // 当执行菜单命令时，只对正在执行的其中一个页面生效，因此菜单命令只适合放 GM_setValue 来设置全局状态值（存储在 GM 扩展的内置 SQL_Lite 数据库中）。
        if(oldRefreshTime !== refreshTime){
            clearInterval(timer);
            GM_log('LiveBOS挂机刷新时间重新设置，重启定时器（秒：'+ oldRefreshTime/1000 + ' ==> '+ refreshTime/1000 +  '）');
            oldRefreshTime = refreshTime;
            run();
        }
        var btns = document.getElementsByClassName(" x-btn-text x-tbar-loading");
        if(btns.length){
            btns[0].click();
        }
    }, refreshTime);
}
run();
