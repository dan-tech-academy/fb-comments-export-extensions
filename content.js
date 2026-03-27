// Content script for Facebook Comment Scraper

let isScraping = false;

console.log('FB Scraper: Content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_SCRAPING') {
    if (isScraping) return;
    isScraping = true;
    console.log('FB Scraper: Starting...');
    startScraping();
  } else if (request.action === 'STOP_SCRAPING') {
    isScraping = false;
    console.log('FB Scraper: Stopping...');
  }
});

async function startScraping() {
  updateStatus('Starting scraper...');
  
  // 1. Auto-scroll to load all main comments
  updateStatus('Scrolling to load comments...');
  await autoScroll();

  // 2. Expand all "View more comments" / "See more" buttons
  updateStatus('Expanding comments...');
  await expandAllComments();

  // 3. Parse comments
  updateStatus('Parsing comments...');
  const comments = parseComments();
  
  // 4. Export to CSV
  if (comments.length > 0) {
    updateStatus(`Exporting ${comments.length} comments...`);
    exportToCsv(comments);
    chrome.runtime.sendMessage({ 
        action: 'SCRAPING_FINISHED', 
        count: comments.length 
    });
  } else {
    updateStatus('No comments found.');
    isScraping = false;
  }
}

async function autoScroll() {
  return new Promise(async (resolve) => {
    let totalHeight = 0;
    let distance = 100;
    let timer = setInterval(() => {
        if (!isScraping) {
            clearInterval(timer);
            resolve();
            return;
        }

        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        // Check if we've reached the bottom or if new content loaded
        // For FB, we might need to be smarter, but simple scroll often triggers loading
        if(totalHeight >= scrollHeight){
            // Wait a bit to see if more content loads
            setTimeout(() => {
                let newScrollHeight = document.body.scrollHeight;
                if (newScrollHeight > scrollHeight) {
                    // More content loaded, continue
                } else {
                    // Reached bottom
                    clearInterval(timer);
                    resolve();
                }
            }, 2000); 
        }
    }, 100);
  });
}

async function expandAllComments() {
    // Helper to find buttons by text content (since classes change)
    // Common texts: "View more comments", "See more", "Reply", "View previous comments"
    const keywords = ["View more comments", "See more", "View previous comments", "replies"];
    
    let buttonsFound = true;
    while (buttonsFound && isScraping) {
        buttonsFound = false;
        // Find all role="button" or span/div that might be expanders
        const candidates = document.querySelectorAll('[role="button"], span, div');
        
        for (const btn of candidates) {
            if (!isScraping) break;
            
            // Check visibility
            if (btn.offsetParent === null) continue;

            const text = btn.innerText || btn.textContent;
            if (!text) continue;

            const isMatch = keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
            
            if (isMatch) {
                // Avoid clicking things that look like buttons but aren't the right ones if possible
                // For now, click and wait
                try {
                    btn.click();
                    buttonsFound = true;
                    await new Promise(r => setTimeout(r, 1000)); // Wait for expansion
                    
                    // Scroll to bottom to trigger any lazy loading
                    window.scrollTo(0, document.body.scrollHeight);
                    
                    // Update count
                    const currentCount = document.querySelectorAll('div[role="article"], div[data-type="transactional"]').length;
                    updateStatus(`Expanding... Found ~${currentCount} comments`);
                    
                } catch (e) {
                    // Ignore click errors
                }
            }
        }
        
        if (buttonsFound) {
            await new Promise(r => setTimeout(r, 2000)); // Wait for new content to settle
        }
    }
}

