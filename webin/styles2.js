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
// styles2.js -- Extended Stylesheet (Part 2 of 3)
// ===========================================================
// Continuation of the WebIn CSS rules. Contains styles for:
//   - Action button hover and delete mode states.
//   - Content area, grid layout, and card components.
//   - Category headers and category grid for search results.
//   - Footer bar and empty state placeholder.
//   - Modal backdrop and modal container base styles.
// ----------------------------------------------------------------------------

const WEBIN_STYLES_PART2 = `
.action-btn svg {
  width: 16px !important;
  height: 16px !important;
  fill: #333 !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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
  scroll-behavior: smooth !important;
}

.card {
  position: relative !important;
  background: #fff !important;
  border: 1px solid #000 !important;
  border-radius: 0 !important;
  padding: 14px 8px !important;
  text-align: center !important;
  box-shadow: 3px 3px 0px #888 !important;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  cursor: pointer !important;
  height: 120px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  will-change: transform, box-shadow;
  transform: translateZ(0);
}

.card:hover {
  transform: translateY(-4px) translateZ(0) !important;
  box-shadow: 6px 6px 0px #8b4513 !important;
  border-color: #8b4513 !important;
}

.card:active {
  transform: translateY(-1px) translateZ(0) !important;
  box-shadow: 2px 2px 0px #8b4513 !important;
  transition-duration: 0.1s !important;
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
  animation: modal-scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
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
  transform: scale(0.92) translateZ(0);
  animation: modal-scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}
`;
