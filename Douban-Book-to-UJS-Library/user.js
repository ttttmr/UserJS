// ==UserScript==
// @name         豆瓣读书直达江苏大学图书馆搜索
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  豆瓣读书直达江苏大学图书馆搜索，方便找书
// @author       tmr
// @include      https://book.douban.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let title = document.getElementsByTagName('h1')[0].children[0].innerText;
    let info = document.getElementById('info');
    let liblink = document.createElement('a');
    let isbn = info.innerText.match(/\d{13}|\d{10}/)[0];
    liblink.href='http://huiwen.ujs.edu.cn:8080/opac/openlink.php?strSearchType=isbn&match_flag=full&historyCount=1&strText='+isbn+'&doctype=ALL&with_ebook=on&displaypg=20&showmode=list&sort=CATA_DATE&orderby=desc&location=ALL';
    liblink.target = '_blank';
    liblink.innerText = '去江苏大学图书馆搜索';
    info.appendChild(liblink);
})();
