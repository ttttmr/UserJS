// ==UserScript==
// @name         一键发送到AI
// @name:en      Ask AI Anywhere
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.3
// @description  按快捷键选择页面元素，快速发送到Gemini/ChatGPT/AI Studio
// @description:en  Select page elements with shortcut and quickly send to Gemini/ChatGPT/AI Studio
// @author       tmr
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

const CONFIG = {
  SHORTCUT_TRIGGER: (e) => e.altKey && e.code === "Digit2",
  PROVIDERS: {
    gemini: {
      name: "Gemini",
      url: "https://gemini.google.com/app",
      inputSelector: 'div[contenteditable="true"], textarea',
      sendButtonSelector: 'button .mat-icon[data-mat-icon-name="send"]',
    },
    chatgpt: {
      name: "ChatGPT",
      url: "https://chatgpt.com/",
      inputSelector: "#prompt-textarea p",
      sendButtonSelector: 'button[data-testid="send-button"]',
    },
    aistudio: {
      name: "AI Studio",
      url: "https://aistudio.google.com/prompts/new_chat",
      inputSelector: "ms-autosize-textarea textarea",
      sendButtonSelector: 'button[aria-label="Run"]',
    },
  },
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
        prompts.push("使用通俗的语言总结这篇文章");
      } else {
        prompts.push("Summarize this article in plain language");
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

// Initialize Provider page to receive prompts
function initProviderPage(providerConfig) {
  console.log(`[Ask] Initializing ${providerConfig.name} page`);

  // Check for prompt from URL param or storage
  const urlParams = new URLSearchParams(window.location.search);
  // Use a generic key 'ask_prompt'
  const urlPrompt = urlParams.get("q");
  const prompt = urlPrompt || GM_getValue("ask_prompt");

  if (prompt) {
    console.log("[Ask] Found prompt, processing");

    waitForElement(providerConfig.inputSelector)
      .then((inputBox) => {
        console.log("[Ask] Input box found, filling prompt");
        inputBox.focus();
        inputBox.value = prompt; // For textarea
        inputBox.textContent = prompt; // For contenteditable

        inputBox.dispatchEvent(new Event("input", { bubbles: true }));
        inputBox.dispatchEvent(new Event("change", { bubbles: true }));

        return waitForElement(providerConfig.sendButtonSelector, (btn) => {
          return !btn.disabled;
        });
      })
      .then((btn) => {
        console.log("[Ask] Send button ready, clicking");
        // Small delay to ensure UI is ready
        setTimeout(() => {
          btn.click();
          // Clear prompt after sending if it came from storage
          if (!urlPrompt) {
            GM_deleteValue("ask_prompt");
          }
        }, 500);
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
  if (document.getElementById("ask-ai-anywhere-selector-styles")) return;

  const style = document.createElement("style");
  style.id = "ask-ai-anywhere-selector-styles";
  style.textContent = `
    .ask-ai-anywhere-selector-overlay {
      position: absolute;
      border: 3px solid #4285f4;
      background: rgba(66, 133, 244, 0.1);
      pointer-events: none;
      z-index: 2147483647;
      transition: all 0.1s ease;
      box-shadow: 0 0 0 1px rgba(66, 133, 244, 0.3);
    }
    .ask-ai-anywhere-selector-active {
      cursor: crosshair !important;
    }
    .ask-ai-anywhere-selector-active * {
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

  document.body.classList.add("ask-ai-anywhere-selector-active");

  // Add event listeners with capture to intercept all events
  document.addEventListener("mousemove", handleMouseMove, true);
  document.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", handleKeydown, true);
}

// Deactivate DOM selector
function deactivateSelector() {
  if (!selectorState.active) return;

  console.log("[Selector] Deactivating DOM selector");

  document.body.classList.remove("ask-ai-anywhere-selector-active");

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

    GM_setValue("ask_prompt", promptText);

    const currentProviderKey = GM_getValue("provider", "gemini");
    const provider =
      CONFIG.PROVIDERS[currentProviderKey] || CONFIG.PROVIDERS.gemini;

    const win = window.open(provider.url, "_blank");
    if (!win) {
      console.log("[Source] Failed to open window");
      return;
    }
    console.log(`[Source] ${provider.name} window opened`);
  });
}

let menuIds = [];

// Register menu command to switch provider
function registerMenuCommands() {
  // Unregister existing commands
  for (const id of menuIds) {
    GM_unregisterMenuCommand(id);
  }
  menuIds = [];

  const currentProviderKey = GM_getValue("provider", "gemini");

  Object.entries(CONFIG.PROVIDERS).forEach(([key, config]) => {
    const isCurrent = currentProviderKey === key;
    const title = isCurrent ? `✅ ${config.name}` : `⬜ ${config.name}`;

    const id = GM_registerMenuCommand(title, () => {
      GM_setValue("provider", key);
      registerMenuCommands(); // Re-register to update checkmarks
    });
    menuIds.push(id);
  });
}

(function () {
  "use strict";

  // Check if we are on a provider page
  const currentUrl = window.location.href;
  for (const [key, config] of Object.entries(CONFIG.PROVIDERS)) {
    if (currentUrl.startsWith(config.url)) {
      initProviderPage(config);
      return; // Exit if we are on a provider page
    }
  }

  // Otherwise, we are on a source page
  registerMenuCommands();
  window.addEventListener("keydown", handleShortcut);
})();
