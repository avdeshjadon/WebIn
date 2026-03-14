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
// popup-inject.js -- Standalone Popup Window Entry Point
// ===========================================================
// Alternative entry point used when WebIn is launched on restricted pages
// (chrome://, edge://, about:, etc.) where content script injection is
// not allowed. Loaded by popup.html in a standalone browser popup window.
//
// Differences from inject.js:
//   - No backdrop overlay or drag-to-move (fills the entire popup window).
//   - No resizer handle (window is resized via native browser controls).
//   - Close button calls window.close() instead of removing DOM elements.
//   - Wrapper uses full viewport dimensions (100vw × 100vh).
//
// Shares all other modules (config, state, styles, modals, ui, tabs, events)
// with the content script version for a consistent user experience.
// ----------------------------------------------------------------------------

(() => {
  const buildPopupUI = () => {
    WebInState.isDeleteMode = false;

    const shadow = document.body.attachShadow
      ? (() => {
          const host = document.createElement("div");
          host.id = "webhub-shadow-host";
          host.style.cssText = "width:100%;height:100%;";
          document.body.appendChild(host);
          const s = host.attachShadow({ mode: "open" });
          return s;
        })()
      : null;

    if (!shadow) return;
    WebInUI.shadow = shadow;

    const style = document.createElement("style");
    style.textContent =
      WEBIN_STYLES + WEBIN_STYLES_PART2 + WEBIN_STYLES_PART3;
    shadow.appendChild(style);

    // Override wrapper styles for popup mode
    const popupStyle = document.createElement("style");
    popupStyle.textContent = `
      .wrapper {
        width: 100% !important;
        max-width: 100% !important;
        height: 100vh !important;
        min-height: unset !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      .resizer { display: none !important; }
    `;
    shadow.appendChild(popupStyle);

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const header = document.createElement("div");
    header.className = "header";
    header.style.cursor = "default";

    const titleContainer = document.createElement("div");
    titleContainer.style.cssText =
      "display:flex; align-items:center; gap:10px;";
    titleContainer.innerHTML = `
      <img src="https://img.icons8.com/?size=200&id=nDNCmmDBtU8l&format=png" class="header-logo">
      <span class="header-title">WebIn</span>
    `;

    const headerActions = document.createElement("div");
    headerActions.style.cssText =
      "display: flex; align-items: center; gap: 8px;";

    const resetBtn = document.createElement("button");
    resetBtn.className = "close";
    resetBtn.innerHTML = WebInUI.ICONS.reset;
    resetBtn.title = "Reset Extension";
    resetBtn.onclick = () => {
      WebInModals.showModal(shadow, {
        type: "confirm",
        title: "Reset Extension?",
        message:
          "Are you sure? All your custom categories and links will be permanently deleted.",
        primaryActionText: "Yes, Reset",
        onConfirm: (confirmed) => {
          if (confirmed) {
            WebInState.resetState(() => {
              WebInUI.searchInput.value = "";
              WebInUI.navTabsContainer.innerHTML = "";
              WebInState.tabs.forEach((tab) =>
                WebInUI.navTabsContainer.appendChild(
                  WebInUI.createTabButton(tab)
                )
              );
              WebInUI.setActiveTab(
                WebInState.tabs.length > 0 ? WebInState.tabs[0] : null
              );
              WebInModals.showModal(shadow, {
                type: "alert",
                title: "Reset Complete",
                message: "The extension has been successfully reset.",
              });
            });
          }
        },
      });
    };

    const closeBtn = document.createElement("button");
    closeBtn.className = "close";
    closeBtn.innerHTML = "×";
    closeBtn.onclick = () => window.close();

    headerActions.appendChild(resetBtn);
    headerActions.appendChild(closeBtn);
    header.appendChild(titleContainer);
    header.appendChild(headerActions);
    wrapper.appendChild(header);

    // Search bar
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    const searchInput = document.createElement("input");
    searchInput.className = "search-input";
    searchInput.placeholder = "Search all apps...";
    WebInUI.searchInput = searchInput;
    searchContainer.appendChild(searchInput);

    const addCategoryBtn = document.createElement("button");
    addCategoryBtn.innerHTML = WebInUI.ICONS.add;
    addCategoryBtn.setAttribute("data-tooltip", "Add new category");
    addCategoryBtn.className = "action-btn";
    addCategoryBtn.onclick = () => {
      if (WebInState.isDeleteMode) return;
      WebInModals.showModal(WebInUI.shadow, {
        type: "prompt",
        title: "Add New Category",
        message: "Enter a name for the new category.",
        placeholder: "e.g., Study Material",
        primaryActionText: "Add",
        onConfirm: (newCategoryName) => {
          if (newCategoryName && newCategoryName.trim() !== "") {
            WebInTabs.addCategory(newCategoryName);
          }
        },
      });
    };

    const deleteModeBtn = document.createElement("button");
    deleteModeBtn.innerHTML = WebInUI.ICONS.delete;
    deleteModeBtn.setAttribute("data-tooltip", "Delete category");
    deleteModeBtn.className = "action-btn delete-mode-btn";
    deleteModeBtn.onclick = () => WebInTabs.toggleDeleteMode();

    searchContainer.appendChild(addCategoryBtn);
    searchContainer.appendChild(deleteModeBtn);
    wrapper.appendChild(searchContainer);

    WebInEvents.setupSearchEvents();

    // Navigation
    const nav = document.createElement("div");
    nav.className = "nav";

    const navTabsContainer = document.createElement("div");
    navTabsContainer.className = "nav-tabs";
    WebInUI.navTabsContainer = navTabsContainer;

    WebInState.tabs.forEach((tab) =>
      navTabsContainer.appendChild(WebInUI.createTabButton(tab))
    );

    nav.appendChild(navTabsContainer);
    wrapper.appendChild(nav);

    // Content
    const content = document.createElement("div");
    WebInUI.content = content;
    wrapper.appendChild(content);

    // Footer
    const footer = document.createElement("div");
    footer.className = "footer";
    footer.textContent =
      "Powered by caffeine and creativity — Avdesh Jadon ☕";
    wrapper.appendChild(footer);

    shadow.appendChild(wrapper);

    WebInUI.setActiveTab(
      WebInState.tabs.length > 0 ? WebInState.tabs[0] : null
    );

    setTimeout(() => {
      WebInUI.searchInput.focus();
    }, 100);
  };

  // Initialize
  WebInState.loadState(() => {
    buildPopupUI();
  });
})();
