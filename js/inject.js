(() => {
  const initializeApp = () => {
    if (document.getElementById("webhub-shadow-host")) {
      const existingHost = document.getElementById("webhub-shadow-host");
      const existingBackdrop = document.querySelector(".webhub-backdrop");
      if (existingHost) existingHost.remove();
      if (existingBackdrop) existingBackdrop.remove();
      return;
    }

    WebInState.loadState(() => {
      buildUI();
    });
  };

  const buildUI = () => {
    WebInState.isDeleteMode = false;

    const host = document.createElement("div");
    host.id = "webhub-shadow-host";
    host.style.cssText =
      "position:fixed; z-index:999999; opacity:0; transform:scale(0.95); transition:opacity 0.5s cubic-bezier(0.25,0.1,0.25,1), transform 0.5s cubic-bezier(0.25,0.1,0.25,1);";

    const backdrop = document.createElement("div");
    backdrop.className = "webhub-backdrop";
    backdrop.style.cssText =
      "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.3); backdrop-filter:blur(5px); z-index:999998; opacity:0; transition:opacity 0.5s cubic-bezier(0.25,0.1,0.25,1);";
    document.body.appendChild(backdrop);

    const shadow = host.attachShadow({ mode: "open" });
    WebInUI.shadow = shadow;

    const style = document.createElement("style");
    style.textContent =
      WEBIN_STYLES + WEBIN_STYLES_PART2 + WEBIN_STYLES_PART3;
    shadow.appendChild(style);

    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const header = document.createElement("div");
    header.className = "header";

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
    closeBtn.onclick = () => {
      host.style.opacity = "0";
      host.style.transform = "scale(0.95)";
      backdrop.style.opacity = "0";
      setTimeout(() => {
        host.remove();
        backdrop.remove();
      }, 500);
    };

    headerActions.appendChild(resetBtn);
    headerActions.appendChild(closeBtn);
    header.appendChild(titleContainer);
    header.appendChild(headerActions);
    wrapper.appendChild(header);

    const searchContainer = createSearchBar();
    wrapper.appendChild(searchContainer);

    const nav = createNavigation();
    wrapper.appendChild(nav);

    const content = document.createElement("div");
    WebInUI.content = content;

    wrapper.appendChild(content);

    const footer = document.createElement("div");
    footer.className = "footer";
    footer.textContent =
      "Powered by caffeine and creativity — Avdesh Jadon ☕";
    wrapper.appendChild(footer);

    const resizerSE = document.createElement("div");
    resizerSE.className = "resizer se";
    resizerSE.dataset.direction = "se";
    wrapper.appendChild(resizerSE);

    shadow.appendChild(wrapper);
    document.body.appendChild(host);

    WebInUI.setActiveTab(
      WebInState.tabs.length > 0 ? WebInState.tabs[0] : null
    );

    const positionHost = WebInEvents.setupDragAndResize(
      host,
      wrapper,
      header
    );
    positionHost();

    setTimeout(() => {
      host.style.opacity = "1";
      host.style.transform = "scale(1)";
      backdrop.style.opacity = "1";
      WebInUI.searchInput.focus();
    }, 100);
  };

  function createSearchBar() {
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

    WebInEvents.setupSearchEvents();

    return searchContainer;
  }

  function createNavigation() {
    const nav = document.createElement("div");
    nav.className = "nav";

    const navTabsContainer = document.createElement("div");
    navTabsContainer.className = "nav-tabs";
    WebInUI.navTabsContainer = navTabsContainer;

    WebInState.tabs.forEach((tab) =>
      navTabsContainer.appendChild(WebInUI.createTabButton(tab))
    );

    nav.appendChild(navTabsContainer);
    return nav;
  }

  initializeApp();
})();
