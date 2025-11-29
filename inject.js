(() => {
  let tabs,
    tabContent,
    isDeleteMode = false;

  const FALLBACK_ICON_SVG =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzU0NmU3YSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTggMTBjMCAxLjEtLjIgMi4xMi0uNTcgMy4wN0wxNC4yNSAxMS45bDIuODIgMi44Mi4wNy4wN2MyLjE4LTIuNC43OC02LjA0LTEuNzQtNy41NVM5LjI5IDQuNDYgNi44OSA2LjY0bC4wOC4wNyAyLjgyIDIuODFMMi45MyAxNC40M0E4LjkzMiA4LjkzMiAwIDAgMSAyIDEyYzAtNC40MiAzLjU4LTggOC04czggMy41OCA4IDh6Ii8+PC9zdmc+";

  const saveState = () => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(
        {
          webhub_tabs_v1: tabs,
          webhub_tabContent_v1: tabContent,
        },
        () => {
          if (chrome.runtime.lastError)
            console.error(
              "WebIn Error: Failed to save state.",
              chrome.runtime.lastError
            );
        }
      );
    }
  };

  const initializeDefaultState = () => {
    tabs = [
      "AI Tools",
      "Coding",
      "OpenSource",
      "Social",
      "Shopping",
      "DataBase",
    ];
    tabContent = {
      "AI Tools": [
        {
          name: "ChatGPT",
          url: "https://chat.openai.com",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/openai.png",
        },
        {
          name: "DeepSeek",
          url: "https://chat.deepseek.com/",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/dark/deepseek-color.png",
        },
        {
          name: "Gemini",
          url: "https://gemini.google.com",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/gemini-color.png",
        },
        {
          name: "Grok",
          url: "https://www.grok.com",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/grok.png",
        },
      ],
      Coding: [
        {
          name: "LeetCode",
          url: "https://leetcode.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
        },
      ],
      OpenSource: [
        {
          name: "GitHub",
          url: "https://github.com",
          icon: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
        },
        {
          name: "Stack Overflow",
          url: "https://stackoverflow.com",
          icon: "https://cdn-icons-png.flaticon.com/512/2111/2111628.png",
        },
        {
          name: "SourceForge",
          url: "https://sourceforge.net",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIKTr3PXDrlyqSD3sICodXs36SpIUK9XsoxUn3lW50-HwFoC70Q1QCScdGyg4Gnl5PLCA&usqp=CAU",
        },
      ],
      Social: [
                {
          name: "YouTube",
          url: "https://youtube.com",
          icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
        },
        {
          name: "LinkedIn",
          url: "https://linkedin.com",
          icon: "https://cdn-icons-png.flaticon.com/128/145/145807.png",
        },
        {
          name: "WhatsApp",
          url: "https://www.whatsapp.com",
          icon: "https://cdn-icons-png.flaticon.com/128/15707/15707820.png",
        },
        {
          name: "Facebook",
          url: "https://facebook.com",
          icon: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
        },
        {
          name: "Instagram",
          url: "https://instagram.com",
          icon: "https://cdn-icons-png.flaticon.com/128/15707/15707749.png",
        },

        {
          name: "Twitter",
          url: "https://twitter.com",
          icon: "https://cdn-icons-png.flaticon.com/128/3670/3670151.png",
        },

        {
          name: "Reddit",
          url: "https://reddit.com",
          icon: "https://cdn-icons-png.flaticon.com/128/3670/3670226.png",
        },

    
      ],
      Shopping: [
        {
          name: "Amazon",
          url: "https://amazon.com",
          icon: "https://img.icons8.com/?size=512&id=TfhgUym1Y8vb&format=png",
        },
        {
          name: "Flipkart",
          url: "https://flipkart.com",
          icon: "https://www.citypng.com/public/uploads/preview/hd-flipkart-round-logo-icon-transparent-png-701751694966204grvmunpzzf.png",
        },
        {
          name: "Myntra",
          url: "https://myntra.com",
          icon: "https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/myntra-logo-app-icon.png",
        },
          {
          name: "Meesho",
          url: "https://meesho.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Meesho_logo.png",
        },

      ],
      DataBase: [
        {
          name: "Firebase",
          url: "https://console.firebase.google.com/u/0/",
          icon: "https://images.seeklogo.com/logo-png/61/1/firebase-icon-logo-png_seeklogo-615938.png",
        },
        {
          name: "Cloudinary",
          url: "https://console.cloudinary.com/app/c-e71e8fe00683ff6a2fba091e038d10/home/dashboard",
          icon: "data:image/png;base64,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",
        },
      ],
    };
    saveState();
  };

  const initializeApp = () => {
    if (document.getElementById("webhub-shadow-host")) {
      const existingHost = document.getElementById("webhub-shadow-host");
      const existingBackdrop = document.querySelector(".webhub-backdrop");
      if (existingHost) existingHost.remove();
      if (existingBackdrop) existingBackdrop.remove();
      return;
    }

    if (!chrome || !chrome.storage || !chrome.storage.local) {
      console.error(
        "WebIn Error: chrome.storage.local is not available. Ensure this runs as an extension with 'storage' permission."
      );
      initializeDefaultState();
      buildUI();
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
          initializeDefaultState();
        } else if (result.webhub_tabs_v1 && result.webhub_tabContent_v1) {
          tabs = result.webhub_tabs_v1;
          tabContent = result.webhub_tabContent_v1;
          if (
            !Array.isArray(tabs) ||
            typeof tabContent !== "object" ||
            tabs.length === 0
          ) {
            console.error("WebIn Error: Corrupt data in storage. Resetting.");
            initializeDefaultState();
          }
        } else {
          initializeDefaultState();
        }
        buildUI();
      }
    );
  };

  const buildUI = () => {
    isDeleteMode = false;
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
    const style = document.createElement("style");
    style.textContent = `
        * {
     box-sizing: border-box !important;
     margin: 0 !important;
     padding: 0 !important;
     font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, sans-serif !important;
}
 .card img {
     width: 40px !important;
     height: 40px !important;
     margin-bottom: 10px !important;
     object-fit: contain !important;
}
 .modal-input, .modal-select {
     width: 100% !important;
     padding: 12px !important;
     border: 1px solid #ccc !important;
     border-radius: 10px !important;
     font-size: 14px !important;
     background: #fff !important;
     color: #333 !important;
}
 .modal-input:focus, .modal-select:focus {
     outline: none !important;
     border-color: #888 !important;
     box-shadow: 0 0 0 3px rgba(100, 100, 100, 0.15) !important;
}
 @keyframes fadeIn {
     from {
         opacity: 0;
         transform: translateY(10px);
    }
     to {
         opacity: 1;
         transform: translateY(0);
    }
}
 @keyframes modal-scale-in {
     from {
         opacity: 0;
         transform: scale(0.95);
    }
     to {
         opacity: 1;
         transform: scale(1);
    }
}
 .wrapper {
     width: 90vw;
     max-width: 800px;
     height: 65vh;
     min-height: 500px;
     background: rgba(247, 248, 250, 0.95) !important;
     color: #000 !important;
     border-radius: 16px !important;
     box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2) !important;
     display: flex !important;
     flex-direction: column !important;
     overflow: hidden !important;
     border: 1px solid rgba(0, 0, 0, 0.1) !important;
     backdrop-filter: blur(15px) !important;
}
 .header {
     background: rgba(230, 232, 235, 0.9) !important;
     padding: 14px 20px !important;
     display: flex !important;
     justify-content: space-between !important;
     align-items: center !important;
     cursor: grab !important;
     user-select: none !important;
     border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
 .header-logo {
     width: 24px !important;
     height: 24px !important;
}
 .header-title {
     font-weight: 600 !important;
     font-size: 16px !important;
     color: #333 !important;
}
 .close {
     background: rgba(0, 0, 0, 0.08) !important;
     border: none !important;
     font-size: 24px !important;
     cursor: pointer !important;
     color: #333 !important;
     width: 28px !important;
     height: 28px !important;
     display: flex !important;
     align-items: center !important;
     justify-content: center !important;
     border-radius: 50% !important;
     transition: all 0.2s ease !important;
     line-height: 1 !important;
     padding-bottom: 2px !important;
}
 .close svg {
     width: 16px !important;
     height: 16px !important;
     fill: #333 !important;
}
 .close:hover {
     background: rgba(0, 0, 0, 0.15) !important;
     transform: rotate(90deg) !important;
}
 .nav {
     display: flex !important;
     padding: 12px !important;
     background: rgba(255, 255, 255, 0.8) !important;
     align-items: center !important;
     border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
 .nav-tabs {
     display: flex !important;
     gap: 8px !important;
     flex-grow: 1 !important;
     overflow-x: auto !important;
     flex-wrap: nowrap !important;
     padding-bottom: 10px !important;
     margin-bottom: -10px !important;
}
 .nav-tabs::-webkit-scrollbar {
     height: 6px !important;
}
 .nav-tabs::-webkit-scrollbar-track {
     background: rgba(0, 0, 0, 0.05) !important;
}
 .nav-tabs::-webkit-scrollbar-thumb {
     background: rgba(0, 0, 0, 0.2) !important;
     border-radius: 3px !important;
}
 .nav button {
     line-height: 1.5 !important;
     padding: 8px 16px !important;
     font-size: 13px !important;
     font-weight: 600 !important;
     border: 1px solid #dcdcdc !important;
     border-radius: 10px !important;
     cursor: pointer !important;
     background: #fff !important;
     color: #555 !important;
     box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
     transition: all 0.2s ease !important;
     flex-shrink: 0 !important;
}
 .nav button.active {
     background: #e0e0e0 !important;
     color: #333 !important;
     border-color: #c0c0c0 !important;
}
 .nav.delete-mode .nav-tabs button {
     background: #ffebee !important;
     color: #b71c1c !important;
     border-color: #ef9a9a !important;
     cursor: crosshair !important;
}
 .search-container {
     display: flex;
     align-items: center;
     gap: 8px;
     padding: 12px 16px !important;
     background: #f0f2f5 !important;
     border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
 .search-input {
     flex-grow: 1;
     width: 100% !important;
     padding: 10px 15px !important;
     border-radius: 10px !important;
     border: 1px solid #ccc !important;
     font-size: 14px !important;
     outline: none !important;
     transition: all 0.2s ease !important;
     background-color: #fff !important;
     color: #333 !important;
}
 .search-input::placeholder {
     color: #999 !important;
     opacity: 1 !important;
}
 .action-btn {
     background: #f0f0f0 !important;
     border: 1px solid #dcdcdc !important;
     padding: 8px !important;
     width: 36px !important;
     height: 38px !important;
     display: flex !important;
     align-items: center !important;
     justify-content: center !important;
     border-radius: 10px !important;
     flex-shrink: 0;
     cursor: pointer;
     transition: all 0.2s ease;
}
 .action-btn svg {
     width: 18px !important;
     height: 18px !important;
     fill: #333 !important;
     transition: all 0.2s ease;
}
 .action-btn:hover {
     background: #e0e0e0 !important;
}
 .delete-mode-btn.active {
     background: #f8b3b0 !important;
     border-color: #e57373 !important;
}
 .delete-mode-btn.active svg {
     fill: #c0392b !important;
     transform: scale(1.1);
}
 .content {
     position: relative !important;
     flex: 1 !important;
     overflow-y: auto !important;
     padding: 20px !important;
     background: #fff !important;
}
 .card {
     position: relative !important;
     background: #f9f9f9 !important;
     border: 1px solid #eee !important;
     border-radius: 12px !important;
     padding: 16px 8px !important;
     text-align: center !important;
     box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03) !important;
     transition: all 0.3s ease !important;
     cursor: pointer !important;
     height: 120px !important;
     display: flex !important;
     flex-direction: column !important;
     align-items: center !important;
     justify-content: center !important;
     animation: fadeIn 0.4s ease forwards;
     opacity: 0;
}
 .card:hover {
     transform: translateY(-5px) !important;
     box-shadow: 0 8px 15px rgba(0, 0, 0, 0.07) !important;
     border-color: #ddd !important;
}
 .card p {
     line-height: 1.5 !important;
     font-size: 13px !important;
     color: #333 !important;
     font-weight: 500 !important;
}
 .content.grid-view {
     display: grid !important;
     grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
     gap: 16px !important;
}
 .category-header {
     font-size: 14px !important;
     font-weight: 600 !important;
     color: #555 !important;
     padding-bottom: 5px !important;
     margin-top: 10px !important;
     border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
}
 .category-header:first-of-type {
     margin-top: 0 !important;
}
 .category-grid {
     display: grid !important;
     grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
     gap: 16px !important;
     padding-top: 16px !important;
}
 .footer {
     padding: 12px !important;
     text-align: center !important;
     font-size: 12px !important;
     color: #888 !important;
     background: #f0f2f5 !important;
     border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
}
 .empty-state {
     padding: 40px !important;
     text-align: center !important;
     color: #666 !important;
     grid-column: 1 / -1;
}
 .empty-state p {
     font-size: 15px !important;
     line-height: 1.5 !important;
}
 .modal-backdrop {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(0, 0, 0, 0.4);
     display: flex;
     align-items: center;
     justify-content: center;
     z-index: 1000;
     animation: modal-scale-in 0.3s ease forwards;
     opacity: 0;
}
 .modal {
     background: #fdfdfd !important;
     padding: 24px !important;
     border-radius: 12px !important;
     box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15) !important;
     border: 1px solid #eee !important;
     width: 90% !important;
     max-width: 420px !important;
     text-align: left !important;
     transform: scale(0.95);
     animation: modal-scale-in 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}
 .modal-title {
     font-size: 20px !important;
     font-weight: 600 !important;
     margin-bottom: 8px !important;
     color: #333 !important;
     line-height: 1.5 !important;
}
 .modal-message {
     font-size: 15px !important;
     color: #666 !important;
     margin-bottom: 20px !important;
     line-height: 1.5 !important;
}
 .modal-footer {
     display: flex !important;
     justify-content: flex-end !important;
     gap: 10px !important;
     margin-top: 24px !important;
}
 .modal-button {
     padding: 10px 20px !important;
     border-radius: 8px !important;
     border: none !important;
     font-weight: 600 !important;
     cursor: pointer !important;
     transition: all 0.2s ease;
     line-height: 1.5 !important;
}
 .modal-button.primary {
     background: #2c3e50 !important;
     color: #fff !important;
}
 .modal-button.primary:hover {
     background: #34495e !important;
}
 .modal-button.secondary {
     background: #ecf0f1 !important;
     color: #34495e !important;
}
 .modal-button.secondary:hover {
     background: #e0e6e8 !important;
}
 .card-menu-btn {
     position: absolute !important;
     top: 6px !important;
     right: 6px !important;
     background: rgba(0, 0, 0, 0.08) !important;
     border: none !important;
     border-radius: 50% !important;
     width: 26px !important;
     height: 26px !important;
     cursor: pointer !important;
     display: flex !important;
     align-items: center !important;
     justify-content: center !important;
     opacity: 0 !important;
     transition: opacity 0.2s ease, background 0.2s ease !important;
     z-index: 5 !important;
}
 .card:hover .card-menu-btn {
     opacity: 1 !important;
}
 .card-menu-btn:hover {
     background: rgba(0, 0, 0, 0.15) !important;
}
 .card-menu-btn svg {
     width: 16px !important;
     height: 16px !important;
     fill: #333 !important;
}
 .modal-form-group {
     margin-bottom: 16px !important;
}
 .modal-form-group label {
     display: block !important;
     font-size: 14px !important;
     font-weight: 500 !important;
     color: #555 !important;
     margin-bottom: 6px !important;
}
 .modal-footer {
     justify-content: space-between !important;
     align-items: center !important;
}
 .modal-button.danger {
     background: #f1f1f1 !important;
     color: #c0392b !important;
     margin-right: auto;
}
 .modal-button.danger:hover {
     background: #e74c3c !important;
     color: #fff !important;
}
 .action-btn {
     position: relative !important;
}
 .action-btn::before {
     content: attr(data-tooltip) !important;
     position: absolute !important;
     bottom: 125% !important;
     left: 50% !important;
     transform: translateX(-50%) !important;
     background-color: #2c3e50 !important;
     color: #fff !important;
     padding: 6px 10px !important;
     border-radius: 6px !important;
     font-size: 12px !important;
     font-weight: 500 !important;
     white-space: nowrap !important;
     opacity: 0 !important;
     visibility: hidden !important;
     transition: opacity 0.2s ease, visibility 0.2s ease !important;
     pointer-events: none !important;
     z-index: 10 !important;
}
 .action-btn::after {
     content: '' !important;
     position: absolute !important;
     bottom: 125% !important;
     left: 50% !important;
     transform: translate(-50%, 10px) !important;
     border: 6px solid transparent !important;
     border-top-color: #2c3e50 !important;
     opacity: 0 !important;
     visibility: hidden !important;
     transition: opacity 0.2s ease, visibility 0.2s ease !important;
     pointer-events: none !important;
     z-index: 10 !important;
}
 .action-btn:hover::before, .action-btn:hover::after {
     opacity: 1 !important;
     visibility: visible !important;
}
 .add-card {
     border: 2px dashed #b0bec5 !important;
     background: #eceff1 !important;
     cursor: pointer !important;
     transition: all 0.2s ease !important;
}
 .add-card:hover {
     background: #cfd8dc !important;
     border-color: #90a4ae !important;
     transform: translateY(-5px) !important;
     box-shadow: 0 8px 15px rgba(0, 0, 0, 0.07) !important;
}
 .add-card svg {
     width: 48px !important;
     height: 48px !important;
     fill: #546e7a !important;
     transition: transform 0.2s ease !important;
}
 .add-card:hover svg {
     transform: scale(1.1) !important;
}
 .resizer {
     position: absolute !important;
     background: transparent !important;
     z-index: 10 !important;
}
 .resizer.se {
     width: 16px !important;
     height: 16px !important;
     bottom: 0 !important;
     right: 0 !important;
     cursor: se-resize !important;
     border-right: 2px solid rgba(0,0,0,0.2) !important;
     border-bottom: 2px solid rgba(0,0,0,0.2) !important;
}

        `;
    shadow.appendChild(style);
    const ICONS = {
      add: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
      delete: `<svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"/></svg>`,
      reset: `<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
      more: `<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
    };
    const showModal = (config) => {
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
      modal.innerHTML = `<p class="modal-title">${title}</p><p class="modal-message">${message}</p>${
        type === "prompt"
          ? `<input type="text" class="modal-input" placeholder="${placeholder}">`
          : ""
      }<div class="modal-footer"></div>`;
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
    };
    const showAddAppModal = (categoryName) => {
      const existingModal = shadow.querySelector(".modal-backdrop");
      if (existingModal) existingModal.remove();
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop";
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `<p class="modal-title">Add App to "${categoryName}"</p><div class="modal-form-group"><label for="add-name-input">App Name</label><input type="text" id="add-name-input" class="modal-input" placeholder="e.g., Google"></div><div class="modal-form-group"><label for="add-url-input">App URL</label><input type="url" id="add-url-input" class="modal-input" placeholder="https://google.com"></div><div class="modal-form-group"><label for="add-icon-input">Icon URL (Optional)</label><input type="url" id="add-icon-input" class="modal-input" placeholder="Paste image address here"></div><div class="modal-footer"></div>`;
      const nameInput = modal.querySelector("#add-name-input");
      const urlInput = modal.querySelector("#add-url-input");
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
        const iconUrl = modal.querySelector("#add-icon-input").value.trim();

        if (!name || !url) {
          showModal({
            type: "alert",
            title: "Error",
            message: "Please fill out all fields.",
          });
          return;
        }
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        const icon = iconUrl ? iconUrl : `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
        const newApp = { name, url, icon };
        tabContent[categoryName].push(newApp);
        saveState();
        setActiveTab(categoryName);
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
    };
    const showEditAppModal = (item, categoryName) => {
      const existingModal = shadow.querySelector(".modal-backdrop");
      if (existingModal) existingModal.remove();
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop";
      const modal = document.createElement("div");
      modal.className = "modal";
      const currentIconValue = item.icon.startsWith('https://www.google.com/s2/favicons') ? '' : item.icon;
      modal.innerHTML = `<p class="modal-title">Edit App</p><div class="modal-form-group"><label for="edit-name-input">Name</label><input type="text" id="edit-name-input" class="modal-input" value="${item.name}"></div><div class="modal-form-group"><label for="edit-url-input">URL</label><input type="text" id="edit-url-input" class="modal-input" value="${item.url}"></div><div class="modal-form-group"><label for="edit-icon-input">Icon URL (Optional)</label><input type="text" id="edit-icon-input" class="modal-input" value="${currentIconValue}" placeholder="Paste image address to override favicon"></div><div class="modal-footer"></div>`;
      const nameInput = modal.querySelector("#edit-name-input");
      const urlInput = modal.querySelector("#edit-url-input");
      const footer = modal.querySelector(".modal-footer");
      const closeModal = () => modalBackdrop.remove();
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete App";
      deleteBtn.className = "modal-button danger";
      deleteBtn.onclick = () => {
        showModal({
          type: "confirm",
          title: "Delete App?",
          message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
          primaryActionText: "Yes, Delete",
          onConfirm: (confirmed) => {
            if (confirmed) {
              const categoryItems = tabContent[categoryName];
              const itemIndex = categoryItems.findIndex(
                (i) => i.name === item.name && i.url === item.url
              );
              if (itemIndex > -1) {
                categoryItems.splice(itemIndex, 1);
                saveState();
                searchInput.value
                  ? renderSearchResults(searchInput.value)
                  : renderContent();
              }
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
        if (!newName || !newUrl) return;
        const categoryItems = tabContent[categoryName];
        const itemToUpdate = categoryItems.find(
          (i) => i.name === item.name && i.url === item.url
        );
        if (itemToUpdate) {
          itemToUpdate.name = newName;
          itemToUpdate.url = newUrl;
          saveState();
          searchInput.value
            ? renderSearchResults(searchInput.value)
            : renderContent();
        }
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
    };
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    const header = document.createElement("div");
    header.className = "header";
    const titleContainer = document.createElement("div");
    titleContainer.style.cssText =
      "display:flex; align-items:center; gap:10px;";
    titleContainer.innerHTML = `<img src="https://img.icons8.com/?size=200&id=nDNCmmDBtU8l&format=png" class="header-logo"><span class="header-title">WebIn</span>`;
    const headerActions = document.createElement("div");
    headerActions.style.cssText =
      "display: flex; align-items: center; gap: 8px;";
    const resetBtn = document.createElement("button");
    resetBtn.className = "close";
    resetBtn.innerHTML = ICONS.reset;
    resetBtn.title = "Reset Extension";
    resetBtn.onclick = () => {
      showModal({
        type: "confirm",
        title: "Reset Extension?",
        message:
          "Are you sure? All your custom categories and links will be permanently deleted.",
        primaryActionText: "Yes, Reset",
        onConfirm: (confirmed) => {
          if (confirmed) {
            if (chrome && chrome.storage && chrome.storage.local) {
              chrome.storage.local.clear(() => {
                initializeDefaultState();
                searchInput.value = "";
                navTabsContainer.innerHTML = "";
                tabs.forEach((tab) =>
                  navTabsContainer.appendChild(createTabButton(tab))
                );
                setActiveTab(tabs.length > 0 ? tabs[0] : null);
                showModal({
                  type: "alert",
                  title: "Reset Complete",
                  message: "The extension has been successfully reset.",
                });
              });
            }
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
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    const searchInput = document.createElement("input");
    searchInput.className = "search-input";
    searchInput.placeholder = "Search all apps...";
    searchContainer.appendChild(searchInput);
    const addCategoryBtn = document.createElement("button");
    addCategoryBtn.innerHTML = ICONS.add;
    addCategoryBtn.setAttribute("data-tooltip", "Add new category");
    addCategoryBtn.className = "action-btn";
    const deleteModeBtn = document.createElement("button");
    deleteModeBtn.innerHTML = ICONS.delete;
    deleteModeBtn.setAttribute("data-tooltip", "Delete category");
    deleteModeBtn.className = "action-btn delete-mode-btn";
    searchContainer.appendChild(addCategoryBtn);
    searchContainer.appendChild(deleteModeBtn);
    wrapper.appendChild(searchContainer);
    const nav = document.createElement("div");
    nav.className = "nav";
    const navTabsContainer = document.createElement("div");
    navTabsContainer.className = "nav-tabs";
    nav.appendChild(navTabsContainer);
    let currentTab = null;
    const content = document.createElement("div");

    const createCard = (item, categoryName, index = 0) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${index * 0.04}s`;
      card.onclick = () => window.open(item.url, "_blank");
      const img = document.createElement("img");
      img.alt = item.name;
      img.loading = "lazy";
      img.src = FALLBACK_ICON_SVG;
      const p = document.createElement("p");
      p.textContent = item.name;
      const menuBtn = document.createElement("button");
      menuBtn.className = "card-menu-btn";
      menuBtn.innerHTML = ICONS.more;
      menuBtn.title = "Edit app";
      menuBtn.onclick = (e) => {
        e.stopPropagation();
        showEditAppModal(item, categoryName);
      };
      card.appendChild(img);
      card.appendChild(p);
      card.appendChild(menuBtn);
      chrome.runtime.sendMessage(
        { type: "fetchImageAsBase64", url: item.icon },
        (response) => {
          if (response && response.success) {
            img.src = response.dataUrl;
          }
        }
      );
      return card;
    };

    const renderContent = (filter = "") => {
      content.innerHTML = "";
      content.className = "content";
      const isSearching = filter !== "";
      if (!currentTab) {
        content.innerHTML = `<div class="empty-state"><p>No categories available. Add one!</p></div>`;
        return;
      }
      const items = tabContent[currentTab] || [];
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
      if (isSearching && filteredItems.length === 0) {
        content.innerHTML = `<div class="empty-state"><p>No results found for "${filter}"</p></div>`;
        return;
      }
      content.classList.add("grid-view");
      filteredItems.forEach((item, index) => {
        content.appendChild(createCard(item, currentTab, index));
      });
      if (!isSearching) {
        if (filteredItems.length === 0) {
          const emptyState = document.createElement("div");
          emptyState.className = "empty-state";
          emptyState.innerHTML = `<p>This category is empty. Click the '+' card to add an app!</p>`;
          content.appendChild(emptyState);
        }
        const addCard = document.createElement("div");
        addCard.className = "card add-card";
        addCard.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
        addCard.title = `Add new app to ${currentTab}`;
        addCard.onclick = () => showAddAppModal(currentTab);
        content.appendChild(addCard);
      }
    };
    const renderSearchResults = (query) => {
      content.innerHTML = "";
      content.className = "content";
      let totalResults = 0;
      Object.entries(tabContent).forEach(([category, items]) => {
        const filteredItems = items.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredItems.length > 0) {
          totalResults++;
          const headerEl = document.createElement("h3");
          headerEl.className = "category-header";
          headerEl.textContent = category;
          content.appendChild(headerEl);
          const grid = document.createElement("div");
          grid.className = "category-grid";
          filteredItems.forEach((item, index) =>
            grid.appendChild(createCard(item, category, index))
          );
          content.appendChild(grid);
        }
      });
      if (totalResults === 0) {
        content.innerHTML = `<div class="empty-state"><p>No results found for "${query}"</p></div>`;
      }
    };
    const setActiveTab = (tabName) => {
      if (isDeleteMode) return;
      if (!tabName) {
        currentTab = null;
        navTabsContainer
          .querySelectorAll("button")
          .forEach((btn) => btn.classList.remove("active"));
        renderContent();
        return;
      }
      currentTab = tabName;
      navTabsContainer.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("active", btn.textContent === tabName);
      });
      renderContent();
    };
    const createTabButton = (tabName) => {
      const button = document.createElement("button");
      button.textContent = tabName;
      button.onclick = () => {
        if (isDeleteMode) {
          showModal({
            type: "confirm",
            title: "Delete Category",
            message: `Are you sure you want to delete "${tabName}"? All links inside will be lost.`,
            primaryActionText: "Yes, Delete",
            onConfirm: (confirmed) => {
              if (confirmed) {
                delete tabContent[tabName];
                tabs.splice(tabs.indexOf(tabName), 1);
                saveState();
                button.remove();
                isDeleteMode = false;
                nav.classList.remove("delete-mode");
                deleteModeBtn.classList.remove("active");
                if (currentTab === tabName) {
                  setActiveTab(tabs.length > 0 ? tabs[0] : null);
                }
              }
            },
          });
        } else {
          if (currentTab === tabName && searchInput.value === "") return;
          searchInput.value = "";
          setActiveTab(tabName);
        }
      };
      return button;
    };
    tabs.forEach((tab) => navTabsContainer.appendChild(createTabButton(tab)));
    addCategoryBtn.onclick = () => {
      if (isDeleteMode) return;
      showModal({
        type: "prompt",
        title: "Add New Category",
        message: "Enter a name for the new category.",
        placeholder: "e.g., Study Material",
        primaryActionText: "Add",
        onConfirm: (newCategoryName) => {
          if (newCategoryName && newCategoryName.trim() !== "") {
            const trimmedName = newCategoryName.trim();
            if (tabContent.hasOwnProperty(trimmedName)) {
              showModal({
                type: "alert",
                title: "Error",
                message: "A category with this name already exists.",
              });
              return;
            }
            tabContent[trimmedName] = [];
            tabs.push(trimmedName);
            saveState();
            const newButton = createTabButton(trimmedName);
            navTabsContainer.appendChild(newButton);
            setActiveTab(trimmedName);
            newButton.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "end",
            });
          }
        },
      });
    };
    deleteModeBtn.onclick = () => {
      isDeleteMode = !isDeleteMode;
      nav.classList.toggle("delete-mode", isDeleteMode);
      deleteModeBtn.classList.toggle("active", isDeleteMode);
    };
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        navTabsContainer
          .querySelectorAll("button")
          .forEach((btn) => btn.classList.remove("active"));
        renderSearchResults(query);
      } else {
        setActiveTab(currentTab);
      }
    });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const firstResult = shadow.querySelector(
          ".content .card:not(.add-card)"
        );
        if (firstResult) firstResult.click();
      }
    });
    wrapper.appendChild(nav);
    wrapper.appendChild(content);
    const footer = document.createElement("div");
    footer.className = "footer";
    footer.textContent = "Powered by caffeine and creativity — Avdesh Jadon ☕";
    wrapper.appendChild(footer);
    shadow.appendChild(wrapper);
    document.body.appendChild(host);
    const resizerSE = document.createElement("div");
    resizerSE.className = "resizer se";
    resizerSE.dataset.direction = "se";
    wrapper.appendChild(resizerSE);
    const positionHost = () => {
      host.style.top = `calc(50% - ${wrapper.offsetHeight / 2}px)`;
      host.style.left = `calc(50% - ${wrapper.offsetWidth / 2}px)`;
    };
    setActiveTab(tabs.length > 0 ? tabs[0] : null);
    positionHost();
    setTimeout(() => {
      host.style.opacity = "1";
      host.style.transform = "scale(1)";
      backdrop.style.opacity = "1";
      searchInput.focus();
    }, 100);
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
    window.addEventListener("resize", positionHost);
  };

  // Start the application
  initializeApp();
})();
