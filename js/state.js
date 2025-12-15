const WebInState = {
  tabs: null,
  tabContent: null,
  isDeleteMode: false,

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
};
