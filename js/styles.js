const WEBIN_STYLES = `
* {
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, sans-serif !important;
}

.card img {
  width: 48px !important;
  height: 48px !important;
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
`;