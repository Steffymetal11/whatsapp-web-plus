/**
 * Message Export Module
 * Handles exporting WhatsApp messages to various services
 */

class MessageExporter {
    constructor() {
        this.exportFormat = 'json';
        this.includeMedia = true;
    }

    /**
     * Extract messages from a chat
     * @param {Object} chat - WhatsApp chat object
     * @param {number} limit - Maximum number of messages to export
     * @returns {Array} - Array of message objects
     */
    extractMessages(chat, limit = 1000) {
        const messages = [];
        
        try {
            const chatModel = chat.msgs;
            if (!chatModel) return messages;

            const msgArray = chatModel.getModelsArray ? chatModel.getModelsArray() : [];
            const msgsToExport = msgArray.slice(-limit);

            for (const msg of msgsToExport) {
                const messageData = {
                    id: msg.id?.id || msg.id,
                    timestamp: msg.t || Date.now() / 1000,
                    from: msg.from?._serialized || msg.from,
                    sender: msg.sender?._serialized || msg.sender,
                    body: msg.body || '',
                    type: msg.type || 'chat',
                    isForwarded: msg.isForwarded || false,
                    hasMedia: msg.hasMedia || false,
                };

                // Add media information if available
                if (msg.hasMedia && this.includeMedia) {
                    messageData.mediaType = msg.type;
                    messageData.caption = msg.caption || '';
                    messageData.filename = msg.filename || '';
                    messageData.mimetype = msg.mimetype || '';
                }

                messages.push(messageData);
            }
        } catch (error) {
            console.error('Error extracting messages:', error);
        }

        return messages;
    }

    /**
     * Format messages as text
     * @param {Array} messages - Array of message objects
     * @returns {string} - Formatted text
     */
    formatAsText(messages) {
        let text = 'WhatsApp Chat Export\n';
        text += '='.repeat(50) + '\n\n';

        for (const msg of messages) {
            const date = new Date(msg.timestamp * 1000);
            const dateStr = date.toLocaleString();
            
            text += `[${dateStr}] ${msg.sender || 'Unknown'}: ${msg.body}\n`;
            
            if (msg.hasMedia) {
                text += `  [Media: ${msg.mediaType}${msg.filename ? ` - ${msg.filename}` : ''}]\n`;
            }
            text += '\n';
        }

        return text;
    }

    /**
     * Format messages as JSON
     * @param {Array} messages - Array of message objects
     * @returns {string} - JSON string
     */
    formatAsJSON(messages) {
        return JSON.stringify({
            exportDate: new Date().toISOString(),
            messageCount: messages.length,
            messages: messages
        }, null, 2);
    }

    /**
     * Format messages as HTML
     * @param {Array} messages - Array of message objects
     * @returns {string} - HTML string
     */
    formatAsHTML(messages) {
        let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>WhatsApp Chat Export</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .message { margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px; }
        .timestamp { color: #666; font-size: 0.9em; }
        .sender { font-weight: bold; color: #075e54; }
        .media { font-style: italic; color: #888; }
    </style>
</head>
<body>
    <h1>WhatsApp Chat Export</h1>
    <p>Exported on: ${new Date().toLocaleString()}</p>
    <p>Total messages: ${messages.length}</p>
    <hr>
`;

        for (const msg of messages) {
            const date = new Date(msg.timestamp * 1000);
            html += `    <div class="message">
        <div class="timestamp">${date.toLocaleString()}</div>
        <div class="sender">${msg.sender || 'Unknown'}</div>
        <div class="body">${this.escapeHtml(msg.body)}</div>`;
            
            if (msg.hasMedia) {
                html += `
        <div class="media">📎 Media: ${msg.mediaType}${msg.filename ? ` - ${msg.filename}` : ''}</div>`;
            }
            
            html += `
    </div>
`;
        }

        html += `</body>
</html>`;

        return html;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Download messages as a file
     * @param {string} content - Content to download
     * @param {string} filename - Name of the file
     * @param {string} mimeType - MIME type of the file
     */
    downloadAsFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Export current chat
     * @param {string} format - Export format (text, json, html)
     * @param {number} limit - Maximum number of messages
     */
    exportCurrentChat(format = 'json', limit = 1000) {
        try {
            // Get current active chat
            const Store = window.Store || {};
            const Chat = Store.Chat;
            
            if (!Chat) {
                console.error('Chat store not found');
                return;
            }

            const activeChat = Chat.getActive ? Chat.getActive() : null;
            
            if (!activeChat) {
                console.error('No active chat found');
                return;
            }

            // Extract messages
            const messages = this.extractMessages(activeChat, limit);
            
            if (messages.length === 0) {
                console.warn('No messages to export');
                return;
            }

            // Format and download
            let content, filename, mimeType;
            const chatName = activeChat.contact?.name || activeChat.name || 'chat';
            const timestamp = new Date().toISOString().split('T')[0];

            switch (format) {
            case 'text':
                content = this.formatAsText(messages);
                filename = `${chatName}_${timestamp}.txt`;
                mimeType = 'text/plain';
                break;
            case 'html':
                content = this.formatAsHTML(messages);
                filename = `${chatName}_${timestamp}.html`;
                mimeType = 'text/html';
                break;
            case 'json':
            default:
                content = this.formatAsJSON(messages);
                filename = `${chatName}_${timestamp}.json`;
                mimeType = 'application/json';
                break;
            }

            this.downloadAsFile(content, filename, mimeType);
            console.log(`Exported ${messages.length} messages as ${format}`);
            
        } catch (error) {
            console.error('Error exporting chat:', error);
        }
    }

    /**
     * Prepare messages for email
     * @param {Array} messages - Array of message objects
     * @returns {Object} - Email data
     */
    prepareForEmail(messages) {
        const subject = `WhatsApp Chat Export - ${new Date().toLocaleDateString()}`;
        const body = this.formatAsText(messages);
        
        return {
            subject: encodeURIComponent(subject),
            body: encodeURIComponent(body.substring(0, 5000)) // Email body size limit
        };
    }

    /**
     * Open email client with exported messages
     * @param {number} limit - Maximum number of messages
     */
    exportToEmail(limit = 100) {
        try {
            const Store = window.Store || {};
            const Chat = Store.Chat;
            const activeChat = Chat.getActive ? Chat.getActive() : null;
            
            if (!activeChat) {
                console.error('No active chat found');
                return;
            }

            const messages = this.extractMessages(activeChat, limit);
            const emailData = this.prepareForEmail(messages);
            
            const mailtoLink = `mailto:?subject=${emailData.subject}&body=${emailData.body}`;
            window.open(mailtoLink, '_blank');
            
        } catch (error) {
            console.error('Error exporting to email:', error);
        }
    }
}

// Export the class
window.MessageExporter = MessageExporter;
