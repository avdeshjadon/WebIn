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
// state.js -- Application State Manager
// ===========================================================
// Manages the persistent state of the WebIn extension using
// chrome.storage.local. Handles saving, loading, and resetting of:
//   - Tab categories (ordered list of category names).
//   - Tab content (apps/links stored under each category).
//   - Icon caching via background script to bypass CSP restrictions.
//   - Favicon URL resolution with custom icon override support.
//
// State lifecycle:
//   - On first load, initializes from WEBIN_CONFIG defaults.
//   - On subsequent loads, restores from chrome.storage.local.
//   - Validates stored data integrity and resets if corrupt.
// ----------------------------------------------------------------------------

const WebInState = {
  tabs: null,
  tabContent: null,
  isDeleteMode: false,
  iconCache: new Map(),

  saveState() {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(
        {
          webhub_tabs_v1: this.tabs,
          webhub_tabContent_v1: this.tabContent,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "WebIn Error: Failed to save state.",
              chrome.runtime.lastError
            );
          }
        }
      );
    }
  },

  initializeDefaultState() {
    this.tabs = [...WEBIN_CONFIG.DEFAULT_TABS];
    this.tabContent = JSON.parse(
      JSON.stringify(WEBIN_CONFIG.DEFAULT_TAB_CONTENT)
    );
    this.saveState();
  },

  loadState(callback) {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      console.error(
        "WebIn Error: chrome.storage.local is not available."
      );
      this.initializeDefaultState();
      callback();
      return;
    }

    chrome.storage.local.get(
      ["webhub_tabs_v1", "webhub_tabContent_v1"],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(
            "WebIn Error: Failed to load state.",
            chrome.runtime.lastError
          );
          this.initializeDefaultState();
        } else if (result.webhub_tabs_v1 && result.webhub_tabContent_v1) {
          this.tabs = result.webhub_tabs_v1;
          this.tabContent = result.webhub_tabContent_v1;
          if (
            !Array.isArray(this.tabs) ||
            typeof this.tabContent !== "object" ||
            this.tabs.length === 0
          ) {
            console.error("WebIn Error: Corrupt data in storage. Resetting.");
            this.initializeDefaultState();
          }
        } else {
          this.initializeDefaultState();
        }
        callback();
      }
    );
  },

  resetState(callback) {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.clear(() => {
        this.initializeDefaultState();
        if (callback) callback();
      });
    }
  },

  getFaviconUrl(url, customIcon = null) {
    if (customIcon && customIcon.trim() !== "") {
      return customIcon;
    }
    return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url)}`;
  },

  // Fetch icon via background script to bypass CSP
  async fetchIconViaBackground(url) {
    if (this.iconCache.has(url)) {
      return this.iconCache.get(url);
    }

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'fetchIcon',
        url: url
      });
      
      if (response && response.dataUrl) {
        this.iconCache.set(url, response.dataUrl);
        return response.dataUrl;
      }
    } catch (error) {
      console.error('WebIn: Failed to fetch icon via background', error);
    }
    return null;
  },
};
