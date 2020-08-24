// ==UserScript==
// @name         修改知乎日报标题
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  修改知乎日报标题为文章标题
// @author       tmr
// @match        *://daily.zhihu.com/story/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', () => {
        let zh_title = document.querySelector("p[class=DailyHeader-title]").innerText;
        document.querySelector("title").innerText = zh_title + "-知乎日报";
    });
})();