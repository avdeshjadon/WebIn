const WEBIN_CONFIG = {
  FALLBACK_ICON_SVG:
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzU0NmU3YSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTggMTBjMCAxLjEtLjIgMi4xMi0uNTcgMy4wN0wxNC4yNSAxMS45bDIuODIgMi44Mi4wNy4wN2MyLjE4LTIuNC43OC02LjA0LTEuNzQtNy41NVM5LjI5IDQuNDYgNi44OSA2LjY0bC4wOC4wNyAyLjgyIDIuODFMMi45MyAxNC40M0E4LjkzMiA4LjkzMiAwIDAgMSAyIDEyYzAtNC40MiAzLjU4LTggOC04czggMy41OCA4IDh6Ii8+PC9zdmc+",

  DEFAULT_TABS: [
    "AI Tools",
    "LLM",
    "Coding",
    "OpenSource",
    "Social",
    "Shopping",
    "DataBase",
    "Model Hubs",
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
    LLM: [
      {
        name: "Ollama",
        url: "https://ollama.com",
      },
    ],
    Coding: [
      {
        name: "LeetCode",
        url: "https://leetcode.com",
      },
    ],
    OpenSource: [
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
    Social: [
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
    Shopping: [
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
    DataBase: [
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
      {
        name: "PostgreSQL",
        url: "https://www.postgresql.org",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1080px-Postgresql_elephant.svg.png",
      },
      {
        name: "PlanetScale",
        url: "https://planetscale.com",
        icon: "https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/2/planetscale-x0ysfb6g0dedpas15vtc7.png/planetscale-30oedqelebdxwjr0iw40qi.png",
      },
    ],
    "Model Hubs": [
      {
        name: "CivitAI",
        url: "https://civitai.com",
      },
      {
        name: "Hugging Face",
        url: "https://huggingface.co",
      },
    ],
  },
};
