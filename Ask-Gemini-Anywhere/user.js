// ==UserScript==
// @name         一键发送到Gemini
// @name:en      Ask Gemini Anywhere
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.2
// @description  按快捷键选择页面元素，快速发送到Gemini
// @description:en  Select page elements with shortcut and quickly send to Gemini
// @author       tmr
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

const CONFIG = {
  SHORTCUT_TRIGGER: (e) => e.altKey && e.code === "Digit2",
  GENERATE_PROMPT: (data) => {
    const { title, url, selection, content } = data;
    const zh = navigator.language.toLowerCase().startsWith("zh");
    const prompts = [];
    if (zh) {
      prompts.push(`我正在阅读 ${url}`);
      prompts.push(`标题：${title}`);
      prompts.push("内容：");
    } else {
      prompts.push(`I'm reading ${url}`);
      prompts.push(`Title: ${title}`);
      prompts.push("Content:");
    }
    prompts.push("<content>");
    prompts.push(content);
    prompts.push("</content>");
    if (selection) {
      if (zh) {
        prompts.push(`其中${selection}如何理解？`);
      } else {
        prompts.push(`How to understand ${selection}?`);
      }
    } else {
      if (zh) {
        prompts.push("总结这篇文章");
      } else {
        prompts.push("Summarize this article");
      }
    }
    return prompts.join("\n");
  },
};

// Helper to wait for element using MutationObserver
function waitForElement(selector, checkFn = (el) => true) {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element && checkFn(element)) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element && checkFn(element)) {
        resolve(element);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// Initialize Gemini page to receive prompts
function initGeminiPage() {
  console.log("[Gemini] Initializing Gemini page");

  // Check for prompt from URL param or storage
  const urlParams = new URLSearchParams(window.location.search);
  const urlPrompt = urlParams.get("q");
  const prompt = urlPrompt || GM_getValue("gemini_prompt");

  if (prompt) {
    console.log("[Gemini] Found prompt, processing");

    waitForElement('div[contenteditable="true"], textarea')
      .then((inputBox) => {
        console.log("[Gemini] Input box found, filling prompt");
        inputBox.focus();
        inputBox.textContent = prompt;
        inputBox.dispatchEvent(new Event("input", { bubbles: true }));
        return waitForElement(
          'button .mat-icon[data-mat-icon-name="send"]',
          (icon) => {
            const btn = icon.closest("button");
            return btn && !btn.disabled;
          }
        );
      })
      .then((icon) => {
        console.log("[Gemini] Send button ready, clicking");
        icon.closest("button").click();
        // Clear prompt after sending if it came from storage
        if (!urlPrompt) {
          GM_deleteValue("gemini_prompt");
        }
      });
  }
}

// DOM Selector State
let selectorState = {
  active: false,
  overlay: null,
  currentElement: null,
  onSelect: null,
};

// Create and inject selector styles
function injectSelectorStyles() {
  if (document.getElementById("gemini-selector-styles")) return;

  const style = document.createElement("style");
  style.id = "gemini-selector-styles";
  style.textContent = `
    .gemini-selector-overlay {
      position: absolute;
      border: 3px solid #4285f4;
      background: rgba(66, 133, 244, 0.1);
      pointer-events: none;
      z-index: 2147483647;
      transition: all 0.1s ease;
      box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.3);
    }
    .gemini-selector-active {
      cursor: crosshair !important;
    }
    .gemini-selector-active * {
      cursor: crosshair !important;
    }
  `;
  document.head.appendChild(style);
}

// Create overlay element
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.className = "gemini-selector-overlay";
  overlay.style.display = "none";
  document.body.appendChild(overlay);
  return overlay;
}

// Update overlay position to highlight element
function highlightElement(element) {
  if (!selectorState.overlay) return;

  if (
    !element ||
    element === document.body ||
    element === document.documentElement
  ) {
    selectorState.overlay.style.display = "none";
    selectorState.currentElement = null;
    return;
  }

  const rect = element.getBoundingClientRect();
  const overlay = selectorState.overlay;

  overlay.style.display = "block";
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;

  selectorState.currentElement = element;
}

// Mouse move handler for highlighting
function handleMouseMove(e) {
  if (!selectorState.active) return;

  e.stopPropagation();
  const element = document.elementFromPoint(e.clientX, e.clientY);
  highlightElement(element);
}

// Click handler for selecting element
function handleClick(e) {
  if (!selectorState.active) return;

  e.preventDefault();
  e.stopPropagation();

  const element = selectorState.currentElement;
  if (element && selectorState.onSelect) {
    const content = element.innerText || "";
    selectorState.onSelect(content);
    deactivateSelector();
  }
}

// Keyboard handler for canceling
function handleKeydown(e) {
  if (!selectorState.active) return;

  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    console.log("[Selector] Canceled by user");
    deactivateSelector();
  }
}

// Activate DOM selector
function activateSelector(onSelect) {
  if (selectorState.active) return;

  console.log("[Selector] Activating DOM selector");

  injectSelectorStyles();
  selectorState.overlay = createOverlay();
  selectorState.active = true;
  selectorState.onSelect = onSelect;

  document.body.classList.add("gemini-selector-active");

  // Add event listeners with capture to intercept all events
  document.addEventListener("mousemove", handleMouseMove, true);
  document.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", handleKeydown, true);
}

// Deactivate DOM selector
function deactivateSelector() {
  if (!selectorState.active) return;

  console.log("[Selector] Deactivating DOM selector");

  document.body.classList.remove("gemini-selector-active");

  // Remove event listeners
  document.removeEventListener("mousemove", handleMouseMove, true);
  document.removeEventListener("click", handleClick, true);
  document.removeEventListener("keydown", handleKeydown, true);

  // Clean up overlay
  if (selectorState.overlay) {
    selectorState.overlay.remove();
    selectorState.overlay = null;
  }

  selectorState.active = false;
  selectorState.currentElement = null;
  selectorState.onSelect = null;
}

// Handle shortcut trigger
function handleShortcut(e) {
  if (!CONFIG.SHORTCUT_TRIGGER(e)) return;

  console.log("[Source] Shortcut triggered");
  e.preventDefault();

  const selection = window.getSelection().toString().trim();
  activateSelector((content) => {
    const promptText = CONFIG.GENERATE_PROMPT({
      title: document.title,
      url: window.location.href,
      selection,
      content,
    });
    console.log(
      "[Source] Generated prompt from element, length:",
      promptText.length
    );

    GM_setValue("gemini_prompt", promptText);

    const win = window.open(`https://gemini.google.com/app`, "_blank");
    if (!win) {
      console.log("[Source] Failed to open window");
      return;
    }
    console.log("[Source] Gemini window opened");
  });
}

(function () {
  "use strict";
  if (window.location.host === "gemini.google.com") {
    initGeminiPage();
  } else {
    window.addEventListener("keydown", handleShortcut);
  }
})();