function parseComments() {
    const comments = [];
    
    // Strategy: Use role="article" which is the standard semantic wrapper for comments on Desktop.
    // This container wraps the Avatar, Author, Text, and Action/Date links.
    const articles = document.querySelectorAll('div[role="article"]');
    
    if (articles.length > 0) {
        articles.forEach(article => {
            let author = "Unknown";
            let text = "";
            let date = "Unknown";

            // 1. Author
            // Look for the link that looks like a profile link (has href and role="link")
            // CAUTION: The first link is often the Avatar (image), which we want to skip.
            // The Author Name link usually has text content.
            const links = article.querySelectorAll('a[role="link"]');
            let authorLink = null;
            
            for (const link of links) {
                // Skip if it contains an image/svg and has no visible text (heuristic for avatar)
                // But sometimes avatar has hidden text.
                // The name link usually has a span with dir="auto" inside.
                if (link.querySelector('span[dir="auto"]')) {
                    authorLink = link;
                    break;
                }
                
                // Fallback: if it has substantial text and no img
                if (link.innerText.trim().length > 0 && !link.querySelector('img, svg')) {
                    authorLink = link;
                    break;
                }
            }
            
            if (authorLink) {
                // Try to find the name span
                const nameSpan = authorLink.querySelector('span[dir="auto"]');
                if (nameSpan) {
                    author = nameSpan.innerText;
                } else {
                    author = authorLink.innerText;
                }
            }

            // 2. Comment Text
            // Look for the specific div with dir="auto" and style="text-align: start;"
            // This is very specific to the snippet provided.
            const textDiv = article.querySelector('div[dir="auto"][style="text-align: start;"]');
            if (textDiv) {
                text = textDiv.innerText;
            } else {
                // Fallback: Check for other text containers if the specific style isn't there
                // Exclude the author link text
                const allTextDivs = article.querySelectorAll('div[dir="auto"]');
                for (const div of allTextDivs) {
                    if (!div.contains(authorLink) && div.innerText !== author) {
                        text = div.innerText;
                        break;
                    }
                }
            }
            
            // Check for Images/Stickers if text is empty
            if (!text) {
                const img = article.querySelector('a[href*="photo"] img, div[role="button"] img');
                if (img) {
                    text = "[Image/Sticker]: " + (img.getAttribute('alt') || "No description");
                }
            }

            // 3. Date
            // The date is usually a link in the actions list (ul > li > a)
            // It often has a short text like "3d", "1w", "2h"
            // In the snippet, it's inside a ul.
            const listLinks = article.querySelectorAll('ul li a');
            if (listLinks.length > 0) {
                // The first link in the list is usually the date/timestamp
                date = listLinks[0].innerText;
            } else {
                // Fallback: Find any link with 'comment_id' that is NOT the author link
                const allLinks = article.querySelectorAll('a[href*="comment_id"]');
                for (const link of allLinks) {
                    if (link !== authorLink && link.innerText.length < 30) {
                        date = link.innerText;
                        break;
                    }
                }
            }

            if (author !== "Unknown") {
                comments.push({ author, text, date });
            }
        });
    }
    
    // Fallback for Mobile/Other views (Transaction based) if no articles found
    if (comments.length === 0) {
        const transactionalDivs = document.querySelectorAll('div[data-type="transactional"]');
        if (transactionalDivs.length > 0) {
            for (let i = 0; i < transactionalDivs.length; i++) {
                const container = transactionalDivs[i];
                const authorEl = container.querySelector('span.f20');
                const textEl = container.querySelector('span.f1');
                
                if (authorEl && textEl) {
                    let author = authorEl.innerText;
                    let text = textEl.innerText;
                    let date = "Unknown";
                    
                    if (i + 1 < transactionalDivs.length) {
                        const nextContainer = transactionalDivs[i+1];
                        const dateEl = nextContainer.querySelector('span.f19, span.f13, div[aria-label*="ago"]');
                        if (dateEl) {
                             date = dateEl.getAttribute('aria-label') || dateEl.innerText;
                        }
                    }
                    comments.push({ author, text, date });
                }
            }
        }
    }

    return comments;
}

function exportToCsv(comments) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Author,Comment,Date\n";
    
    comments.forEach(row => {
        const author = `"${(row.author || '').replace(/"/g, '""')}"`;
        const text = `"${(row.text || '').replace(/"/g, '""')}"`;
        const date = `"${(row.date || '').replace(/"/g, '""')}"`;
        csvContent += `${author},${text},${date}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fb_comments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateStatus(status) {
  chrome.runtime.sendMessage({ 
    action: 'UPDATE_STATUS', 
    status: status 
  });
}
