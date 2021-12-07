// ==UserScript==
// @name         修改知乎日报标题
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.6
// @description  修改知乎日报标题为文章标题
// @author       tmr
// @match        *://daily.zhihu.com/story/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function rename() {
        let zh_title = document.querySelector("p[class=DailyHeader-title]").innerText;
        let new_title = zh_title + "-知乎日报";
        if (document.title !== new_title) {
            document.title = new_title;
        }
        setTimeout(rename, 1000);
    }
    rename();
})();