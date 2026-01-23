# WebIn - Quick Access Browser Extension

![Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

**WebIn** is a sleek, retro-styled browser extension that gives you instant access to your favorite websites through a customizable overlay dashboard. No more cluttered bookmarks or endless tab searching.

## ✨ Features

| Feature | Description |
|---------|-------------|
| ⌨️ **Quick Launch** | `Cmd+Shift+Y` (Mac) / `Ctrl+Shift+Y` (Windows/Linux) |
| 📁 **Custom Categories** | Organize apps into your own categories |
| 🔍 **Universal Search** | Real-time filtering across all apps |
| 🖱️ **Drag & Resize** | Position and resize the overlay anywhere |
| 💾 **Auto-Save** | All changes persist automatically |
| 🛡️ **Zero Conflicts** | Shadow DOM isolation prevents style clashes |
| 🔄 **Cross-Device Sync** | Sync your apps across devices (optional) |

## 🎯 Why WebIn?

- **Fast**: One keyboard shortcut to access everything
- **Customizable**: Add, edit, delete apps and categories
- **Lightweight**: Minimal footprint, no performance impact
- **Privacy First**: Your data stays in your browser
- **Beautiful UI**: Retro-styled design that stands out

## 🚀 Installation

1. **Clone** the repository
   ```bash
   git clone https://github.com/avdeshjadon/WebIn.git
   ```

2. Open **`chrome://extensions/`** in Chrome

3. Enable **Developer Mode** (top-right toggle)

4. Click **Load unpacked** → Select the `WebIn` folder

5. Press `Cmd+Shift+Y` / `Ctrl+Shift+Y` to launch!

## 📖 Usage

| Action | How To |
|--------|--------|
| **Open WebIn** | `Cmd+Shift+Y` / `Ctrl+Shift+Y` |
| **Add Category** | Click `+` button in search bar |
| **Add App** | Click `+` card in any category |
| **Edit App** | Hover on card → Click menu (⋮) |
| **Delete App** | Hover → Menu → Delete |
| **Delete Category** | Click trash icon on category |
| **Search** | Type to filter across all apps |
| **Resize** | Drag bottom-right corner |
| **Move** | Drag the header bar |

## 🛠️ Tech Stack

- **JavaScript** (ES6+ Modules)
- **Chrome Extension** Manifest V3
- **Shadow DOM** for style isolation
- **Chrome Storage API** for persistence
- **Firebase** (optional sync feature)

## 📂 Project Structure

```
WebIn/
├── webin/                 # Core extension module
│   ├── inject.js          # Main entry point
│   ├── config.js          # Default configuration
│   ├── state.js           # State management
│   ├── ui.js              # UI rendering
│   ├── modals.js          # Modal dialogs
│   ├── events.js          # Event handlers
│   ├── tabs.js            # Tab/category management
│   └── styles[1-3].js     # CSS-in-JS styles
├── session/               # Optional sync module
├── images/                # Extension icons
├── background.js          # Service worker
├── manifest.json          # Extension manifest
└── LICENSE                # Proprietary license
```

## ⚠️ License

**PROPRIETARY SOFTWARE** - All Rights Reserved.

This software is the exclusive property of [Avdesh Jadon](https://github.com/avdeshjadon). No permission is granted to use, copy, modify, or distribute without explicit written consent.

See [LICENSE](LICENSE) for full details.

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <strong>Avdesh Jadon</strong><br>
      <a href="https://github.com/avdeshjadon">GitHub</a> •
      <a href="https://linkedin.com/in/avdeshjadon">LinkedIn</a> •
      <a href="mailto:theavdeshjadon@gmail.com">Email</a>
    </td>
  </tr>
</table>

---

<p align="center">
  <strong>© 2024-2026 Avdesh Jadon. All Rights Reserved.</strong>
</p>
