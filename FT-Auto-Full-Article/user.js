// ==UserScript==
// @name         FT中文网自动加载全文
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.8
// @description  FT中文网自动跳转chineseft，自动加载全文，并修改所有FT中文网链接，增加全文参数
// @author       tmr
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    // 自动跳转chineseft
    if (location.href.startsWith('http://www.ftchinese.com/story/') || location.href.startsWith('https://www.ftchinese.com/story/')) {
        location.host = "www.chineseft.com";
    }
    function full(url) {
        // 已有全文参数
        if (url.includes('full=y')) {
            return url;
        }
        // 无参数
        if (!url.includes('?')) {
            return url + '?full=y';
        }
        // 有参数，但没有指定页参数
        if (!url.includes('page=')) {
            return url + '&full=y';
        }
        // 指定页为1，也要加载全文
        if (url.includes('page=1')) {
            let newurl = url;
            // 判断参数位置并删掉
            if (url.length - url.indexOf("page=1") == 6) {
                newurl = url.replace("page=1", "");
            }
            else {
                newurl = url.replace("page=1&", "");
            }
            newurl = newurl + '&full=y';
            return newurl;
        }
    }
    if (location.host == 'www.chineseft.com') {
        console.log('ft');
        if (document.querySelector('.pagination-container') != null) {
            console.log('文章有分页');
            let fullUrl = full(location.href);
            if (location.href != fullUrl) {
                console.log('加载全文');
                location.href = fullUrl;
            }
        }
    }
    // 替换页面ft链接
    function replace(){
        let aTagList = document.querySelectorAll('a');
        aTagList.forEach(function (ele) {
            if (ele.href.startsWith('http://www.ftchinese.com/story/') || ele.href.startsWith('https://www.ftchinese.com/story/')) {
                ele.href = ele.href.replace(/www.ftchinese.com/, "www.chineseft.com");
                ele.href = full(ele.href);
            } else if (ele.href.startsWith('https://www.chineseft.com/story/') || ele.href.startsWith('https://www.chineseft.com/story/')) {
                console.log('发现ft链接，替换' + ele.href);
                ele.href = full(ele.href);
            }
        });
    }
    replace();
    setInterval(replace,5000);
})();
