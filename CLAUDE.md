# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chrome Extension (Manifest V3) that scrapes comments from Facebook posts and exports them as CSV. It auto-scrolls to load all comments, expands collapsed comment threads, parses author/text/date from the DOM, and triggers a CSV download.

## Architecture

- **manifest.json** — MV3 manifest. Permissions: `activeTab`, `scripting`. Content script injected on `*.facebook.com`.
- **popup.html / popup.js** — Extension popup UI. Sends `START_SCRAPING` / `STOP_SCRAPING` messages to the content script via `chrome.tabs.sendMessage`. Listens for `UPDATE_STATUS` and `SCRAPING_FINISHED` messages back.
- **content.js** — Core scraping logic injected into Facebook pages. Pipeline: `autoScroll()` → `expandAllComments()` → `parseComments()` → `exportToCsv()`. Uses DOM selectors (`div[role="article"]`, `a[role="link"]`, `div[dir="auto"]`) that are Facebook-specific and may break when FB changes its markup. Has a mobile/transactional DOM fallback path.
- **hello.html** — Leftover from the Hello World starter template; not used by the extension.

## Development

No build step, no dependencies, no tests. Pure vanilla JS.

**Load in Chrome:**
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked" and select this directory

**Reload after changes:** Click the refresh icon on the extension card in `chrome://extensions`, then reload the Facebook tab.

## Key Considerations

- Facebook DOM selectors are fragile — FB uses dynamic class names and frequently changes markup structure. The extension relies on semantic attributes (`role="article"`, `dir="auto"`, `role="link"`) which are more stable but still subject to change.
- `parseComments()` has two parsing strategies: desktop (`div[role="article"]`) and mobile/transactional (`div[data-type="transactional"]`). When modifying parsing logic, test both paths.
- CSV export uses `data:` URI encoding via `encodeURI`, which has size limits in some browsers for very large exports.
