# Ask AI Anywhere

[中文](README_zh.md)

A userscript that allows you to quickly send page content to AI (Gemini, ChatGPT, AI Studio) for summary or conversation.

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/), [Violentmonkey](https://violentmonkey.github.io/), or [ScriptCat](https://docs.scriptcat.org/).
2. Install this script from [GreasyFork](https://greasyfork.org/en/scripts/556649-%E4%B8%80%E9%94%AE%E5%8F%91%E9%80%81%E5%88%B0gemini).

## Supported Providers

- **Gemini** (Default)
- **ChatGPT**
- **Google AI Studio**
- **DeepSeek**

You can switch between providers using the Tampermonkey menu command "Switch Provider". The script will remember your choice.

## Usage

### 1. Summarize Mode

- Press `Alt + 2` (Windows) or `Option + 2` (Mac) to activate the element selector.
- Click on any element (e.g., the main article content).
- The AI will summarize the content of the clicked element.

### 2. Q&A Mode

- First, select specific text on the page with your mouse.
- Press `Alt + 2` / `Option + 2`.
- Click on the surrounding element (context).
- The AI will explain the selected text based on the context you clicked.

### 3. Custom Search Engine Support

- The script supports a `q` query parameter, designed to work with browser custom search engines.
- You can add a new search engine in your browser settings with the URL: `https://gemini.google.com/app?q=%s`.
- Then you can type your keyword (e.g., `g`) followed by your query in the address bar to directly send it to the current AI provider.
