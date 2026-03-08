// ============== WebIn Background Service Worker ==============

console.log(
  "%c[WebIn] Service Worker Loaded",
  "color: #4caf50; font-weight: bold; font-size: 14px;",
);

// ============== Icon Cache for WebIn Overlay ==============
const iconCache = new Map();

// Fetch icon and convert to base64 data URL
async function fetchIconAsDataUrl(url) {
  if (iconCache.has(url)) {
    return iconCache.get(url);
  }

  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) throw new Error("Fetch failed");

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        iconCache.set(url, dataUrl);
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("[WebIn] Icon fetch failed:", url, error);
    return null;
  }
}

// ============== Message Listener ==============
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // WebIn Icon Fetch Handler
  if (request.action === "fetchIcon") {
    fetchIconAsDataUrl(request.url)
      .then((dataUrl) => sendResponse({ dataUrl }))
      .catch(() => sendResponse({ dataUrl: null }));
    return true;
  }
});

// ============== WebIn Overlay Command ==============
chrome.commands.onCommand.addListener((command) => {
  if (command === "launch_overlay") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          files: [
            "webin/config.js",
            "webin/state.js",
            "webin/styles.js",
            "webin/styles2.js",
            "webin/styles3.js",
            "webin/modals.js",
            "webin/ui.js",
            "webin/tabs.js",
            "webin/events.js",
            "webin/inject.js",
          ],
        })
        .catch((err) => console.error("[WebIn] Injection failed:", err));
    });
  }
});
