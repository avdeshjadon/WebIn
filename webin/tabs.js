const WebInTabs = {
  setActiveTab(tabName) {
    if (WebInState.isDeleteMode) return;

    if (!tabName) {
      WebInUI.currentTab = null;
      WebInUI.navTabsContainer
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.remove("active"));
      WebInUI.renderContent();
      return;
    }

    WebInUI.currentTab = tabName;
    WebInUI.navTabsContainer.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.textContent === tabName);
    });
    WebInUI.renderContent();
  },

  createTabButton(tabName) {
    const button = document.createElement("button");
    button.textContent = tabName;
    button.onclick = () => {
      if (WebInState.isDeleteMode) {
        WebInModals.showModal(WebInUI.shadow, {
          type: "confirm",
          title: "Delete Category",
          message: `Are you sure you want to delete "${tabName}"? All links inside will be lost.`,
          primaryActionText: "Yes, Delete",
          onConfirm: (confirmed) => {
            if (confirmed) {
              delete WebInState.tabContent[tabName];
              WebInState.tabs.splice(WebInState.tabs.indexOf(tabName), 1);
              WebInState.saveState();
              button.remove();
              WebInState.isDeleteMode = false;
              WebInUI.shadow.querySelector(".nav").classList.remove("delete-mode");
              WebInUI.shadow.querySelector(".delete-mode-btn").classList.remove("active");
              if (WebInUI.currentTab === tabName) {
                this.setActiveTab(WebInState.tabs.length > 0 ? WebInState.tabs[0] : null);
              }
            }
          },
        });
      } else {
        if (WebInUI.currentTab === tabName && WebInUI.searchInput.value === "") return;
        WebInUI.searchInput.value = "";
        this.setActiveTab(tabName);
      }
    };
    return button;
  },

  addCategory(newCategoryName) {
    const trimmedName = newCategoryName.trim();
    if (WebInState.tabContent.hasOwnProperty(trimmedName)) {
      WebInModals.showModal(WebInUI.shadow, {
        type: "alert",
        title: "Error",
        message: "A category with this name already exists.",
      });
      return;
    }

    WebInState.tabContent[trimmedName] = [];
    WebInState.tabs.push(trimmedName);
    WebInState.saveState();

    const newButton = this.createTabButton(trimmedName);
    WebInUI.navTabsContainer.appendChild(newButton);
    this.setActiveTab(trimmedName);
    newButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "end",
    });
  },

  toggleDeleteMode() {
    WebInState.isDeleteMode = !WebInState.isDeleteMode;
    const nav = WebInUI.shadow.querySelector(".nav");
    const deleteBtn = WebInUI.shadow.querySelector(".delete-mode-btn");
    nav.classList.toggle("delete-mode", WebInState.isDeleteMode);
    deleteBtn.classList.toggle("active", WebInState.isDeleteMode);
  },
};

WebInUI.setActiveTab = WebInTabs.setActiveTab.bind(WebInTabs);
WebInUI.createTabButton = WebInTabs.createTabButton.bind(WebInTabs);
