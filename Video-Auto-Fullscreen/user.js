// ==UserScript==
// @name         自动网页全屏播放
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.1
// @description  自动网页全屏播放，已支持Bilibili
// @author       tmr
// @match        https://www.bilibili.com/video/av*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let counter = 0;
    window.addEventListener('load', function () {
        console.log('web fullscreen start');
        function webfull() {
            console.log('web fullscreen ing ' + counter);
            counter++;
            let ele_class;
            if (location.host == 'www.bilibili.com') {
                ele_class = '.bilibili-player-video-web-fullscreen';
            }
            if (ele_class) {
                if (document.querySelector(ele_class)) {
                    $(ele_class).click();
                    console.log('web fullscreen success');
                }
                else {
                    if (counter > 30) {
                        console.log('web fullscreen fail');
                        return;
                    };
                    setTimeout(webfull, 500);
                }
            }
        }
        webfull();
        console.log('web fullscreen done');
    });
})();