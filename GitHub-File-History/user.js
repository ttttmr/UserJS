// ==UserScript==
// @name         GitHub File History
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  GitHub File History 快速跳转到 https://github.githistory.xyz/
// @author       tmr
// @match        https://github.com/*/*
// @grant        none
// ==/UserScript==

(async function () {
  "use strict";
  function run() {
    let raw = document.querySelector("#raw-url");
    if (raw == null) setTimeout(run, 1000);

    let bg = raw.parentElement;
    if (bg == null) setTimeout(run, 1000);

    let link = document.createElement("a");
    let u = location.href;
    link.href = u.replace("github.com", "github.githistory.xyz");
    link.className = "btn-sm btn BtnGroup-item";
    link.target = "_blank";
    link.innerText = "History";

    bg.appendChild(link);
  }
  run();
})();
