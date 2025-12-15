const WEBIN_STYLES_PART3 = `
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

.modal-button.danger {
  background: #f1f1f1 !important;
  color: #c0392b !important;
  margin-right: auto;
}

.modal-button.danger:hover {
  background: #e74c3c !important;
  color: #fff !important;
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