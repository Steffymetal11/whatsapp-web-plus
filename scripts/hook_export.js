/**
 * Export Hook - Adds export functionality to WhatsApp Web
 */

class HookExport extends Hook {
    constructor() {
        super();
        this.exporter = null;
        this.exportButton = null;
        this.EMAIL_MESSAGE_LIMIT = 100; // Email has size limits
        this.checkHeaderInterval = null;
        this.checkHeaderTimeout = null;
    }

    register() {
        super.register();
        this.exporter = new MessageExporter();
        this.addExportButton();
        console.log('Export hook registered');
    }

    unregister() {
        super.unregister();
        this.removeExportButton();
        console.log('Export hook unregistered');
    }

    /**
     * Add export button to the chat header
     */
    addExportButton() {
        // Wait for the header to be available
        this.checkHeaderInterval = setInterval(() => {
            // Stop checking if button already exists
            if (this.exportButton) {
                clearInterval(this.checkHeaderInterval);
                clearTimeout(this.checkHeaderTimeout);
                return;
            }

            const header = document.querySelector('header[data-testid="conversation-header"]');
            
            if (header) {
                // Create export button
                this.exportButton = document.createElement('div');
                this.exportButton.className = 'export-chat-button';
                this.exportButton.innerHTML = `
                    <button style="
                        background: #25d366;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        padding: 8px 12px;
                        margin: 0 8px;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    " title="Export Chat">
                        <span>📤</span>
                        <span>Export</span>
                    </button>
                `;

                // Add click event
                this.exportButton.addEventListener('click', () => this.showExportMenu());

                // Add to header
                const headerButtons = header.querySelector('[data-testid="conversation-info-header"]');
                if (headerButtons) {
                    headerButtons.appendChild(this.exportButton);
                }

                clearInterval(this.checkHeaderInterval);
                clearTimeout(this.checkHeaderTimeout);
            }
        }, 1000);

        // Clear interval after 10 seconds to avoid infinite checking
        this.checkHeaderTimeout = setTimeout(() => clearInterval(this.checkHeaderInterval), 10000);
    }

    /**
     * Remove export button
     */
    removeExportButton() {
        // Clear any pending intervals/timeouts
        if (this.checkHeaderInterval) {
            clearInterval(this.checkHeaderInterval);
            this.checkHeaderInterval = null;
        }
        if (this.checkHeaderTimeout) {
            clearTimeout(this.checkHeaderTimeout);
            this.checkHeaderTimeout = null;
        }
        
        // Remove the button
        if (this.exportButton) {
            this.exportButton.remove();
            this.exportButton = null;
        }
    }

    /**
     * Show export menu with options
     */
    showExportMenu() {
        // Remove existing menu if any
        const existingMenu = document.getElementById('export-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }

        // Create menu
        const menu = document.createElement('div');
        menu.id = 'export-menu';
        menu.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                padding: 20px;
                z-index: 10000;
                min-width: 300px;
            ">
                <h3 style="margin: 0 0 15px 0; color: #075e54;">Export Chat</h3>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Format:</label>
                    <select id="export-format" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="json">JSON (with metadata)</option>
                        <option value="text">Text (plain format)</option>
                        <option value="html">HTML (formatted view)</option>
                    </select>
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Number of messages:</label>
                    <input type="number" id="export-limit" value="1000" min="1" max="10000" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="export-include-media" checked style="margin-right: 8px;">
                        <span>Include media information</span>
                    </label>
                </div>

                <div style="display: flex; gap: 10px; justify-content: space-between;">
                    <button id="export-download" style="
                        flex: 1;
                        background: #25d366;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        padding: 10px;
                        font-weight: bold;
                    ">📥 Download</button>
                    
                    <button id="export-email" style="
                        flex: 1;
                        background: #34b7f1;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        padding: 10px;
                        font-weight: bold;
                    ">📧 Email</button>
                    
                    <button id="export-cancel" style="
                        background: #999;
                        border: none;
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        padding: 10px;
                        font-weight: bold;
                    ">✖ Cancel</button>
                </div>

                <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 4px; font-size: 12px;">
                    <strong>Note:</strong> Large exports may take time. Media files are referenced but not included in the export.
                </div>
            </div>
            
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            "></div>
        `;

        document.body.appendChild(menu);

        // Add event listeners
        const downloadBtn = document.getElementById('export-download');
        const emailBtn = document.getElementById('export-email');
        const cancelBtn = document.getElementById('export-cancel');
        const formatSelect = document.getElementById('export-format');
        const limitInput = document.getElementById('export-limit');
        const includeMediaCheckbox = document.getElementById('export-include-media');

        downloadBtn.addEventListener('click', () => {
            const format = formatSelect.value;
            const limit = parseInt(limitInput.value) || 1000;
            this.exporter.includeMedia = includeMediaCheckbox.checked;
            this.exporter.exportCurrentChat(format, limit);
            menu.remove();
        });

        emailBtn.addEventListener('click', () => {
            const limit = Math.min(parseInt(limitInput.value) || this.EMAIL_MESSAGE_LIMIT, this.EMAIL_MESSAGE_LIMIT);
            this.exporter.includeMedia = includeMediaCheckbox.checked;
            this.exporter.exportToEmail(limit);
            menu.remove();
        });

        cancelBtn.addEventListener('click', () => {
            menu.remove();
        });

        // Close on backdrop click
        const backdrop = menu.querySelector('div:last-child');
        backdrop.addEventListener('click', () => {
            menu.remove();
        });
    }
}
