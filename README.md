# Facebook Comment Scraper — Chrome Extension

Chrome Extension (Manifest V3) that scrapes comments from Facebook posts and exports them as a CSV file.

## Features

- Auto-scrolls to load all comments on a post
- Expands collapsed comment threads ("View more comments", "See more", replies)
- Parses author name, comment text, and timestamp
- Exports results as a downloadable CSV file
- Supports both desktop and mobile Facebook layouts

## Installation

1. Clone this repository.
2. Navigate to `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this directory.

## Usage

1. Open a Facebook post with comments.
2. **Tip:** Resize the browser window to a narrow width so Facebook loads its mobile layout — this makes scraping more precise and faster.
3. Click the extension icon in the toolbar.
4. Click **Start Scraping** — the extension will scroll, expand threads, and parse comments.
5. A `fb_comments.csv` file will download automatically when finished.
6. Click **Stop** at any time to cancel.

## Limitations

- Facebook frequently changes its DOM structure — selectors may need updating if scraping stops working.
- Very large exports may hit browser size limits for `data:` URI downloads.

## Sponsor

This project is part of the tutorial series by [DanTech Academy](https://www.dantech.academy).

Sponsored by the [Kotlin Accelerator Course](https://www.dantech.academy/kotlin-accelerator) — a hands-on course to master Kotlin from fundamentals to advanced topics.

## License

MIT
