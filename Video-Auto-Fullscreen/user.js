// ==UserScript==
// @name         自动网页全屏播放
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  自动网页全屏播放，已支持Bilibili
// @author       tmr
// @match        https://www.bilibili.com/video/av*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let counter = 0;
    function fullscreen() {
        console.log('web fullscreen start');
        webfull()
        function webfull() {
            console.log('web fullscreen ing ' + counter);
            counter++;
            let play_class;
            let fullscreen_class;
            if (location.host == 'www.bilibili.com') {
                fullscreen_class = '.bilibili-player-video-web-fullscreen';
            }
            if (fullscreen_class) {
                // 尝试全屏
                if (document.querySelector(fullscreen_class)) {
                    // 网页全屏
                    $(fullscreen_class).click();
                    console.log('web fullscreen success');
                    document.removeEventListener('visibilitychange',fullscreen);
                }
                // 失败并重试
                else {
                    // 超过30次就退出
                    if (counter > 30) {
                        console.log('web fullscreen fail');
                        return;
                    };
                    // 延迟0.5秒重试
                    setTimeout(webfull, 500);
                }
            }
        }
    }
    window.addEventListener('load', function () {
        // 判断后台打开
        if(document.visibilityState=='hidden') {
            console.log("now hidden, wait visible");
            document.addEventListener('visibilitychange',fullscreen);
        }
        // 前台打开，直接直行
        else{
            fullscreen();
        }
    });
})();