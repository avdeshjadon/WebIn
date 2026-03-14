// ----------------------------------------------------------------------------
// WebIn -- Floating Overlay for Instant Access to Web Applications
// ----------------------------------------------------------------------------
// Author   : Avdesh Jadon
// GitHub   : https://github.com/avdeshjadon
// License  : MIT License -- free to use, modify, and distribute.
//            See LICENSE file in the project root for full license text.
// ----------------------------------------------------------------------------
// If this project helped you, consider starring the repository, opening a
// pull request, or reporting issues on GitHub. Contributions are welcome.
// ----------------------------------------------------------------------------
//
// background.js -- Extension Service Worker
// ===========================================================
// Background service worker for the WebIn Chrome Extension. Handles:
//   - Keyboard shortcut commands to toggle the overlay on any page.
//   - Icon fetching and caching via fetch API to bypass CSP restrictions.
//   - Popup window fallback for restricted pages (chrome://, edge://, etc.)
//     where content script injection is not allowed.
//   - Message routing between popup/content scripts and the service worker.
//
// Toggle flow:
//   1. On shortcut press, checks if the active tab is a restricted URL.
//   2. For restricted URLs, opens/closes a standalone popup window.
//   3. For normal URLs, sends a toggle message to the content script.
//   4. If no content script is injected yet, injects all WebIn scripts.
// ----------------------------------------------------------------------------

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
let popupWindowId = null;

chrome.commands.onCommand.addListener((command) => {
  if (command === "launch_overlay") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      const tab = tabs[0];
      const tabUrl = tab.url || "";

      // Check if this is a restricted page
      const isRestricted =
        tabUrl.startsWith("chrome://") ||
        tabUrl.startsWith("chrome-extension://") ||
        tabUrl.startsWith("edge://") ||
        tabUrl.startsWith("about:") ||
        tabUrl.startsWith("devtools://") ||
        tabUrl === "";

      if (isRestricted) {
        // Toggle popup window for restricted pages
        if (popupWindowId !== null) {
          chrome.windows.remove(popupWindowId, () => {
            if (chrome.runtime.lastError) {
              popupWindowId = null;
            }
            popupWindowId = null;
          });
        } else {
          chrome.windows.create(
            {
              url: chrome.runtime.getURL("popup.html"),
              type: "popup",
              width: 920,
              height: 600,
              focused: true,
            },
            (win) => {
              popupWindowId = win.id;
            }
          );
        }
        return;
      }

      const tabId = tab.id;

      // Try to send a toggle message to the content script first.
      chrome.tabs.sendMessage(tabId, { action: "webin_toggle" }, (response) => {
        if (chrome.runtime.lastError) {
          // Content script not yet injected, inject it now
          chrome.scripting
            .executeScript({
              target: { tabId: tabId },
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
            .catch(() => {});
        }
      });
    });
  }
});

// Clean up popup window ID when the window is closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupWindowId) {
    popupWindowId = null;
  }
});

