'use strict';

var obsidian = require('obsidian');

// Default settings on installation ( ≖.≖)

var DEFAULT_SETTINGS = {
  enabled: true,
  altTextTemplate: 'pasted-image-{timestamp}',
  showNotice: true,
  enableCompression: false,
  maxDimension: 1920,
  compressionQuality: 0.85,
  addTrailingNewline: true
};

class PasteIntoObsidianNoteSettingTab extends obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  
// Plugin's control panel (UI) in Obsidian's settings（っ＾▿＾）
  
  display() {
    var containerEl = this.containerEl;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Paste Image Into Obsidian Note (PIION)' });
    
    new obsidian.Setting(containerEl)
      .setName('GitHub')
      .setDesc('Access to the Github repo hehe')
      .addButton(button =>
        button
          .setButtonText('GitHub')
          .setCta()
          .onClick(() => {
            window.open('https://github.com/yousssffffff/Paste-Image-Into-Obsidian-Note', '_blank');
          })
      );
    
    containerEl.createEl('p', {
      text: 'Converts pasted images directly to inline Base64 data URLs without adding attachment files to your vault.',
    });

    new obsidian.Setting(containerEl)
      .setName('Enable inline Base64 paste')
      .setDesc('When enabled, image paste events will be converted directly into Base64 Markdown image links.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enabled)
          .onChange(async (value) => {
            this.plugin.settings.enabled = value;
            await this.plugin.saveSettings();
          })
      );

    new obsidian.Setting(containerEl)
      .setName('Image Alt Text Template')
      .setDesc('Format for the markdown image alt text. Available variables: {timestamp}, {date}, {time}, {counter}.')
      .addText((text) =>
        text
          .setPlaceholder('pasted-image-{timestamp}')
          .setValue(this.plugin.settings.altTextTemplate)
          .onChange(async (value) => {
            this.plugin.settings.altTextTemplate = value.trim() || 'pasted-image';
            await this.plugin.saveSettings();
          })
      );

    new obsidian.Setting(containerEl)
      .setName('Show confirmation notice')
      .setDesc('Displays an Obsidian notice showing image size and successful insertion.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showNotice)
          .onChange(async (value) => {
            this.plugin.settings.showNotice = value;
            await this.plugin.saveSettings();
          })
      );

    new obsidian.Setting(containerEl)
      .setName('Add trailing newline')
      .setDesc('Inserts a new line immediately after the embedded image.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.addTrailingNewline)
          .onChange(async (value) => {
            this.plugin.settings.addTrailingNewline = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl('h3', { text: 'Image Optimization & Sizing (Optional)' });

    new obsidian.Setting(containerEl)
      .setName('Compress & downscale large images')
      .setDesc('Helps keep note file sizes smaller by scaling oversized images and re-compressing before Base64 encoding.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableCompression)
          .onChange(async (value) => {
            this.plugin.settings.enableCompression = value;
            await this.plugin.saveSettings();
            this.display();
          })
      );

    if (this.plugin.settings.enableCompression) {
      new obsidian.Setting(containerEl)
        .setName('Maximum dimension (px)')
        .setDesc('Images exceeding this width or height will be proportionally downscaled.')
        .addSlider((slider) =>
          slider
            .setLimits(600, 3840, 100)
            .setValue(this.plugin.settings.maxDimension)
            .setDynamicTooltip()
            .onChange(async (value) => {
              this.plugin.settings.maxDimension = value;
              await this.plugin.saveSettings();
            })
        );

      new obsidian.Setting(containerEl)
        .setName('JPEG / WebP Quality')
        .setDesc('Compression quality percentage (0.1 to 1.0). Higher means clearer picture with larger Base64 size.')
        .addSlider((slider) =>
          slider
            .setLimits(0.3, 1.0, 0.05)
            .setValue(this.plugin.settings.compressionQuality)
            .setDynamicTooltip()
            .onChange(async (value) => {
              this.plugin.settings.compressionQuality = value;
              await this.plugin.saveSettings();
            })
        );
    }
  }
}

// Plugin's core (fun part of the code) (─‿‿─) 

class PasteIntoObsidianNotePlugin extends obsidian.Plugin {
  async onload() {
    console.log('Loading Paste Into Obsidian Note (PIION) plugin');

    this.pasteCounter = 0;
    await this.loadSettings();

    // Register settings tab
    this.addSettingTab(new PasteIntoObsidianNoteSettingTab(this.app, this));

    // Register DOM paste event with capture: true so we intercept
    // the event BEFORE Obsidian's default handler creates a vault file
    this.registerDomEvent(
      document,
      'paste',
      this.handlePasteEvent.bind(this),
      true
    );

    // Register quick toggle command in command palette
    this.addCommand({
      id: 'toggle-pion-base64',
      name: 'Toggle inline Base64 image paste',
      callback: async () => {
        this.settings.enabled = !this.settings.enabled;
        await this.saveSettings();
        new obsidian.Notice(
          'PION: Inline Base64 image paste is now ' + (this.settings.enabled ? 'ENABLED' : 'DISABLED')
        );
      }
    });

    // Add ribbon icon for fast status/toggle access
    this.addRibbonIcon('image-plus', 'Paste Into Obsidian Note (PION)', () => {
      new obsidian.Notice(
        'PION is active. Any image copied to your clipboard will paste as inline Base64 data!'
      );
    });
  }

  onunload() {
    console.log('Unloading Paste Into Obsidian Note (PION) plugin');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /**
   * Main paste handler
   * @param {ClipboardEvent} event 
   */
  async handlePasteEvent(event) {
    // 1. Check if plugin is active
    if (!this.settings.enabled) return;

    // 2. Ensure active view is an editable MarkdownView
    var activeView = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
    if (!activeView || !activeView.editor) return;

    // 3. Inspect clipboard contents
    var clipboardData = event.clipboardData;
    if (!clipboardData || !clipboardData.items || clipboardData.items.length === 0) return;

    var items = clipboardData.items;
    var imageItem = null;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.kind === 'file' && item.type && item.type.startsWith('image/')) {
        imageItem = item;
        break;
      }
    }

    // Not an image paste, let Obsidian handle standard text/markdown pasting
    if (!imageItem) return;

    // 4. Intercept the event: stop Obsidian from writing an attachment file to disk
    event.preventDefault();
    event.stopPropagation();

    var editor = activeView.editor;
    var file = imageItem.getAsFile();

    if (!file) {
      new obsidian.Notice('PION: Unable to access clipboard image data.');
      return;
    }

    try {
      // 5. Convert image blob to Base64 Data URL (with optional compression)
      var dataUrl;
      if (this.settings.enableCompression) {
        dataUrl = await this.compressImageToDataUrl(
          file,
          this.settings.maxDimension,
          this.settings.compressionQuality
        );
      } else {
        dataUrl = await this.readFileAsDataUrl(file);
      }

      // 6. Generate formatted alt text
      this.pasteCounter++;
      var altText = this.generateAltText(file);

      // 7. Construct Markdown embed string
      var markdownEmbed = '![' + altText + '](' + dataUrl + ')';
      if (this.settings.addTrailingNewline) {
        markdownEmbed += '\n';
      }

      // 8. Insert into active editor at current cursor position
      var cursor = editor.getCursor();
      editor.replaceRange(markdownEmbed, cursor);

      // Advance cursor to end of inserted block
      var linesInserted = markdownEmbed.split('\n');
      var newCursorLine = cursor.line + linesInserted.length - 1;
      var newCursorCh = (linesInserted.length === 1 ? cursor.ch : 0) + linesInserted[linesInserted.length - 1].length;
      editor.setCursor({ line: newCursorLine, ch: newCursorCh });

      // 9. Feedback notification
      if (this.settings.showNotice) {
        var approximateKb = Math.round((dataUrl.length * 0.75) / 1024);
        new obsidian.Notice('PION: Embedded image as Base64 (~' + approximateKb + ' KB)');
      }
    } catch (err) {
      console.error('PION error while converting pasted image:', err);
      new obsidian.Notice('PION Error: Failed to embed image as Base64. Check console.');
    }
  }

  /**
   * Reads a File/Blob directly into a Base64 data URL
   * @param {File|Blob} file 
   * @returns {Promise<string>}
   */
  readFileAsDataUrl(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function(err) {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Optionally downscales and compresses image before generating Data URL
   * @param {File|Blob} file 
   * @param {number} maxDimension 
   * @param {number} quality 
   * @returns {Promise<string>}
   */
  async compressImageToDataUrl(file, maxDimension, quality) {
    var rawDataUrl = await this.readFileAsDataUrl(file);

    // SVGs and GIFs are kept as raw to preserve vectors and animations
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return rawDataUrl;
    }

    return new Promise(function(resolve) {
      var img = new Image();
      img.onload = function() {
        var width = img.naturalWidth || img.width;
        var height = img.naturalHeight || img.height;

        // Check if downscale is needed
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        var outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        var compressedDataUrl = canvas.toDataURL(outputMime, quality);
        resolve(compressedDataUrl);
      };

      img.onerror = function() {
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    });
  }

  /**
   * Formats alt text based on user template
   * @param {File} file 
   * @returns {string}
   */
  generateAltText(file) {
    var now = new Date();
    var pad = function(n) { return n < 10 ? '0' + n : '' + n; };

    var timestamp = now.getTime().toString();
    var dateStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
    var timeStr = pad(now.getHours()) + '-' + pad(now.getMinutes()) + '-' + pad(now.getSeconds());

    var template = this.settings.altTextTemplate || 'pasted-image-{timestamp}';

    return template
      .replace(/{timestamp}/g, timestamp)
      .replace(/{date}/g, dateStr)
      .replace(/{time}/g, timeStr)
      .replace(/{counter}/g, this.pasteCounter.toString());
  }
}

module.exports = PasteIntoObsidianNotePlugin;
