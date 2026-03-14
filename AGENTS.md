# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-14

## OVERVIEW
Project: **UserJS**
Stack: JavaScript (Userscripts), CSS (Userstyles)
A collection of custom userscripts and userstyles for various websites to enhance functionality or modify appearance.

## STRUCTURE
The project is a flat collection of directories and files, where each unit typically represents a single script or style.

*   `Ask-AI-Anywhere/`: A script to send web content (text & images) to various AI providers (Gemini, ChatGPT, etc.).
*   `Baidu-Search-Font-Size++/`: Userstyle to adjust font sizes on Baidu search.
*   `Chrome-Scrollbar-Beautify/`: Userstyle for scrollbar customization.
*   `Disable-SendBeacon/`: Script to disable `navigator.sendBeacon`.
*   `FT-Auto-Full-Article/`: Script for Financial Times to automatically show full articles.
*   `GitHub-Repo-Status/`: GitHub Repository Status (Creation date and popular forks).
*   `GitHub-File-History/`: GitHub File History (Open in githistory.xyz with ⚡️).
*   `GitHub-Star-History/`: GitHub Star History.
*   `Qireader-Keymap/`: Keybinding customizations for Qireader.
*   `Rename-Zhuhu-Daily-Title/`: Script to rename Zhihu Daily titles for better clarity.
*   `RSS-to-Clipboard/`: Script to copy RSS feed URLs to the clipboard.
*   `RSS-to-Inoreader/`: Script to quickly subscribe to RSS feeds in Inoreader.
*   `Video-Auto-Fullscreen/`: Script to automatically fullscreen videos.
*   `XYZ-Download/`: Download helper for specific sites.

## COMMANDS
There is no build system. Scripts are designed to be installed directly into a browser extension.

| Action | Description |
|--------|-------------|
| Install| Open `.user.js` in a browser with a Userscript manager (Tampermonkey, Violentmonkey, etc.) |
| Style  | Import `.user.css` into a Userstyle manager (Stylus) |

## CODING STANDARDS
*   **Language**: JavaScript (ES6+), CSS.
*   **Metadata**: Every Userscript must start with a `// ==UserScript==` block. Standard tags include:
    - `@namespace`: `https://blog.xlab.app/`
    - `@author`: `tmr`
    - `@supportURL`: `https://github.com/ttttmr/UserJS` (Link to the repository)
    - `@version`: Standard format is `X.Y`. Default starts at `0.1`. The minor version `Y` is a counter (e.g., `0.9` -> `0.10`). Increment `Y` for each update. Major version `X` is only bumped for significant changes.
*   **Security**: Avoid using `innerHTML` to prevent XSS. Use `textContent`, `innerText`, or `document.createElement` when dealing with user-controlled or external data.
*   **APIs**: Extensive use of Greasemonkey/Tampermonkey `GM_*` APIs for persistent storage (`GM_setValue`), networking (`GM_xmlhttpRequest`), and menu commands (`GM_registerMenuCommand`).
*   **Patterns**: 
    - Use IIFE or modules for scoping.
    - DOM manipulation using native `querySelector`, `MutationObserver`, and `document.createElement`.
    - Handling SPAs (Single Page Applications) via listeners for events like `turbo:render` (for GitHub) or custom observers.

## WHERE TO LOOK
*   **Source**: Each script's root or directory (e.g., `Ask-AI-Anywhere/user.js`).
*   **Docs**: Individual `README.md` files within directories if available.

## NOTES
*   Many scripts target specific DOM structures; these may break if the target website updates its UI.
*   `Ask-AI-Anywhere` is the most complex script, utilizing a `DomSelector` class and handling multiple AI providers via a configuration object.
