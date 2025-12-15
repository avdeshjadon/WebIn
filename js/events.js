const WebInEvents = {
  setupSearchEvents() {
    WebInUI.searchInput.addEventListener("input", () => {
      const query = WebInUI.searchInput.value.trim().toLowerCase();
      if (query) {
        WebInUI.navTabsContainer
          .querySelectorAll("button")
          .forEach((btn) => btn.classList.remove("active"));
        WebInUI.renderSearchResults(query);
      } else {
        WebInUI.setActiveTab(WebInUI.currentTab);
      }
    });

    WebInUI.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const firstResult = WebInUI.shadow.querySelector(
          ".content .card:not(.add-card)"
        );
        if (firstResult) firstResult.click();
      }
    });
  },

  setupDragAndResize(host, wrapper, header) {
    let isDragging = false,
      isResizing = false,
      offsetX,
      offsetY,
      initialWidth,
      initialHeight,
      initialX,
      initialY,
      currentResizerDirection = null;

    header.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) return;
      isDragging = true;
      offsetX = e.clientX - host.offsetLeft;
      offsetY = e.clientY - host.offsetTop;
      header.style.cursor = "grabbing";
      e.preventDefault();
    });

    const resizerSE = wrapper.querySelector(".resizer.se");
    resizerSE.addEventListener("mousedown", (e) => {
      isResizing = true;
      currentResizerDirection = resizerSE.dataset.direction;
      initialWidth = wrapper.offsetWidth;
      initialHeight = wrapper.offsetHeight;
      initialX = e.clientX;
      initialY = e.clientY;
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        host.style.left = `${e.clientX - offsetX}px`;
        host.style.top = `${e.clientY - offsetY}px`;
      } else if (isResizing) {
        const dx = e.clientX - initialX;
        const dy = e.clientY - initialY;
        if (currentResizerDirection.includes("e")) {
          wrapper.style.width = `${Math.max(400, initialWidth + dx)}px`;
        }
        if (currentResizerDirection.includes("s")) {
          wrapper.style.height = `${Math.max(300, initialHeight + dy)}px`;
        }
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        header.style.cursor = "grab";
      }
      if (isResizing) {
        isResizing = false;
        currentResizerDirection = null;
      }
    });

    const positionHost = () => {
      host.style.top = `calc(50% - ${wrapper.offsetHeight / 2}px)`;
      host.style.left = `calc(50% - ${wrapper.offsetWidth / 2}px)`;
    };

    window.addEventListener("resize", positionHost);
    return positionHost;
  },
};

WebInUI.showAddAppModal = function (categoryName) {
  WebInModals.showAddAppModal(this.shadow, categoryName, (newApp) => {
    WebInState.tabContent[categoryName].push(newApp);
    WebInState.saveState();
    this.setActiveTab(categoryName);
  });
};

WebInUI.showEditModal = function (item, categoryName) {
  WebInModals.showEditAppModal(
    this.shadow,
    item,
    categoryName,
    (updatedApp) => {
      const categoryItems = WebInState.tabContent[categoryName];
      const itemToUpdate = categoryItems.find(
        (i) => i.name === item.name && i.url === item.url
      );
      if (itemToUpdate) {
        Object.assign(itemToUpdate, updatedApp);
        WebInState.saveState();
        this.searchInput.value
          ? this.renderSearchResults(this.searchInput.value)
          : this.renderContent();
      }
    },
    () => {
      const categoryItems = WebInState.tabContent[categoryName];
      const itemIndex = categoryItems.findIndex(
        (i) => i.name === item.name && i.url === item.url
      );
      if (itemIndex > -1) {
        categoryItems.splice(itemIndex, 1);
        WebInState.saveState();
        this.searchInput.value
          ? this.renderSearchResults(this.searchInput.value)
          : this.renderContent();
      }
    }
  );
};
