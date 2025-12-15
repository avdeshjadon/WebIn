const WebInUI = {
  currentTab: null,
  shadow: null,
  content: null,
  searchInput: null,
  navTabsContainer: null,

  ICONS: {
    add: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
    delete: `<svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
    more: `<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
  },

  createCard(item, categoryName, index = 0) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.animationDelay = `${index * 0.04}s`;
    card.onclick = () => window.open(item.url, "_blank");

    const img = document.createElement("img");
    img.alt = item.name;
    img.loading = "lazy";
    img.src = WEBIN_CONFIG.FALLBACK_ICON_SVG;

    const p = document.createElement("p");
    p.textContent = item.name;

    const menuBtn = document.createElement("button");
    menuBtn.className = "card-menu-btn";
    menuBtn.innerHTML = this.ICONS.more;
    menuBtn.title = "Edit app";
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      this.showEditModal(item, categoryName);
    };

    card.appendChild(img);
    card.appendChild(p);
    card.appendChild(menuBtn);

    const iconUrl = WebInState.getFaviconUrl(item.url, item.icon);
    img.src = iconUrl;

    return card;
  },

  renderContent(filter = "") {
    this.content.innerHTML = "";
    this.content.className = "content";
    const isSearching = filter !== "";

    if (!this.currentTab) {
      this.content.innerHTML = `<div class="empty-state"><p>No categories available. Add one!</p></div>`;
      return;
    }

    const items = WebInState.tabContent[this.currentTab] || [];
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (isSearching && filteredItems.length === 0) {
      this.content.innerHTML = `<div class="empty-state"><p>No results found for "${filter}"</p></div>`;
      return;
    }

    this.content.classList.add("grid-view");
    filteredItems.forEach((item, index) => {
      this.content.appendChild(this.createCard(item, this.currentTab, index));
    });

    if (!isSearching) {
      if (filteredItems.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = `<p>This category is empty. Click the '+' card to add an app!</p>`;
        this.content.appendChild(emptyState);
      }

      const addCard = document.createElement("div");
      addCard.className = "card add-card";
      addCard.innerHTML = this.ICONS.add;
      addCard.title = `Add new app to ${this.currentTab}`;
      addCard.onclick = () => this.showAddAppModal(this.currentTab);
      this.content.appendChild(addCard);
    }
  },

  renderSearchResults(query) {
    this.content.innerHTML = "";
    this.content.className = "content";
    let totalResults = 0;

    Object.entries(WebInState.tabContent).forEach(([category, items]) => {
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredItems.length > 0) {
        totalResults++;
        const headerEl = document.createElement("h3");
        headerEl.className = "category-header";
        headerEl.textContent = category;
        this.content.appendChild(headerEl);

        const grid = document.createElement("div");
        grid.className = "category-grid";
        filteredItems.forEach((item, index) =>
          grid.appendChild(this.createCard(item, category, index))
        );
        this.content.appendChild(grid);
      }
    });

    if (totalResults === 0) {
      this.content.innerHTML = `<div class="empty-state"><p>No results found for "${query}"</p></div>`;
    }
  },
};