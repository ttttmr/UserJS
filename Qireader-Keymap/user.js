// ==UserScript==
// @name        Qireader keymap
// @namespace   https://blog.xlab.app/
// @more        https://github.com/ttttmr/UserJS
// @match       https://www.qireader.com.cn/*
// @match       https://www.qireader.com/*
// @grant       none
// @version     0.2
// @author      tmr
// @grant       GM_openInTab
// @inject-into content
// ==/UserScript==

(function () {
  const keyMap = {
    b: OpenBGEntry,
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
    if (!currEntry) {
      currEntry = event.target.closest("article");
    }
  });

  function EntryLink() {
    if (!currEntry) {
      return false;
    }
    if (currEntry.tagName == "DIV") {
      return currEntry.querySelector('a[data-is-entry-title="true"]').href;
    }
    if (currEntry.tagName == "ARTICLE") {
      return currEntry.dataset.articleUrl;
    }
  }

  function EntryNav() {
    if (!currEntry) {
      return [];
    }
    if (currEntry.tagName == "ARTICLE") {
      let nav;
      let parent = currEntry.parentElement;
      while (parent) {
        nav = Array.from(parent.children).find((e) => e.tagName === "NAV");
        if (nav) {
          break;
        }
        parent = parent.parentElement;
      }
      if (nav) {
        return Array.from(nav.children);
      }
    }
    return [];
  }

  function StarEntry() {
    if (!currEntry) {
      return false;
    }
    if (currEntry.tagName == "DIV") {
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
    if (currEntry.tagName == "ARTICLE") {
      EntryNav().forEach((e) => e.title === "稍后阅读" && e.click());
    }
  }

  function ReadEntry(force = false) {
    if (!currEntry) {
      return false;
    }
    if (currEntry.tagName == "DIV") {
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
            (e.textContent === "标记为已读" || (!force  && e.textContent === "标记为未读")              ) &&
            e.click()
        );
      menu.remove();
      return true;
    }
    if (currEntry.tagName == "ARTICLE") {
      EntryNav().forEach((e) => (e.title === "标记为已读" || (!force && e.title === "标记为未读")) && e.click());
    }
  }

  function OpenBGEntry() {
    if (!currEntry) {
      return false;
    }
    ReadEntry(true);
    GM_openInTab(EntryLink(), {
      active: false,
    });
    return true;
  }
})();
