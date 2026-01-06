const WEBIN_STYLES_PART2 = `
.action-btn svg {
  width: 16px !important;
  height: 16px !important;
  fill: #333 !important;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #8b4513 !important;
  border-color: #8b4513 !important;
}

.action-btn:hover svg {
  fill: #fff !important;
}

.delete-mode-btn.active {
  background: #f8d7da !important;
  border-color: #721c24 !important;
}

.delete-mode-btn.active svg {
  fill: #721c24 !important;
}

.content {
  position: relative !important;
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 16px !important;
  background: #f5f5dc !important;
}

.card {
  position: relative !important;
  background: #fff !important;
  border: 1px solid #000 !important;
  border-radius: 0 !important;
  padding: 14px 8px !important;
  text-align: center !important;
  box-shadow: 3px 3px 0px #888 !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
  height: 120px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  animation: fadeIn 0.3s ease forwards;
  opacity: 0;
}

.card:hover {
  transform: translateY(-3px) !important;
  box-shadow: 5px 5px 0px #8b4513 !important;
  border-color: #8b4513 !important;
}

.card p {
  line-height: 1.4 !important;
  font-size: 11px !important;
  color: #333 !important;
  font-weight: 500 !important;
  text-transform: uppercase !important;
}

.content.grid-view {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
  gap: 14px !important;
}

.category-header {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #666 !important;
  padding: 6px 10px !important;
  margin-top: 12px !important;
  border: 1px solid #000 !important;
  background: #e8e8c8 !important;
  text-transform: uppercase !important;
}

.category-header:first-of-type {
  margin-top: 0 !important;
}

.category-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)) !important;
  gap: 14px !important;
  padding-top: 14px !important;
}

.footer {
  padding: 10px !important;
  text-align: center !important;
  font-size: 11px !important;
  color: #666 !important;
  background: #e8e8c8 !important;
  border-top: 2px solid #000 !important;
  text-transform: uppercase !important;
}

.empty-state {
  padding: 40px !important;
  text-align: center !important;
  color: #666 !important;
  grid-column: 1 / -1;
  border: 1px dashed #000 !important;
  background: #fff !important;
}

.empty-state p {
  font-size: 13px !important;
  line-height: 1.5 !important;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: modal-scale-in 0.2s ease forwards;
  opacity: 0;
}

.modal {
  background: #f5f5dc !important;
  padding: 20px !important;
  border-radius: 0 !important;
  box-shadow: 6px 6px 0px #000 !important;
  border: 2px solid #000 !important;
  width: 90% !important;
  max-width: 400px !important;
  text-align: left !important;
  transform: scale(0.95);
  animation: modal-scale-in 0.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}
`;
