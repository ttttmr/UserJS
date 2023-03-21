// ==UserScript==
// @name         GitHub File History
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.5
// @description  GitHub File History 快速跳转到 https://github.githistory.xyz/
// @author       tmr
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";
  let count = 0;
  function run() {
    if (document.readyState == "complete" && count > 10) {
      return;
    }
    count++;
    let h = document.querySelector(".react-last-commit-history-group");
    if (h == null) {
      setTimeout(run, 500);
      return;
    }

    let hp = h.parentElement;
    if (hp == null) {
      setTimeout(run, 500);
      return;
    }

    let ac = h.cloneNode(true);
    ac.lastChild.lastChild.lastChild.lastChild.textContent = "Git History";
    ac.href = ac.href.replace("github.com", "github.githistory.xyz");
    hp.appendChild(ac);
  }
  run();
})();
