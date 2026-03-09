// ==UserScript==
// @name         小宇宙播客下载器
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  在播放键旁边添加下载按钮
// @author       tmr
// @match        https://www.xiaoyuzhoufm.com/episode/*
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    function getAudioData() {
        try {
            const nextData = JSON.parse(document.getElementById('__NEXT_DATA__').textContent);
            const episode = nextData.props.pageProps.episode;
            const audioUrl = episode.enclosure.url;
            const podcastName = episode.podcast.title;
            const episodeName = episode.title;
            const extension = audioUrl.split('.').pop().split('?')[0] || 'm4a';
            const fileName = `${podcastName}_${episodeName}.${extension}`.replace(/[\\/:*?"<>|]/g, '_');
            return { audioUrl, fileName };
        } catch (e) {
            const audioUrl = document.querySelector('audio')?.src;
            const fileName = (document.querySelector('h1')?.textContent?.trim() || 'podcast') + '.m4a';
            return { audioUrl, fileName };
        }
    }

    function createButton(container) {
        if (document.getElementById('xyz-download-btn')) return;

        const { audioUrl, fileName } = getAudioData();
        if (!audioUrl) return;

        const btn = document.createElement('button');
        btn.id = 'xyz-download-btn';
        btn.textContent = '下载';
        
        btn.style.cssText = `
            margin-left: 15px !important;
            padding: 4px 14px !important;
            background-color: var(--theme-color);
            color: #ffffff !important;
            border: none !important;
            border-radius: 20px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            vertical-align: middle !important;
            transition: transform 0.2s, background-color 0.2s !important;
            line-height: 1 !important;
            height: 28px !important;
            flex-shrink: 0 !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        `;

        btn.onmouseover = () => { 
            btn.style.transform = 'scale(1.05)';
        };
        btn.onmouseout = () => { 
            btn.style.transform = 'scale(1)';
        };

        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const originalText = btn.textContent;
            btn.textContent = '获取中...';

            GM_download({
                url: audioUrl,
                name: fileName,
                saveAs: false,
                onload: () => { 
                    btn.textContent = '完成';
                    setTimeout(() => { btn.textContent = originalText; }, 2000);
                },
                onerror: (err) => {
                    window.open(audioUrl, '_blank');
                    btn.textContent = '重试';
                }
            });
        };

        container.appendChild(btn);
    }

    // 核心执行逻辑
    function run() {
        // 播放控制栏的类名可能会随版本变化，这里优先匹配控制栏容器
        const controlBar = document.querySelector('.css-146saol');
        if (controlBar) {
            createButton(controlBar);
        }
    }

    // 监听 URL 变化（处理单页应用内跳转）
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            const oldBtn = document.getElementById('xyz-download-btn');
            if (oldBtn) oldBtn.remove();
            run();
        }
    }

    // 使用 MutationObserver 监听 DOM，比 setInterval 效率高得多
    const observer = new MutationObserver((mutations) => {
        // 只有当 URL 变化或者按钮不存在时才尝试执行
        if (location.href !== lastUrl) {
            checkUrlChange();
        } else if (!document.getElementById('xyz-download-btn')) {
            // 使用 requestAnimationFrame 确保在浏览器空闲帧执行，不阻塞 UI
            window.requestAnimationFrame(run);
        }
    });

    // 启动观察
    observer.observe(document.body, { childList: true, subtree: true });

    // 处理浏览器前进后退
    window.addEventListener('popstate', checkUrlChange);

    // 首次加载执行
    run();
})();
