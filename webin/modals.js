const WebInModals = {
  showModal(shadow, config) {
    const {
      type,
      title,
      message,
      placeholder = "",
      primaryActionText = "Confirm",
      onConfirm,
      onCancel,
    } = config;

    const existingModal = shadow.querySelector(".modal-backdrop");
    if (existingModal) existingModal.remove();

    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <p class="modal-title">${title}</p>
      <p class="modal-message">${message}</p>
      ${type === "prompt" ? `<input type="text" class="modal-input" placeholder="${placeholder}">` : ""}
      <div class="modal-footer"></div>
    `;

    const footer = modal.querySelector(".modal-footer");
    const closeModal = () => modalBackdrop.remove();

    if (type === "prompt" || type === "confirm") {
      const confirmBtn = document.createElement("button");
      confirmBtn.textContent = primaryActionText;
      confirmBtn.className = "modal-button primary";
      confirmBtn.onclick = () => {
        if (onConfirm) {
          const val =
            type === "prompt"
              ? modal.querySelector(".modal-input").value
              : true;
          onConfirm(val);
        }
        closeModal();
      };
      footer.appendChild(confirmBtn);

      if (type === "prompt") {
        const inputField = modal.querySelector(".modal-input");
        setTimeout(() => inputField.focus(), 50);
        inputField.onkeydown = (e) => {
          if (e.key === "Enter") confirmBtn.click();
        };
      }
    }

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = type === "alert" ? "OK" : "Cancel";
    cancelBtn.className = "modal-button secondary";
    cancelBtn.onclick = () => {
      if (onCancel) onCancel();
      if (onConfirm && type === "confirm") onConfirm(false);
      closeModal();
    };
    footer.appendChild(cancelBtn);

    modalBackdrop.onclick = (e) => {
      if (e.target === modalBackdrop) cancelBtn.click();
    };

    modalBackdrop.appendChild(modal);
    shadow.appendChild(modalBackdrop);
  },

  showAddAppModal(shadow, categoryName, onSave) {
    const existingModal = shadow.querySelector(".modal-backdrop");
    if (existingModal) existingModal.remove();

    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <p class="modal-title">Add App to "${categoryName}"</p>
      <div class="modal-form-group">
        <label for="add-name-input">App Name</label>
        <input type="text" id="add-name-input" class="modal-input" placeholder="e.g., Google">
      </div>
      <div class="modal-form-group">
        <label for="add-url-input">App URL</label>
        <input type="url" id="add-url-input" class="modal-input" placeholder="https://google.com">
      </div>
      <div class="modal-form-group">
        <label for="add-icon-input">Icon URL (Optional)</label>
        <input type="url" id="add-icon-input" class="modal-input" placeholder="Leave empty for auto favicon">
      </div>
      <div class="modal-footer"></div>
    `;

    const nameInput = modal.querySelector("#add-name-input");
    const urlInput = modal.querySelector("#add-url-input");
    const iconInput = modal.querySelector("#add-icon-input");
    const footer = modal.querySelector(".modal-footer");
    const closeModal = () => modalBackdrop.remove();

    const rightSideButtons = document.createElement("div");
    rightSideButtons.style.cssText =
      "display: flex; gap: 10px; margin-left: auto;";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Add App";
    addBtn.className = "modal-button primary";
    addBtn.onclick = () => {
      const name = nameInput.value.trim();
      let url = urlInput.value.trim();
      const iconUrl = iconInput.value.trim();

      if (!name || !url) {
        WebInModals.showModal(shadow, {
          type: "alert",
          title: "Error",
          message: "Please fill out all fields.",
        });
        return;
      }
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;

      const newApp = { name, url };
      if (iconUrl) newApp.icon = iconUrl;

      onSave(newApp);
      closeModal();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "modal-button secondary";
    cancelBtn.onclick = closeModal;

    rightSideButtons.appendChild(cancelBtn);
    rightSideButtons.appendChild(addBtn);
    footer.appendChild(rightSideButtons);

    modalBackdrop.appendChild(modal);
    shadow.appendChild(modalBackdrop);
    setTimeout(() => nameInput.focus(), 50);
  },

  showEditAppModal(shadow, item, categoryName, onSave, onDelete) {
    const existingModal = shadow.querySelector(".modal-backdrop");
    if (existingModal) existingModal.remove();

    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "modal";
    const currentIconValue = item.icon || '';

    modal.innerHTML = `
      <p class="modal-title">Edit App</p>
      <div class="modal-form-group">
        <label for="edit-name-input">Name</label>
        <input type="text" id="edit-name-input" class="modal-input" value="${item.name}">
      </div>
      <div class="modal-form-group">
        <label for="edit-url-input">URL</label>
        <input type="text" id="edit-url-input" class="modal-input" value="${item.url}">
      </div>
      <div class="modal-form-group">
        <label for="edit-icon-input">Icon URL (Optional)</label>
        <input type="text" id="edit-icon-input" class="modal-input" value="${currentIconValue}" placeholder="Leave empty for auto favicon">
      </div>
      <div class="modal-footer"></div>
    `;

    const nameInput = modal.querySelector("#edit-name-input");
    const urlInput = modal.querySelector("#edit-url-input");
    const iconInput = modal.querySelector("#edit-icon-input");
    const footer = modal.querySelector(".modal-footer");
    const closeModal = () => modalBackdrop.remove();

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete App";
    deleteBtn.className = "modal-button danger";
    deleteBtn.onclick = () => {
      WebInModals.showModal(shadow, {
        type: "confirm",
        title: "Delete App?",
        message: `Are you sure you want to delete "${item.name}"?`,
        primaryActionText: "Yes, Delete",
        onConfirm: (confirmed) => {
          if (confirmed) {
            onDelete();
            closeModal();
          }
        },
      });
    };

    const actionButtons = document.createElement("div");
    actionButtons.style.cssText = "display: flex; gap: 10px;";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "modal-button primary";
    saveBtn.onclick = () => {
      const newName = nameInput.value.trim();
      const newUrl = urlInput.value.trim();
      const newIcon = iconInput.value.trim();
      if (!newName || !newUrl) return;

      const updatedApp = { name: newName, url: newUrl };
      if (newIcon) updatedApp.icon = newIcon;

      onSave(updatedApp);
      closeModal();
    };

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "modal-button secondary";
    cancelBtn.onclick = closeModal;

    footer.appendChild(deleteBtn);
    actionButtons.appendChild(cancelBtn);
    actionButtons.appendChild(saveBtn);
    footer.appendChild(actionButtons);

    modalBackdrop.appendChild(modal);
    shadow.appendChild(modalBackdrop);
    setTimeout(() => nameInput.focus(), 50);
  },
};
