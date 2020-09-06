// ==UserScript==
// @name         修改知乎日报标题
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.3
// @description  修改知乎日报标题为文章标题
// @author       tmr
// @match        *://daily.zhihu.com/story/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function rename() {
        let zh_title = document.querySelector("p[class=DailyHeader-title]").innerText;
        document.querySelector("title").innerText = zh_title + "-知乎日报";
    }
    window.addEventListener('load', function () {
        // 判断后台打开
        if (document.visibilityState == 'hidden') {
            console.log("now hidden, wait visible");
            document.addEventListener('visibilitychange', rename);
        }
        // 前台打开，直接执行
        else {
            rename();
        }
    });
})();