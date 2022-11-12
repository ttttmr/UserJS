// ==UserScript==
// @name         GitHub File History
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.4
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
    // document.querySelector(".octicon.octicon-history").parentElement.parentElement.parentElement
    let h = document.querySelector(".octicon.octicon-history");
    if (h == null) {
      setTimeout(run, 500);
      return;
    }

    let hp = h.parentElement;
    if (hp == null) {
      setTimeout(run, 500);
      return;
    }

    let hpp = hp.parentElement;
    if (hpp == null) {
      setTimeout(run, 500);
      return;
    }

    let hppp = hpp.parentElement;
    if (hppp == null) {
      setTimeout(run, 500);
      return;
    }

    let ac = hpp.cloneNode(true);
    ac.lastChild.textContent="Git History"
    ac.href=ac.href.replace("github.com", "github.githistory.xyz")
    hppp.appendChild(ac);
  }
  run();
})();
