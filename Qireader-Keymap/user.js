// ==UserScript==
// @name        Qireader keymap
// @namespace   https://blog.xlab.app/
// @more        https://github.com/ttttmr/UserJS
// @match       https://www.qireader.com.cn/*
// @match       https://www.qireader.com/*
// @grant       none
// @version     0.1
// @author      tmr
// @grant       GM_openInTab
// @inject-into content
// ==/UserScript==

(function () {
  const keyMap = {
    v: OpenBGEntry,
    s: StarEntry,
  };

  function onKeyDownEvent(event) {
    if (keyMap[event.key]) {
      console.log("key", event.key);
      if (keyMap[event.key]()) {
        event.preventDefault();
      }
    }
  }
  document.addEventListener("keydown", onKeyDownEvent);

  let currEntry = null;
  document.addEventListener("mouseover", (event) => {
    currEntry = event.target.closest("div[data-is-entry]");
  });

  function EntryLink() {
    return currEntry.querySelector('a[data-is-entry-title="true"]').href;
  }

  function StarEntry() {
    if (!currEntry) {
      return false;
    }
    const menuEvent = new MouseEvent("contextmenu", {
      button: 2,
      bubbles: true,
      cancelable: true,
    });
    currEntry.dispatchEvent(menuEvent);
    const menu = document.querySelector('div[data-is-menu="true"]');
    menu
      .querySelectorAll("div>span")
      .forEach((e) => e.textContent === "稍后阅读" && e.click());
    menu.remove();
    return true;
  }

  function ReadEntry() {
    if (!currEntry) {
      return false;
    }
    const menuEvent = new MouseEvent("contextmenu", {
      button: 2,
      bubbles: true,
      cancelable: true,
    });
    currEntry.dispatchEvent(menuEvent);
    const menu = document.querySelector('div[data-is-menu="true"]');
    menu
      .querySelectorAll("div>span")
      .forEach(
        (e) =>
          (e.textContent === "标记为未读" || e.textContent === "标记为已读") &&
          e.click()
      );
    menu.remove();
    return true;
  }

  function OpenBGEntry() {
    if (!currEntry) {
      return false;
    }
    ReadEntry();
    GM_openInTab(EntryLink(), {
      active: false,
    });
    return true;
  }
})();
