This version is a test made with AI but I'll correct and release a better version handmade a bit in the future. But you can still use this one if interested. :)

# Paste Image Into Obsidian Note (PIION)

An minimal and performant Obsidian community plugin that intercepts clipboard image paste events (`Ctrl+V` / `Cmd+V`) in active Markdown editor views and converts the images directly into Base64 Data URLs embedded inline in your note.

## Why PIION?

In standard Obsidian, pasting a screenshot or image generates a new attachment file (e.g. `Pasted image 20261022.png`) inside your vault's attachment directory. Over time, vaults become cluttered with thousands of orphaned or tiny image files.

**PIION eliminates vault clutter:**
- **Zero Attachment Files:** Notes become 100% self-contained single Markdown files.
- **Instant Base64 Conversion:** Encodes directly from your clipboard data.
- **Native Markdown Syntax:** Formatted as standard `![alt-text](data:image/png;base64,...)`.
- **Cross-Platform:** Works seamlessly on Obsidian Desktop (Windows, macOS, Linux) and Obsidian Mobile (iOS & Android).
- **Customizable Alt Text:** Dynamic placeholders like `{timestamp}`, `{date}`, `{time}`, `{counter}`.
- **Optional Downscaling & Compression:** Keep notes lean by auto-resizing giant screenshots.

---

## Installation

### Option 1: Direct Manual Installation
1. In your Obsidian vault, navigate to `.obsidian/plugins/`.
2. Create a folder named `paste-image-into-obsidian-note`.
3. Place `manifest.json` and `main.js` inside this folder:
   ```
   your-vault/.obsidian/plugins/paste-into-obsidian-note/
   ├── manifest.json
   └── main.js
   ```
4. In Obsidian, go to **Settings > Community plugins**.
5. Click **Reload plugins** and toggle **Paste Into Obsidian Note** to ON.

### Option 2: BRAT plugin
On Obsidian, go to the complementary modules page and install the BRAD community plug-in. Then, go in the plugin's settings and press "+" in the Beta plugin list and paste the repo's link and choose the wanted version. For now, only 1.0.0 is available.
---

## Configuration & Options

Under **Settings > Paste Into Obsidian Note**:
- **Enable inline Base64 paste:** Master switch.
- **Image Alt Text Template:** Customize image labels (e.g., `![figure-{counter}](data:...)`).
- **Show confirmation notice:** Displays Obsidian toast notices with estimated embedded size.
- **Image Optimization (Optional):** Restrict maximum width/height (e.g. 1920px) and compress JPEG/WebP quality to avoid excessive file sizes.
