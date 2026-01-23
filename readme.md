# WebIn - Quick Access Browser Extension

![Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)

A lightweight browser extension for instant access to your favorite websites through a retro-styled overlay dashboard.

## Features

- **Quick Launch**: `Cmd+Shift+Y` (Mac) / `Ctrl+Shift+Y` (Windows/Linux)
- **Smart Categories**: AI Tools, Databases, Social, Shopping, Coding & more
- **Universal Search**: Real-time filtering across all apps
- **Draggable & Resizable**: Position anywhere on screen
- **Auto-Save**: Changes persist automatically
- **Zero Conflicts**: Shadow DOM isolation

## Default Apps

| Category | Apps |
|----------|------|
| AI Tools | ChatGPT, Claude, DeepSeek, Gemini, Grok |
| LLM | Ollama |
| Coding | LeetCode |
| OpenSource | GitHub, Stack Overflow, SourceForge |
| Social | YouTube, LinkedIn, WhatsApp, Facebook, Instagram, Twitter, Reddit |
| Shopping | Amazon, Flipkart, Myntra, Meesho, Blinkit |
| DataBase | Firebase, MongoDB, Supabase, PostgreSQL, PlanetScale |
| Model Hubs | CivitAI, Hugging Face |

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/avdeshjadon/WebIn.git
   ```

2. Open `chrome://extensions/` in Chrome

3. Enable **Developer Mode**

4. Click **Load unpacked** and select the WebIn folder

## Usage

- **Add Category**: Click + button in search bar
- **Add App**: Click + card in any category
- **Edit App**: Hover on card → click menu (⋮)
- **Delete**: Use trash icon for categories, menu for apps
- **Search**: Type to filter across all categories
- **Resize**: Drag bottom-right corner

## Tech Stack

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Shadow DOM for style isolation
- chrome.storage for persistence

## Project Structure

```
WebIn/
├── webin/
│   ├── config.js      # Default tabs & apps
│   ├── state.js       # State management
│   ├── ui.js          # UI rendering
│   ├── modals.js      # Modal dialogs
│   ├── events.js      # Event handlers
│   ├── tabs.js        # Tab management
│   ├── styles.js      # CSS styles
│   ├── styles2.js
│   ├── styles3.js
│   └── inject.js      # Main entry point
├── session/           # Session sync module
│   ├── content.js     # Content script entry
│   ├── session-handler.js
│   ├── firebase-init.js
│   ├── firebase-firestore.js
│   └── utils.js
├── images/            # Extension icons
├── background.js      # Service worker
├── manifest.json      # Extension config
└── LICENSE            # Proprietary license
```

## License

**All Rights Reserved** - This software is proprietary. No permission is granted to use, copy, modify, or distribute without explicit written consent from the copyright holder.

See [LICENSE](LICENSE) for details.

## Author

**Avdesh Jadon**
- GitHub: [@avdeshjadon](https://github.com/avdeshjadon)
- LinkedIn: [Avdesh Jadon](https://linkedin.com/in/avdeshjadon)
- Email: theavdeshjadon@gmail.com

---

© 2024-2026 Avdesh Jadon. All Rights Reserved.
