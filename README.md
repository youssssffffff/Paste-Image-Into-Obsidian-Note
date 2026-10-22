STILL ON BUILD, First verion made with AI but i'll correct and release a better version handmade.

# Paste Into Obsidian Note (PION)

An ultra-clean, minimal, and performant Obsidian community plugin that intercepts clipboard image paste events (`Ctrl+V` / `Cmd+V`) in active Markdown editor views and converts the images directly into Base64 Data URLs embedded inline in your note.

## ✨ Why PION?

In standard Obsidian, pasting a screenshot or image generates a new attachment file (e.g. `Pasted image 20261022.png`) inside your vault's attachment directory. Over time, vaults become cluttered with thousands of orphaned or tiny image files.

**PION eliminates vault clutter:**
- **Zero Attachment Files:** Notes become 100% self-contained single Markdown files.
- **Instant Base64 Conversion:** Encodes directly from your clipboard data.
- **Native Markdown Syntax:** Formatted as standard `![alt-text](data:image/png;base64,...)`.
- **Cross-Platform:** Works seamlessly on Obsidian Desktop (Windows, macOS, Linux) and Obsidian Mobile (iOS & Android).
- **Customizable Alt Text:** Dynamic placeholders like `{timestamp}`, `{date}`, `{time}`, `{counter}`.
- **Optional Downscaling & Compression:** Keep notes lean by auto-resizing giant screenshots.

---

## 🚀 Installation

### Option 1: Direct Manual Installation (Recommended)
1. In your Obsidian vault, navigate to `.obsidian/plugins/`.
2. Create a folder named `paste-into-obsidian-note`.
3. Place `manifest.json` and `main.js` inside this folder:
   ```
   your-vault/.obsidian/plugins/paste-into-obsidian-note/
   ├── manifest.json
   └── main.js
   ```
4. In Obsidian, go to **Settings > Community plugins**.
5. Click **Reload plugins** and toggle **Paste Into Obsidian Note** to ON.

---

## ⚙️ Configuration & Options

Under **Settings > Paste Into Obsidian Note**:
- **Enable inline Base64 paste:** Master switch.
- **Image Alt Text Template:** Customize image labels (e.g., `![figure-{counter}](data:...)`).
- **Show confirmation notice:** Displays Obsidian toast notices with estimated embedded size.
- **Image Optimization (Optional):** Restrict maximum width/height (e.g. 1920px) and compress JPEG/WebP quality to avoid excessive file sizes.
