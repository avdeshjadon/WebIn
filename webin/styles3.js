// ----------------------------------------------------------------------------
// WebIn -- Floating Overlay for Instant Access to Web Applications
// ----------------------------------------------------------------------------
// Author   : Avdesh Jadon
// GitHub   : https://github.com/avdeshjadon
// License  : MIT License -- free to use, modify, and distribute.
//            See LICENSE file in the project root for full license text.
// ----------------------------------------------------------------------------
// If this project helped you, consider starring the repository, opening a
// pull request, or reporting issues on GitHub. Contributions are welcome.
// ----------------------------------------------------------------------------
//
// styles3.js -- Modal and Card Menu Stylesheet (Part 3 of 3)
// ===========================================================
// Final part of the WebIn CSS rules. Contains styles for:
//   - Modal title, message, footer, and button variants (primary, secondary, danger).
//   - Card context menu (three-dot edit button with hover reveal).
//   - Modal form group labels and input focus states.
//   - Add-card dashed border style with rotate animation.
//   - Resizer handle for SE corner drag-to-resize.
//   - Custom scrollbar styling for the content area.
// ----------------------------------------------------------------------------

const WEBIN_STYLES_PART3 = `
.modal-title {
  font-size: 16px !important;
  font-weight: 600 !important;
  margin-bottom: 6px !important;
  color: #333 !important;
  line-height: 1.4 !important;
  text-transform: uppercase !important;
  border-bottom: 2px solid #000 !important;
  padding-bottom: 8px !important;
}

.modal-message {
  font-size: 13px !important;
  color: #666 !important;
  margin-bottom: 16px !important;
  line-height: 1.5 !important;
}

.modal-footer {
  display: flex !important;
  justify-content: flex-end !important;
  gap: 8px !important;
  margin-top: 20px !important;
}

.modal-button {
  padding: 8px 16px !important;
  border-radius: 0 !important;
  border: 1px solid #000 !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.4 !important;
  text-transform: uppercase !important;
  font-size: 11px !important;
  font-family: 'IBM Plex Mono', monospace !important;
  box-shadow: 2px 2px 0px #888 !important;
}

.modal-button.primary {
  background: #8b4513 !important;
  color: #fff !important;
  border-color: #8b4513 !important;
}

.modal-button.primary:hover {
  background: #a0522d !important;
  transform: translateY(-1px) !important;
  box-shadow: 3px 3px 0px #000 !important;
}

.modal-button.secondary {
  background: #fff !important;
  color: #333 !important;
}

.modal-button.secondary:hover {
  background: #e8e8c8 !important;
}

.card-menu-btn {
  position: absolute !important;
  top: 4px !important;
  right: 4px !important;
  background: #e8e8c8 !important;
  border: 1px solid #000 !important;
  border-radius: 0 !important;
  width: 22px !important;
  height: 22px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 0 !important;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  z-index: 5 !important;
}

.card:hover .card-menu-btn {
  opacity: 1 !important;
}

.card-menu-btn:hover {
  background: #8b4513 !important;
}

.card-menu-btn:hover svg {
  fill: #fff !important;
}

.card-menu-btn svg {
  width: 14px !important;
  height: 14px !important;
  fill: #333 !important;
}

.modal-form-group {
  margin-bottom: 14px !important;
}

.modal-form-group label {
  display: block !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  color: #666 !important;
  margin-bottom: 5px !important;
  text-transform: uppercase !important;
}

.modal-button.danger {
  background: #fff !important;
  color: #721c24 !important;
  border-color: #721c24 !important;
  margin-right: auto;
}

.modal-button.danger:hover {
  background: #721c24 !important;
  color: #fff !important;
}

.add-card {
  border: 2px dashed #8b4513 !important;
  background: #fff !important;
  cursor: pointer !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: none !important;
}

.add-card:hover {
  background: #e8e8c8 !important;
  border-color: #000 !important;
  transform: translateY(-4px) translateZ(0) !important;
  box-shadow: 3px 3px 0px #8b4513 !important;
}

.add-card svg {
  width: 40px !important;
  height: 40px !important;
  fill: #8b4513 !important;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.add-card:hover svg {
  transform: rotate(90deg) !important;
}

.resizer {
  position: absolute !important;
  background: transparent !important;
  z-index: 10 !important;
}

.resizer.se {
  width: 14px !important;
  height: 14px !important;
  bottom: 0 !important;
  right: 0 !important;
  cursor: se-resize !important;
  border-right: 2px solid #000 !important;
  border-bottom: 2px solid #000 !important;
}

/* Scrollbar styling */
.content::-webkit-scrollbar {
  width: 8px !important;
}

.content::-webkit-scrollbar-track {
  background: #e8e8c8 !important;
  border-left: 1px solid #000 !important;
}

.content::-webkit-scrollbar-thumb {
  background: #8b4513 !important;
  border: 1px solid #000 !important;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #a0522d !important;
}
`;
