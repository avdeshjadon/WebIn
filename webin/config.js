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
// config.js -- Default Configuration and App Database
// ===========================================================
// Central configuration file containing all default settings for WebIn:
//   - Fallback icon SVG for apps whose favicons fail to load.
//   - Default tab categories (AI Tools, LLM, Coding, Hosting, etc.).
//   - Default app entries for each category with names, URLs, and icons.
//
// This data is used on first install or after a reset. Once the user
// customizes their categories and apps, the data is saved to
// chrome.storage.local and this config is no longer referenced.
// ----------------------------------------------------------------------------

const WEBIN_CONFIG = {
  FALLBACK_ICON_SVG:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzU0NmU3YSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTggMTBjMCAxLjEtLjIgMi4xMi0uNTcgMy4wN0wxNC4yNSAxMS45bDIuODIgMi44Mi4wNy4wN2MyLjE4LTIuNC43OC02LjA0LTEuNzQtNy41NVM5LjI5IDQuNDYgNi44OSA2LjY0bC4wOC4wNyAyLjgyIDIuODFMMi45MyAxNC40M0E4LjkzMiA4LjkzMiAwIDAgMSAyIDEyYzAtNC40MiAzLjU4LTggOC04czggMy41OCA4IDh6Ii8+PC9zdmc+",

  DEFAULT_TABS: [
    "AI Tools",
    "LLMs",
    "Coding",
    "Databases",
    "Hosting",
    "Open Source",
    "Whiteboard",
    "Social",
    "Shopping",
    "Miscellaneous",
  ],

  DEFAULT_TAB_CONTENT: {
    "AI Tools": [
      {
        name: "ChatGPT",
        url: "https://chat.openai.com",
      },
      {
        name: "Claude",
        url: "https://claude.ai",
        icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.png",
      },
      {
        name: "DeepSeek",
        url: "https://chat.deepseek.com/",
      },
      {
        name: "Gemini",
        url: "https://gemini.google.com",
      },
      {
        name: "Grok",
        url: "https://grok.com",
        icon: "https://img.icons8.com/?size=512&id=USGXKHXKl9X7&format=png",
      },
    ],
    "LLMs": [
      {
        name: "Ollama",
        url: "https://ollama.com",
      },
    ],
    "Coding": [
      {
        name: "TakeUForward",
        url: "https://takeuforward.org/",
      },
      {
        name: "LeetCode",
        url: "https://leetcode.com",
      },
      {
        name: "GeeksforGeeks",
        url: "https://www.geeksforgeeks.org",
        icon: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/gfg_favicon.png",
      },
      {
        name: "HackerRank",
        url: "https://www.hackerrank.com",
      },
      {
        name: "CodingNinjas Code Studio",
        url: "https://www.codingninjas.com/studio",
        icon: "https://www.codingninjas.com/favicon.ico",
      },
      {
        name: "Codolio",
        url: "https://codolio.com/dashboard",
        icon: "https://codolio.com/favicon.ico",
      },
      {
        name: "CodeHelp",
        url: "https://www.codehelp.in/",
        icon: "https://www.codehelp.in/favicon.ico",
      },
      {
        name: "CodeChef",
        url: "https://www.codechef.com",
        icon: "https://www.codechef.com/favicon.ico",
      },
      {
        name: "Codeforces",
        url: "https://codeforces.com",
        icon: "https://codeforces.com/favicon.ico",
      },
    ],
    "Databases": [
      {
        name: "Firebase",
        url: "https://console.firebase.google.com/u/0/",
        icon: "https://vectorseek.com/wp-content/uploads/2025/05/Firebase-icon-Logo-PNG-SVG-Vector.png",
      },
      {
        name: "MongoDB",
        url: "https://cloud.mongodb.com",
        icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwRUQ2NCI+PHBhdGggZD0iTTEyIDEuMjdjLTIuMiA0LjQtMy4zIDYuNi0zLjMgMTAuNzMgMCA0LjEzIDEuMSA2LjMzIDMuMyAxMC43MyAyLjItNC40IDMuMy02LjYgMy4zLTEwLjczIDAtNC4xMy0xLjEtNi4zMy0zLjMtMTAuNzN6bS0uNSA0djE1aC0uMXYtMTVoLjF6Ii8+PC9zdmc+",
      },
      {
        name: "Supabase",
        url: "https://supabase.com/dashboard",
        icon: "https://img.icons8.com/?size=512&id=grZaE9tjqDyr&format=png",
      },
    ],
    "Hosting": [
      {
        name: "Azure Portal",
        url: "https://portal.azure.com/?Microsoft_Azure_Education_correlationId=ba7ace37-16b7-4aa5-bf58-d3e286de0aa5&Microsoft_Azure_Education_newA4E=true&Microsoft_Azure_Education_asoSubGuid=e893fc9a-852b-4959-96ec-7ed71973ac8a&feature.tokencaching=true&feature.internalgraphapiversion=true#@lpu.in/resource/subscriptions/e893fc9a-852b-4959-96ec-7ed71973ac8a/resourceGroups/openclaw_group/providers/Microsoft.Compute/virtualMachines/openclaw/networkSettings",
      },
      {
        name: "Web3Forms",
        url: "https://app.web3forms.com/",
      },
      {
        name: "Vercel",
        url: "https://vercel.com",
        icon: "https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico",
      },
      {
        name: "Cloudflare",
        url: "https://dash.cloudflare.com",
        icon: "https://upload.wikimedia.org/wikipedia/commons/9/94/Cloudflare_Logo.png",
      },
    ],
    "Open Source": [
      {
        name: "GitHub",
        url: "https://github.com",
      },
      {
        name: "Stack Overflow",
        url: "https://stackoverflow.com",
      },
      {
        name: "SourceForge",
        url: "https://sourceforge.net",
      },
    ],
    "Whiteboard": [
      {
        name: "Excalidraw",
        url: "https://excalidraw.com/",
        icon: "https://excalidraw.com/favicon.ico"
      },
      {
        name: "Eraser.io",
        url: "https://eraser.io",
        icon: "https://app.eraser.io/favicon.ico"
      }
    ],
    "Social": [
      {
        name: "YouTube",
        url: "https://youtube.com",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com",
      },
      {
        name: "WhatsApp",
        url: "https://www.whatsapp.com",
      },
      {
        name: "Facebook",
        url: "https://facebook.com",
      },
      {
        name: "Instagram",
        url: "https://instagram.com",
      },
      {
        name: "Twitter",
        url: "https://twitter.com",
      },
      {
        name: "Reddit",
        url: "https://reddit.com",
      },
    ],
    "Shopping": [
      {
        name: "Amazon",
        url: "https://amazon.com",
      },
      {
        name: "Flipkart",
        url: "https://flipkart.com",
      },
      {
        name: "Myntra",
        url: "https://myntra.com",
      },
      {
        name: "Meesho",
        url: "https://meesho.com",
      },
      {
        name: "Blinkit",
        url: "https://blinkit.com",
      },
    ],
    "Miscellaneous": [
      {
        name: "NetMirror",
        url: "https://netmirror.gg/2/en",
      },
    ],
  },
};
