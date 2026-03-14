// ==UserScript==
// @name         GitHub Repo Status
// @namespace    https://blog.xlab.app/
// @supportURL   https://github.com/ttttmr/UserJS
// @version      0.1
// @description  GitHub Repository Status (Creation date and popular forks)
// @author       tmr
// @match        https://github.com/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// ==/UserScript==

(function() {
    'use strict';

    function getRepoInfo() {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (pathParts.length < 2) return null;
        return {
            owner: pathParts[0],
            repo: pathParts[1]
        };
    }

    async function fetchHighStarForks(owner, repo) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.github.com/repos/${owner}/${repo}/forks?sort=stargazers&per_page=3`,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            resolve([]);
                        }
                    } else {
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    }

    function createIcon(svgPath, size = 16) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("height", size);
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", size);
        svg.classList.add("octicon", "color-fg-muted", "mr-2");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", svgPath);
        svg.appendChild(path);
        return svg;
    }

    async function injectStatus() {
        if (document.getElementById('github-repo-status-extra')) return;

        const repoInfo = getRepoInfo();
        if (!repoInfo) return;

        try {
            const scriptTag = document.querySelector('script[data-target="react-app.embeddedData"]');
            if (!scriptTag) return;

            const data = JSON.parse(scriptTag.textContent);
            
            const findKey = (obj, key) => {
                if (!obj || typeof obj !== 'object') return null;
                if (obj[key] !== undefined) return obj[key];
                for (const k in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, k)) {
                        const result = findKey(obj[k], key);
                        if (result) return result;
                    }
                }
                return null;
            };

            const createdAt = findKey(data, 'createdAt');
            if (!createdAt) return;

            const date = new Date(createdAt);
            const formattedDate = date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const aboutH2 = Array.from(document.querySelectorAll('.BorderGrid-row h2'))
                .find(h2 => h2.textContent.trim() === 'About');
            if (!aboutH2) return;

            const aboutRow = aboutH2.closest('.BorderGrid-row');
            if (!aboutRow) return;

            // Root status row
            const statusRow = document.createElement('div');
            statusRow.className = 'BorderGrid-row';
            statusRow.id = 'github-repo-status-extra';

            const borderGridCell = document.createElement('div');
            borderGridCell.className = 'BorderGrid-cell';
            statusRow.appendChild(borderGridCell);

            const title = document.createElement('h2');
            title.className = 'h4 mb-3';
            title.textContent = 'Status';
            borderGridCell.appendChild(title);

            const list = document.createElement('ul');
            list.className = 'list-style-none';
            borderGridCell.appendChild(list);

            // Created Date Item
            const dateLi = document.createElement('li');
            dateLi.className = 'mt-3 d-flex flex-items-center';
            const calendarIcon = createIcon("M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z");
            const dateSpan = document.createElement('span');
            dateSpan.className = 'color-fg-muted';
            dateSpan.textContent = `Created on ${formattedDate}`;
            dateLi.appendChild(calendarIcon);
            dateLi.appendChild(dateSpan);
            list.appendChild(dateLi);

            // High star forks container
            const forksContainer = document.createElement('li');
            forksContainer.id = 'github-high-star-forks';
            list.appendChild(forksContainer);

            aboutRow.parentNode.insertBefore(statusRow, aboutRow.nextSibling);

            // Fetch and inject high star forks
            const forks = await fetchHighStarForks(repoInfo.owner, repoInfo.repo);
            if (forks && forks.length > 0) {
                forks.forEach(fork => {
                    if (fork.stargazers_count > 0) {
                        const forkDiv = document.createElement('div');
                        forkDiv.className = 'mt-3 d-flex flex-items-center';

                        const forkIcon = createIcon("M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 10a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z");
                        
                        const link = document.createElement('a');
                        link.href = fork.html_url;
                        link.className = 'Link--muted no-underline d-flex flex-items-center';

                        const ownerSpan = document.createElement('span');
                        ownerSpan.className = 'color-fg-default mr-1';
                        ownerSpan.textContent = fork.owner.login;

                        const nameSpan = document.createElement('span');
                        nameSpan.className = 'color-fg-muted';
                        nameSpan.textContent = `/ ${fork.name}`;

                        const starSpan = document.createElement('span');
                        starSpan.className = 'd-flex flex-items-center ml-2 color-fg-muted';
                        const starIcon = createIcon("M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.145L6.711 5.046a.75.75 0 0 1-.564.41l-3.099.45 2.242 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.242-2.184-3.1-.45a.75.75 0 0 1-.563-.41L8 2.395Z", 14);
                        starIcon.classList.remove('mr-2');
                        starIcon.classList.add('mr-1');

                        const starCount = document.createTextNode(fork.stargazers_count.toString());
                        
                        starSpan.appendChild(starIcon);
                        starSpan.appendChild(starCount);

                        link.appendChild(ownerSpan);
                        link.appendChild(nameSpan);
                        link.appendChild(starSpan);

                        forkDiv.appendChild(forkIcon);
                        forkDiv.appendChild(link);
                        forksContainer.appendChild(forkDiv);
                    }
                });
            }

        } catch (e) {
            console.error('[GitHub Status Extra] Error:', e);
        }
    }

    injectStatus();
    // GitHub uses Turbo for navigation
    document.addEventListener('turbo:render', injectStatus);
    document.addEventListener('turbo:load', injectStatus);

    // Some cases might need a small delay or observation if Turbo events fire too early
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                if (document.querySelector('.BorderGrid-row') && !document.getElementById('github-repo-status-extra')) {
                    injectStatus();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
