// ==UserScript==
// @name         FT中文网自动加载全文
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  FT中文网自动加载全文，并修改所有FT中文网链接，增加全文参数
// @author       tmr
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function full(url) {
        // 无参数
        if (!url.includes('?')) {
            url = url + '?full=y';
        }
        // 有参数，但没有指定页参数
        if (!url.includes('page=')) {
            url = url + '&full=y';
        }
        // 指定页为1，也要加载全文
        if (url.includes('page=1')) {
            // 判断参数位置并删掉
            if (url.length - url.indexOf("page=1") == 6) {
                url = url.replace("page=1", "");
            }
            else {
                url = url.replace("page=1&", "");
            }
            url = url + '&full=y';
        }
        return url;
    }
    if (location.host == 'www.ftchinese.com') {
        console.log('ft');
        if (document.querySelector('.pagination-container') != null) {
            console.log('文章有分页');
            let fullUrl = full(location.href);
            if (location.href != fullUrl) {
                console.log('加载全文');
                location.href = fullUrl;
            }
        }
    } else {
        console.log('no ft');
        let aTagList = document.querySelectorAll('a');
        aTagList.forEach(function (ele) {
            if (ele.href.startsWith('http://www.ftchinese.com/story/') || ele.href.startsWith('https://www.ftchinese.com/story/')) {
                console.log('发现ft链接');
                ele.href = full(ele.href);
            }
        });
    }
})();
