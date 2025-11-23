# Ask Gemini Anywhere (一键发送到 Gemini)

[English](README.md)

这是一个用户脚本，允许你快速将网页内容发送到 Gemini 进行分析、总结或翻译。

## 安装

1. 安装用户脚本管理器，如 [Tampermonkey](https://www.tampermonkey.net/) (篡改猴)、[Violentmonkey](https://violentmonkey.github.io/) (暴力猴) 或 [ScriptCat](https://docs.scriptcat.org/) (脚本猫)。
2. 从 [GreasyFork](https://greasyfork.org/zh-CN/scripts/556649-%E4%B8%80%E9%94%AE%E5%8F%91%E9%80%81%E5%88%B0gemini) 安装此脚本。

## 使用方法

### 1. 总结模式

- 按下 `Alt + 2` (Windows) 或 `Option + 2` (Mac) 激活元素选择器。
- 点击页面上的任意元素（例如文章正文）。
- Gemini 将总结你点击的元素内容。

### 2. 问答模式

- 先用鼠标划选页面上的特定文本。
- 按下 `Alt + 2` / `Option + 2`。
- 点击包含该文本的元素（作为上下文）。
- Gemini 将结合你点击的上下文来解释你划选的文本。

### 3. 自定义搜索引擎支持

- 脚本支持 `q` 查询参数，这主要是为了适配浏览器的自定义搜索引擎功能。
- 你可以在浏览器设置中添加一个新的搜索引擎，URL 填写为：`https://gemini.google.com/app?q=%s`。
- 之后，你就可以在地址栏输入你设置的关键字（例如 `g`）加上你的问题，直接发送给 Gemini。
