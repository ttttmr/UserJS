// ==UserScript==
// @name         自动网页全屏播放
// @namespace    https://tmr.js.org/
// @more         https://github.com/ttttmr/UserJS
// @version      0.7
// @description  自动网页全屏播放，已支持Bilibili，Youtube（剧场模式），腾讯视频
// @author       tmr
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/bangumi/play/ss*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @match        https://www.youtube.com/watch?v=*
// @match        https://v.qq.com/x/page/*
// @match        https://v.qq.com/x/cover/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let counter = 0;
    function fullscreen() {
        console.log('web fullscreen start');
        webFull()
        function webFull() {
            console.log('web fullscreen ing ' + counter);
            counter++;
            let fullscreenClass;
            if (location.host == 'www.bilibili.com') {
                fullscreenClass = '.bilibili-player-video-web-fullscreen';
            } else if (location.host == 'www.youtube.com') {
                fullscreenClass = '.ytp-size-button';
            } else if (location.host == 'v.qq.com') {
                fullscreenClass = '.txp_btn_fake';
            }
            if (fullscreenClass) {
                // 尝试全屏
                if (document.querySelector(fullscreenClass)) {
                    // 网页全屏
                    document.querySelector(fullscreenClass).click();
                    console.log('web fullscreen success');
                    // 重置计数
                    counter = 0;
                    // 移除监听
                    document.removeEventListener('visibilitychange', fullscreen);
                }
                // 失败并重试
                else {
                    // 超过30次就退出
                    if (counter > 30) {
                        console.log('web fullscreen fail');
                        return;
                    };
                    // 延迟0.5秒重试
                    setTimeout(webFull, 500);
                }
            }
        }
        clickVideoLink();
        function clickVideoLink() {
            window.onclick = function (mClick) {
                let mClickElement= mClick.target;
                if (location.host == 'www.bilibili.com') {
                    // 视频链接
                    let videoUrlList = ['https://www.bilibili.com/video/av', 'https://www.bilibili.com/bangumi/play/ss', 'https://www.bilibili.com/bangumi/play/ep'];
                    // 视频Class
                    let videoClassList = ['bilibili-player-ending-panel-box-recommend-cover', 'ep-title', 'ep-item'];
                    // 新tab打开不处理
                    if (mClickElement.target == '_blank') {
                        return;
                    }
                    videoUrlList.forEach(function (videoUrl) {
                        if (String(mClickElement).indexOf(videoUrl) == 0) {
                            fullscreen();
                            return;
                        }
                    });
                    videoClassList.forEach(function (videoClass) {
                        if (mClickElement.classList.contains(videoClass)) {
                            fullscreen();
                            return;
                        }
                    });
                } else if (location.host == 'v.qq.com') {
                    // 视频链接
                    let videoUrlList = ['https://v.qq.com/x/page/', 'https://v.qq.com/x/cover/'];
                    // 视频父级Id
                    let videoParentId = 'video_scroll_wrap';
                    // 新tab打开不处理
                    if (mClickElement.target == '_blank') {
                        return;
                    }
                    videoUrlList.forEach(function (videoUrl) {
                        if (String(mClickElement).indexOf(videoUrl) == 0) {
                            fullscreen();
                            return;
                        }
                    });
                    while (mClickElement.parentElement) {
                        if (mClickElement.parentElement.id == videoParentId) {
                            fullscreen();
                            return;
                        } else {
                            mClickElement = mClickElement.parentElement;
                        }
                    }
                }
            }
        }
    }
    window.addEventListener('load', function () {
        // 判断后台打开
        if (document.visibilityState == 'hidden') {
            console.log("now hidden, wait visible");
            document.addEventListener('visibilitychange', fullscreen);
        }
        // 前台打开，直接直行
        else {
            fullscreen();
        }
    });
})();