chrome.commands.onCommand.addListener((command) => {
  if (command === "launch_overlay") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          files: [
            "js/config.js",
            "js/state.js",
            "js/styles.js",
            "js/styles2.js",
            "js/styles3.js",
            "js/modals.js",
            "js/ui.js",
            "js/tabs.js",
            "js/events.js",
            "js/inject.js",
          ],
        })
        .catch((err) => console.error("Injection failed:", err));
    });
  }
});
