<div align="center">

<img src="banner.svg" alt="FB Comment Scraper" width="100%">

<br>

**Chrome Extension (Manifest V3) to scrape Facebook post comments and export to CSV**

[![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![Manifest](https://img.shields.io/badge/Manifest-V3-34A853?logo=google&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

</div>

## Demo

<p align="center">
  <img src="demo.svg" alt="FB Comment Scraper Demo" width="340">
</p>

## Features

| Feature | Description |
|---------|-------------|
| **Auto-Scroll** | Scrolls the entire page to load all comments |
| **Thread Expansion** | Clicks "View more comments", "See more", and reply threads |
| **Smart Parsing** | Extracts author name, comment text, and timestamp |
| **CSV Export** | One-click download as `fb_comments.csv` |
| **Dual Layout** | Works on both desktop and mobile Facebook views |

## Quick Start

### 1. Install

```bash
git clone https://github.com/dan-tech-academy/fb-comments-export-extensions.git
```

Then load in Chrome:

```
chrome://extensions → Enable Developer mode → Load unpacked → Select folder
```

### 2. Scrape

```
Open Facebook post → Resize window to narrow width* → Click extension → Start Scraping
```

> **Pro tip:** Resize the browser window to a narrow width so Facebook loads its mobile layout. This makes scraping **more precise and faster**.

### 3. Export

The extension auto-downloads `fb_comments.csv` when finished:

```csv
Author,Comment,Date
"John Doe","Great post!","2d"
"Jane Smith","Thanks for sharing","1w"
```

## How It Works

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│  Popup   │────▶│  Auto-Scroll │────▶│   Expand     │────▶│   Parse    │
│  Start   │     │  Load All    │     │   Threads    │     │  Comments  │
└──────────┘     └──────────────┘     └──────────────┘     └─────┬──────┘
                                                                  │
                                                                  ▼
                                                           ┌────────────┐
                                                           │  Download  │
                                                           │   CSV      │
                                                           └────────────┘
```

## Limitations

- Facebook frequently changes its DOM structure — selectors may need updating if scraping stops working.
- Very large exports may hit browser size limits for `data:` URI downloads.

---

<div align="center">

### Sponsored by

[![DanTech Academy](https://img.shields.io/badge/DanTech-Academy-FF6B00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsMTAgNSAxMC01TTIgMTJsMTAgNSAxMC01Ii8+PC9zdmc+&logoColor=white)](https://www.dantech.academy)

**Part of the tutorial series by [DanTech Academy](https://www.dantech.academy)**

This project is sponsored by the [**Kotlin Accelerator Course**](https://www.dantech.academy/kotlin-accelerator) — a hands-on course to master Kotlin from fundamentals to advanced topics.

[![Kotlin Accelerator](https://img.shields.io/badge/Enroll_Now-Kotlin_Accelerator-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://www.dantech.academy/kotlin-accelerator)

---

**MIT License** · Made with JavaScript · No dependencies

</div>
