# WebIn - Quick Access Browser Extension 🚀

![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)

**WebIn** is a powerful, lightweight browser extension that provides instant access to your favorite websites and tools through a sleek, draggable overlay. Designed for productivity enthusiasts, it offers a beautiful, customizable dashboard that appears on demand with just a keyboard shortcut.

---

## � Features

### Core Functionality
* **🎹 Quick Activation**: Launch with `Cmd+Shift+Y` (Mac) or `Ctrl+Shift+Y` (Windows/Linux)
* **📁 Smart Categories**: Organize links into custom tabs (AI Tools, Coding, Social, etc.)
* **🔍 Universal Search**: Instantly search across all your apps with real-time filtering
* **✨ High-Quality Icons**: All app icons are loaded in HD quality for a crisp, professional look
* **🎨 Beautiful UI**: Modern, glass-morphism design that works on any website

### Customization
* **➕ Add Categories**: Create unlimited custom categories for your workflow
* **✏️ Edit Apps**: Modify app names, URLs, and icons
* **🗑️ Delete Mode**: Easy category and app management
* **🔄 Reset Option**: Restore default settings with one click

### User Experience  
* **📱 Draggable & Resizable**: Position and size the overlay to your preference
* **💾 Auto-Save**: All changes persist automatically to local storage
* **🔒 Shadow DOM**: Zero conflicts with website styles
* **⚡ Lightweight**: No external dependencies, blazing-fast performance

---

## �️ Screenshot

![WebIn Demo](https://i.imgur.com/JGO7lsw.png)

---

## ⚡ Quick Start

### Installation

1. **Download** or clone this repository:
   ```bash
   git clone https://github.com/avdeshjadon/WebIn.git
   ```

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** (toggle in top-right corner)

4. **Click "Load unpacked"** and select the `WebIn` folder

5. **Done!** The WebIn icon will appear in your toolbar

### Keyboard Shortcut

- **macOS**: `Cmd + Shift + Y`
- **Windows/Linux**: `Ctrl + Shift + Y`

To customize the shortcut, visit `chrome://extensions/shortcuts` and modify the WebIn binding.

---

## �️ Technology Stack

- **JavaScript (ES6+)** - Core logic and UI rendering
- **HTML5 & CSS3** - Shadow DOM styling
- **Chrome Extension API (Manifest V3)**
  - `chrome.storage` - Data persistence
  - `chrome.runtime` - Background messaging
  - `chrome.scripting` - Content injection

---

## 📂 Project Structure

```
WebIn/
├── images/              # Extension icons (16x16 to 96x96)
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-96.png
├── background.js        # Service worker for icon fetching
├── inject.js            # Main UI logic and state management
├── manifest.json        # Extension configuration
├── LICENSE              # MIT License
└── README.md            # Documentation
```

### File Descriptions

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration, permissions, and metadata |
| `background.js` | Handles background tasks like fetching favicons |
| `inject.js` | Contains all UI logic, state management, and event handlers |
| `images/` | Extension icons for browser toolbar and menu |

---

## 🎨 Default Categories

WebIn comes pre-configured with popular tools across multiple categories:

- **AI Tools**: ChatGPT, DeepSeek, Gemini, Grok
- **LLM**: Ollama
- **Coding**: LeetCode
- **OpenSource**: GitHub, Stack Overflow, SourceForge
- **Social**: YouTube, LinkedIn, WhatsApp, Facebook, Instagram, Twitter, Reddit
- **Shopping**: Amazon, Flipkart, Myntra, Meesho, Blinkit
- **Database**: Firebase, Cloudinary
- **Model Hubs**: CivitAI, Hugging Face

All categories and apps are fully customizable!

---

## 💡 Usage Guide

### Adding a New Category
1. Click the **+** button in the search bar
2. Enter a category name
3. Click "Add" to create

### Adding an App
1. Navigate to your desired category
2. Click the **+** card at the end of the grid
3. Fill in app name, URL, and optional icon URL
4. Click "Add App"

### Editing an App
1. Hover over any app card
2. Click the **⋮** menu button
3. Modify details and click "Save"

### Deleting Items
- **Categories**: Click the trash icon, then click the category to delete
- **Apps**: Click the **⋮** menu on the app card, then "Delete App"

### Searching
Simply start typing in the search bar to filter apps across all categories in real-time.

---

## 🔧 Advanced Configuration

### Custom Icons
When adding or editing an app, you can provide a custom icon URL. If no icon is provided, WebIn automatically fetches the favicon from the website. For best results, use high-quality PNG or SVG images (minimum 128x128px recommended).

### Keyboard Navigation
- Press `Enter` while searching to open the first result
- Use `Esc` to close the overlay (click backdrop)

### Resizing
Drag the bottom-right corner of the WebIn window to resize it. The extension remembers your layout preferences.

---

## 🏗️ Architecture

### Shadow DOM Implementation
WebIn uses Shadow DOM to ensure complete style isolation. This prevents any CSS conflicts between the extension and host websites, guaranteeing consistent appearance everywhere.

### State Management
The extension maintains state through two main objects:
- `tabs`: Array of category names
- `tabContent`: Object mapping categories to their apps

State is automatically synchronized with `chrome.storage.local` on every change.

### Event-Driven Design
All user interactions (clicks, drags, searches) are handled through event listeners attached to dynamically created DOM elements, ensuring memory efficiency and responsive UI.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Browser version and OS

### Feature Requests
Share your ideas by opening an issue tagged with `enhancement`.

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test on multiple websites before submitting
- Keep functions small and focused
- Comment complex logic
- Update README if adding new features

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✨ Initial release
- 🎨 HD icon support for all default apps
- 🔍 Real-time search functionality
- 📱 Draggable and resizable UI
- 💾 Local storage persistence
- 🎯 8 default categories with popular apps
- 🔧 Full CRUD operations for categories and apps

---

## 🐛 Known Issues & Roadmap

### Known Issues
- None currently reported

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

```
MIT License

Copyright (c) 2025 Avdesh Jadon

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 👨‍💻 Author

**Avdesh Jadon**

- 🐙 GitHub: [@avdeshjadon](https://github.com/avdeshjadon)
- 💼 LinkedIn: [Avdesh Jadon](https://linkedin.com/in/avdeshjadon)
- 📧 Email: theavdeshjadon@gmail.com

---

## ⭐ Support

If you find WebIn useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🤝 Contributing code
- 📢 Sharing with others

---

## 🙏 Acknowledgments

- Icon sources: Icons8, website favicons, and public CDNs
- Inspiration: Modern productivity tools and launcher applications
- Community: Thanks to all contributors and users

---

<div align="center">

**Made with ☕ and ❤️ by Avdesh Jadon**

[Report Bug](https://github.com/avdeshjadon/WebIn/issues) · [Request Feature](https://github.com/avdeshjadon/WebIn/issues) · [Documentation](https://github.com/avdeshjadon/WebIn/wiki)

</div>
