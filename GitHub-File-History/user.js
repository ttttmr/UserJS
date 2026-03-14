// ==UserScript==
// @name         GitHub File History
// @namespace    https://blog.xlab.app/
// @supportURL   https://github.com/ttttmr/UserJS
// @version      0.8
// @description  GitHub File History (Open in github.githistory.xyz)
// @author       tmr
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  function injectButton() {
    // Only show on file pages (GitHub uses /blob/ for files)
    if (!window.location.pathname.includes('/blob/')) return;

    if (document.getElementById('gh-file-history-btn')) return;

    // Find the native history button
    const historyIcon = document.querySelector("svg.octicon-history");
    if (!historyIcon) return;

    const nativeBtn = historyIcon.closest('a');
    if (!nativeBtn) return;

    // The nativeBtn is usually inside a list item or a div group
    const container = nativeBtn.parentElement;
    if (!container) return;

    // Create our button by cloning the native one to keep the style
    const githistoryBtn = nativeBtn.cloneNode(true);
    githistoryBtn.id = 'gh-file-history-btn';
    
    // Distinguish it: Add a lightning emoji
    const textNode = Array.from(githistoryBtn.childNodes).find(n => n.nodeType === Node.TEXT_NODE || n.tagName === 'SPAN');
    if (textNode) {
        if (textNode.tagName === 'SPAN') {
            textNode.textContent = ' ⚡️';
        } else {
            textNode.textContent = ' ⚡️';
        }
    } else {
        // Fallback
        githistoryBtn.appendChild(document.createTextNode(' ⚡️'));
    }

    // Update URL
    githistoryBtn.href = githistoryBtn.href.replace("github.com", "github.githistory.xyz");
    
    // Style hint
    githistoryBtn.title = 'Open in GitHistory'; // Add tooltip since text is gone

    // Insert next to the native button
    container.parentNode.insertBefore(githistoryBtn, container.nextSibling);
  }

  // Run and observe for SPA navigation
  injectButton();
  
  const observer = new MutationObserver(() => {
    injectButton();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
