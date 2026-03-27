document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const statusDiv = document.getElementById('status');

  startBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('facebook.com')) {
      statusDiv.textContent = 'Error: Please open a Facebook post.';
      return;
    }

    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusDiv.textContent = 'Initializing scraper...';

    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'START_SCRAPING' });
    } catch (e) {
      statusDiv.textContent = 'Error: Could not connect to page. Refresh the page and try again.';
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  });

  stopBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'STOP_SCRAPING' });
      statusDiv.textContent = 'Stopping...';
    } catch (e) {
      console.error(e);
    }
    
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Listen for status updates from content script
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'UPDATE_STATUS') {
      statusDiv.textContent = message.status;
    } else if (message.action === 'SCRAPING_FINISHED') {
      statusDiv.textContent = `Finished! Scraped ${message.count} comments.`;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  });
});
