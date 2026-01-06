const WEBIN_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap');

* {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: 'IBM Plex Mono', 'Consolas', monospace !important;
}

.wrapper {
  width: 90vw;
  max-width: 900px;
  height: 70vh;
  min-height: 520px;
  background: #f5f5dc !important;
  color: #333 !important;
  border-radius: 0 !important;
  box-shadow: 4px 4px 0px #000 !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  border: 2px solid #000 !important;
}

.header {
  background: linear-gradient(90deg, #8b4513, #a0522d) !important;
  padding: 12px 16px !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  cursor: grab !important;
  user-select: none !important;
  border-bottom: 2px solid #000 !important;
}

.header-logo {
  width: 22px !important;
  height: 22px !important;
  filter: brightness(0) invert(1) !important;
}

.header-title {
  font-weight: 600 !important;
  font-size: 14px !important;
  color: #fff !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
}

.close {
  background: transparent !important;
  border: 1px solid #fff !important;
  font-size: 18px !important;
  cursor: pointer !important;
  color: #fff !important;
  width: 26px !important;
  height: 26px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 0 !important;
  transition: all 0.2s ease !important;
  line-height: 1 !important;
}

.close svg {
  width: 14px !important;
  height: 14px !important;
  fill: #fff !important;
}

.close:hover {
  background: #fff !important;
}

.close:hover svg {
  fill: #8b4513 !important;
}

.nav {
  display: flex !important;
  padding: 10px !important;
  background: #e8e8c8 !important;
  align-items: center !important;
  border-bottom: 2px solid #000 !important;
}

.nav-tabs {
  display: flex !important;
  gap: 6px !important;
  flex-grow: 1 !important;
  overflow-x: auto !important;
  flex-wrap: nowrap !important;
  padding-bottom: 8px !important;
  margin-bottom: -8px !important;
}

.nav-tabs::-webkit-scrollbar {
  height: 4px !important;
}

.nav-tabs::-webkit-scrollbar-track {
  background: #d5d5b5 !important;
}

.nav-tabs::-webkit-scrollbar-thumb {
  background: #8b4513 !important;
}

.nav button {
  line-height: 1.4 !important;
  padding: 6px 12px !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  border: 1px solid #000 !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  background: #fff !important;
  color: #666 !important;
  box-shadow: 2px 2px 0px #888 !important;
  transition: all 0.2s ease !important;
  flex-shrink: 0 !important;
  text-transform: uppercase !important;
}

.nav button:hover {
  background: #e8e8c8 !important;
  color: #333 !important;
}

.nav button.active {
  background: #333 !important;
  color: #fff !important;
  border-color: #000 !important;
}

.nav.delete-mode .nav-tabs button {
  background: #f8d7da !important;
  color: #721c24 !important;
  border-color: #721c24 !important;
  cursor: crosshair !important;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px !important;
  background: #e8e8c8 !important;
  border-bottom: 2px solid #000 !important;
}

.search-input {
  flex-grow: 1;
  width: 100% !important;
  padding: 8px 12px !important;
  border-radius: 0 !important;
  border: 1px solid #000 !important;
  font-size: 13px !important;
  outline: none !important;
  transition: all 0.2s ease !important;
  background-color: #fff !important;
  color: #333 !important;
  font-family: 'IBM Plex Mono', monospace !important;
}

.search-input::placeholder {
  color: #666 !important;
  opacity: 1 !important;
}

.search-input:focus {
  border-color: #8b4513 !important;
  box-shadow: 2px 2px 0px #8b4513 !important;
}

.action-btn {
  background: #fff !important;
  border: 1px solid #000 !important;
  padding: 6px !important;
  width: 34px !important;
  height: 34px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 0 !important;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 0px #888 !important;
}

.card img {
  width: 44px !important;
  height: 44px !important;
  margin-bottom: 8px !important;
  object-fit: contain !important;
  border: 1px solid #000 !important;
  padding: 4px !important;
  background: #fff !important;
}

.modal-input, .modal-select {
  width: 100% !important;
  padding: 10px 12px !important;
  border: 1px solid #000 !important;
  border-radius: 0 !important;
  font-size: 13px !important;
  background: #fff !important;
  color: #333 !important;
  font-family: 'IBM Plex Mono', monospace !important;
}

.modal-input:focus, .modal-select:focus {
  outline: none !important;
  border-color: #8b4513 !important;
  box-shadow: 2px 2px 0px #8b4513 !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
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
`;
