const WEBIN_STYLES_PART2 = `
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
`;