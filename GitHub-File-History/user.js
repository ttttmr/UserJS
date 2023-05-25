// ==UserScript==
// @name         GitHub File History
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.6
// @description  GitHub File History 快速跳转到 https://github.githistory.xyz/
// @author       tmr
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";
  let count = 0;
  function run() {
    if (document.readyState == "complete" && count > 5) {
      return;
    }
    count++;
    let n = document.querySelector("a[aria-label='History']");
    if (n == null) {
      setTimeout(run, 500);
      return;
    }

    let cn = n.cloneNode(true);
    cn.lastChild.textContent = "Git History";
    cn.href = cn.href.replace("github.com", "github.githistory.xyz");
    n.parentElement.append(cn);
  }
  run();
})();
