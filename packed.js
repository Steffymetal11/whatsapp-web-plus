/* global require */
window.plus_main = () => {
    class Hook {
        constructor() {
            this.is_registered = false;
        }
    
        register() {
            this.is_registered = true;
        }
    
        unregister() {
            this.is_registered = false;
        }
    }
    

    function set_key_json_recursive(obj, key, value) {
        for (let [current_key, current_value] of Object.entries(obj)) {
            if (current_key === key) {
                obj[current_key] = value;
            } else if (typeof current_value === 'object') {
                obj[current_key] = set_key_json_recursive(current_value, key, value);
            }
        }
        return obj;
    }
    

    const WA_MODULES = {
        PROCESS_EDIT_MESSAGE: 'WAWebDBProcessEditProtocolMsgs',
        PROCESS_RENDERABLE_MESSAGES: 'WAWebMessageProcessRenderable',
        MESSAGES_RENDERER: 'WAWebMessageMeta.react',
        SEND_MESSAGE: 'WAWebSendMsgRecordAction',
        QUERY_GROUP: 'WAWebGroupMsgSendUtils',
        OPEN_CHAT: 'useWAWebSetModelValue',
        HANDLE_RECEIPT: 'WAWebHandleDirectChatReceipt',
        RECEIPT_BATCHER: 'WAWebMessageReceiptBatcher',
        WEB_ACK: 'WAWebAck',
        WID_FACTORY: 'WAWebWidFactory',
        SERVER_PROPS: 'WAWebServerPropConstants',
        REVOKE_CONSTANTS: 'WAWebRevokeMsgConstants',
    };
    
    let MODULES = {
        PROCESS_EDIT_MESSAGE: undefined,
        PROCESS_RENDERABLE_MESSAGES: undefined,
        MESSAGES_RENDERER: undefined,
        SEND_MESSAGE: undefined,
        QUERY_GROUP: undefined,
        OPEN_CHAT: undefined,
        HANDLE_RECEIPT: undefined,
        RECEIPT_BATCHER: undefined,
        WEB_ACK: undefined,
        WID_FACTORY: undefined,
        SERVER_PROPS: undefined,
        REVOKE_CONSTANTS: undefined,
    };
    

    const initialize_modules = () => {
        MODULES = {
            PROCESS_EDIT_MESSAGE: require(WA_MODULES.PROCESS_EDIT_MESSAGE),
            PROCESS_RENDERABLE_MESSAGES: require(WA_MODULES.PROCESS_RENDERABLE_MESSAGES),
            MESSAGES_RENDERER: require(WA_MODULES.MESSAGES_RENDERER),
            QUERY_GROUP: require(WA_MODULES.QUERY_GROUP),
            SEND_MESSAGE: require(WA_MODULES.SEND_MESSAGE),
            OPEN_CHAT: require(WA_MODULES.OPEN_CHAT),
            HANDLE_RECEIPT: require(WA_MODULES.HANDLE_RECEIPT),
            RECEIPT_BATCHER: require(WA_MODULES.RECEIPT_BATCHER),
            WEB_ACK: require(WA_MODULES.WEB_ACK),
            WID_FACTORY: require(WA_MODULES.WID_FACTORY),
            SERVER_PROPS: require(WA_MODULES.SERVER_PROPS),
            REVOKE_CONSTANTS: require(WA_MODULES.REVOKE_CONSTANTS),
        };
        console.log('Modules have been loaded successfully!');
    };
    

    class SettingsHook extends Hook {
        constructor() {
            super();
            this.original_multicats = null;
            this.original_revoke_window = null;
        }
    
        register() {
            if (this.is_registered) {
                return;
            }
            super.register();
            this.original_multicats = MODULES.SERVER_PROPS.MULTICAST_LIMIT_GLOBAL;
            MODULES.SERVER_PROPS.MULTICAST_LIMIT_GLOBAL = Infinity;
            this.original_revoke_window = MODULES.REVOKE_CONSTANTS.REVOKE_WINDOW;
            MODULES.REVOKE_CONSTANTS.REVOKE_WINDOW = Infinity;
        }
    
        unregister() {
            if (!this.is_registered) {
                return;
            }
            MODULES.SERVER_PROPS.MULTICAST_LIMIT_GLOBAL = this.original_multicats;
            MODULES.REVOKE_CONSTANTS.REVOKE_WINDOW = this.original_revoke_window;
        }
    
    }
    

    const APPLE_SVG = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#b3b3b3" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.773 22.773" xml:space="preserve" stroke="#b3b3b3"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"/> <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>';
    const ANDROID_SVG = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="24px" height="24px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5915 3.88444C13.6002 3.32107 14.7626 3 16 3C17.2374 3 18.3998 3.32107 19.4085 3.88444L20.1464 3.14645C20.3417 2.95118 20.6583 2.95118 20.8536 3.14645C21.0488 3.34171 21.0488 3.65829 20.8536 3.85355L20.2612 4.44595C21.9266 5.72558 23 7.73743 23 10H9C9 7.73743 10.0734 5.72558 11.7388 4.44595L11.1464 3.85355C10.9512 3.65829 10.9512 3.34171 11.1464 3.14645C11.3417 2.95118 11.6583 2.95118 11.8536 3.14645L12.5915 3.88444ZM14 7C14 7.55228 13.5523 8 13 8C12.4477 8 12 7.55228 12 7C12 6.44772 12.4477 6 13 6C13.5523 6 14 6.44772 14 7ZM19 8C19.5523 8 20 7.55228 20 7C20 6.44772 19.5523 6 19 6C18.4477 6 18 6.44772 18 7C18 7.55228 18.4477 8 19 8Z" fill="#87C527"/> <path d="M5 12.5C5 11.6716 5.67157 11 6.5 11C7.32843 11 8 11.6716 8 12.5V18.5C8 19.3284 7.32843 20 6.5 20C5.67157 20 5 19.3284 5 18.5V12.5Z" fill="#87C527"/> <path d="M12 24V27.5C12 28.3284 12.6716 29 13.5 29C14.3284 29 15 28.3284 15 27.5V24H17V27.5C17 28.3284 17.6716 29 18.5 29C19.3284 29 20 28.3284 20 27.5V24H21C22.1046 24 23 23.1046 23 22V11H9V22C9 23.1046 9.89543 24 11 24H12Z" fill="#87C527"/> <path d="M24 12.5C24 11.6716 24.6716 11 25.5 11C26.3284 11 27 11.6716 27 12.5V18.5C27 19.3284 26.3284 20 25.5 20C24.6716 20 24 19.3284 24 18.5V12.5Z" fill="#87C527"/> </g></svg>';
    const DESKTOP_SVG = '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="24px" height="24px" viewBox="0 0 32.00 32.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><path d="M12.8612 27.943C12.8281 28.4061 13.1949 28.8 13.6592 28.8H18.3408C18.8051 28.8 19.1719 28.4061 19.1388 27.943L18.4 17.6H13.6L12.8612 27.943Z" fill="url(#paint0_linear_103_1792)"/><path d="M28.8 0H3.2C1.43269 0 0 1.43269 0 3.2V19.2C0 20.9673 1.43269 22.4 3.2 22.4H28.8C30.5673 22.4 32 20.9673 32 19.2V3.2C32 1.43269 30.5673 0 28.8 0Z" fill="url(#paint1_radial_103_1792)"/><path d="M0 20.8C0 22.5673 1.43269 24 3.2 24H28.8C30.5674 24 32 22.5673 32 20.8V17.6H0V20.8Z" fill="#D8D8D8"/><path d="M17.6 20.8C17.6 19.9163 16.8837 19.2 16 19.2C15.1163 19.2 14.4 19.9163 14.4 20.8C14.4 21.6837 15.1163 22.4 16 22.4C16.8837 22.4 17.6 21.6837 17.6 20.8Z" fill="#2B2B2B"/><defs><linearGradient id="paint0_linear_103_1792" x1="16" y1="16.1707" x2="16" y2="28.8" gradientUnits="userSpaceOnUse"><stop stop-color="#B8B8B8"/><stop offset="1" stop-color="#C7C7C7"/></linearGradient><radialGradient id="paint1_radial_103_1792" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1.0941 28.8) rotate(137.02) scale(42.2447 63.3453)"><stop/><stop offset="1" stop-color="#757575"/></radialGradient></defs></g></svg>';
    const get_svg_by_id = (id) => {
        return id.length > 22 ? ANDROID_SVG : id.substring(0, 2) === '3A' ? APPLE_SVG : DESKTOP_SVG;
    };
    
    class HookRendered extends Hook {
        constructor() {
            super();
            this.original_function = null;
        }
    
    
        register() {
            if (this.is_registered) {
                return;
            }
            super.register();
            this.original_function = MODULES.MESSAGES_RENDERER.Meta;
            const original_function = this.original_function;
            MODULES.MESSAGES_RENDERER.Meta = function () {
                const ret = original_function(...arguments);
                HookRendered.device_handler(arguments[0]?.msg);
                return ret;
            };
        }
    
        unregister() {
            if (!this.is_registered) {
                return;
            }
            super.unregister();
            MODULES.MESSAGES_RENDERER.Meta = this.original_function;
        }
    
        static device_handler(message) {
            const message_elements = document.querySelectorAll(`[data-id="${message.id._serialized}"]`);
            if (message_elements.length !== 1) {
                return;
            }
            const message_parts = Array.from(message_elements[0].childNodes[0].childNodes[0].childNodes[0].childNodes);
            const message_box = message_parts.find((element) => element.innerText.includes(':'));
            if (message_box?.childNodes?.length < 2) {
                return;
            }
            const insert_into = message_box.childNodes[message_box.childNodes.length - 1];
            if (Array.from(insert_into.childNodes).some((element) => element.tagName === 'SVG')) {
                return;
            }
            const div_svg = document.createElement('svg');
            div_svg.innerHTML = get_svg_by_id(message.id.id);
            insert_into.prepend(div_svg);
        }
    }
    

    const REVOKE_SUBTYPES = ['sender_revoke', 'admin_revoke'];
    
    class RenderableMessageHook extends Hook {
        constructor() {
            super();
            this.original_function = null;
        }
    
        register() {
            if (this.is_registered) {
                return;
            }
            super.register();
            this.original_function = MODULES.PROCESS_RENDERABLE_MESSAGES.processRenderableMessages;
            const original_function = this.original_function;
            MODULES.PROCESS_RENDERABLE_MESSAGES.processRenderableMessages = function () {
                arguments[0] = arguments[0].filter((message) => {
                    return !RenderableMessageHook.handle_message(message);
                });
                return original_function(...arguments);
            };
        }
    
        unregister() {
            if (!this.is_registered) {
                return;
            }
            super.unregister();
            MODULES.PROCESS_RENDERABLE_MESSAGES.processRenderableMessages = this.original_function;
        }
    
        static handle_message(message) {
            let should_ignore = false;
            should_ignore |= RenderableMessageHook.revoke_handler(message);
            return should_ignore;
        }
    
        static revoke_handler(message) {
            if (!REVOKE_SUBTYPES.includes(message?.subtype)) {
                return false;
            }
            message.type = 'chat';
            message.body = '🚫 This message was deleted!';
            message.quotedStanzaID = message.protocolMessageKey.id;
            message.quotedParticipant = message.protocolMessageKey?.participant || message.from;
            message.quotedMsg = {
                'type': 'chat',
            };
            delete message.protocolMessageKey;
            delete message.subtype;
            return false;
        }
    }
    

    class EditMessageHook extends Hook {
        constructor() {
            super();
            this.original_function = null;
        }
    
        register() {
            if (this.is_registered) {
                return;
            }
            super.register();
            this.original_function = MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs;
            const original_function = this.original_function;
            MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs = function () {
                arguments[0] = arguments[0].filter((message) => {
                    console.log(message);
                    return !EditMessageHook.handle_edited_message(message, ...arguments);
                });
    
                return original_function(...arguments);
            };
            MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsg = MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs;
        }
    
        unregister() {
            if (!this.is_registered) {
                return;
            }
            super.unregister();
            MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsgs = this.original_function;
            MODULES.PROCESS_EDIT_MESSAGE.processEditProtocolMsg = this.original_function;
        }
    
        static handle_edited_message() {
            const message = arguments[0];
            message.type = 'chat';
            message.body = `✏️ This message was edited to: ${message?.body || message?.caption}`;
            if (!message.protocolMessageKey) {
                return true;
            }
            message.quotedStanzaID = message.protocolMessageKey.id;
            message.quotedParticipant = message.protocolMessageKey?.participant || message.from;
            message.quotedMsg = {
                type: 'chat',
            };
            delete message.latestEditMsgKey;
            delete message.protocolMessageKey;
            delete message.subtype;
            delete message.editMsgType;
            delete message.latestEditSenderTimestampMs;
            MODULES.PROCESS_RENDERABLE_MESSAGES.processRenderableMessages(
                [message],
                window.webpackChunkwhatsapp_web_client?.length > 0 ? arguments[1] : {
                    'author': message.from,
                    'type': 'chat',
                    'externalId': message.id.id,
                    'edit': -1,
                    'isHsm': false,
                    'chat': message.id.remote,
                },
                null,
                {verifiedLevel: 'unknown'},
                null,
                0,
                arguments[2] === undefined ? arguments[1] : arguments[2]
            );
            return true;
        }
    }
    

    class HookSendMessage extends Hook {
        constructor() {
            super();
            this.original_function = null;
        }
    
        register() {
            if (this.is_registered) {
                return;
            }
            super.register();
            const filters = {
                '@everyone': 'participants',
                '@admins': 'admins',
            };
    
            this.original_function = MODULES.SEND_MESSAGE.sendMsgRecord;
            const original_function = this.original_function;
            MODULES.SEND_MESSAGE.sendMsgRecord = async function (message) {
                if (typeof message?.body === 'string') {
                    for (const [tag, filter] of Object.entries(filters)) {
                        if (message.body.includes(tag)) {
                            message = await HookSendMessage.handle_tag_all_message(message, filter);
                        }
                    }
                }
                return original_function(message);
            };
        }
    
        unregister() {
            if (!this.is_registered) {
                return;
            }
            super.unregister();
            MODULES.SEND_MESSAGE.sendMsgRecord = this.original_function;
        }
    
        static async handle_tag_all_message (message, filter) {
            if (message.id.remote.server !== 'g.us') {
                return message;
            }
            const group_metadata = await MODULES.QUERY_GROUP.getParticipantRecord(message.id.remote.toString());
            for (const participant of group_metadata[filter]) {
                message.mentionedJidList.push(MODULES.WID_FACTORY.createWid(participant));
            }
            return message;
        }
    }
    

    class HookReceipts extends Hook {
        constructor() {
            super();
            this.original_function = null;
        }
    
        register() {
            if (this.is_registered) {
                return;
            }
            super.register();
            this.original_function = MODULES.HANDLE_RECEIPT.handleChatSimpleReceipt;
            const original_function = this.original_function;
            MODULES.HANDLE_RECEIPT.handleChatSimpleReceipt = function (receipt) {
                if (receipt?.from?.server === 'c.us' && receipt?.ack === MODULES.WEB_ACK.ACK.READ) {
                    const msg_keys = [];
                    for (const msg of receipt.externalIds) {
                        msg_keys.push(`true_${receipt.from._serialized}_${msg}`);
                    }
                    MODULES.RECEIPT_BATCHER.receiptBatcher.acceptOtherReceipt({
                        ack: MODULES.WEB_ACK.ACK.READ,
                        ts: receipt.ts,
                        receiverId: receipt.from,
                        msgKeys: msg_keys,
                        isSender: false
                    });
                }
                return original_function(...arguments);
            };
        }
    
        unregister() {
            if (!this.is_registered) {
                return;
            }
            super.unregister();
            MODULES.HANDLE_RECEIPT.handleChatSimpleReceipt = this.original_function;
        }
    }
    

    /**
     * Message Export Module
     * Handles exporting WhatsApp messages to various services
     */
    
    class MessageExporter {
        constructor() {
            this.exportFormat = 'json';
            this.includeMedia = true;
            this.MAX_EMAIL_BODY_SIZE = 5000; // Email body size limit in characters
            this.MILLISECONDS_PER_SECOND = 1000; // Conversion factor for timestamps
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
                        timestamp: msg.t || Date.now() / this.MILLISECONDS_PER_SECOND,
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
                const date = new Date(msg.timestamp * this.MILLISECONDS_PER_SECOND);
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
                const date = new Date(msg.timestamp * this.MILLISECONDS_PER_SECOND);
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
            // Handle null/undefined text
            if (!text) {
                return '';
            }
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
         * @param {string} recipientEmail - Optional recipient email address
         * @returns {Object} - Email data
         */
        prepareForEmail(messages, recipientEmail = '') {
            const subject = `WhatsApp Chat Export - ${new Date().toLocaleDateString()}`;
            const body = this.formatAsText(messages);
            
            return {
                to: recipientEmail,
                subject: encodeURIComponent(subject),
                body: encodeURIComponent(body.substring(0, this.MAX_EMAIL_BODY_SIZE))
            };
        }
    
        /**
         * Open email client with exported messages
         * @param {number} limit - Maximum number of messages
         * @param {string} recipientEmail - Optional recipient email address
         */
        exportToEmail(limit = 100, recipientEmail = '') {
            try {
                const Store = window.Store || {};
                const Chat = Store.Chat;
                const activeChat = Chat.getActive ? Chat.getActive() : null;
                
                if (!activeChat) {
                    console.error('No active chat found');
                    return;
                }
    
                const messages = this.extractMessages(activeChat, limit);
                const emailData = this.prepareForEmail(messages, recipientEmail);
                
                const mailtoLink = emailData.to 
                    ? `mailto:${emailData.to}?subject=${emailData.subject}&body=${emailData.body}`
                    : `mailto:?subject=${emailData.subject}&body=${emailData.body}`;
                window.open(mailtoLink, '_blank');
                
            } catch (error) {
                console.error('Error exporting to email:', error);
            }
        }
    }
    
    // Export the class
    window.MessageExporter = MessageExporter;
    

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
            this.notificationEmail = '';
        }
    
        register() {
            super.register();
            this.exporter = new MessageExporter();
            this.loadNotificationEmail();
            this.addExportButton();
            console.log('Export hook registered');
        }
    
        unregister() {
            super.unregister();
            this.removeExportButton();
            console.log('Export hook unregistered');
        }
    
        /**
         * Load notification email from Chrome storage
         */
        async loadNotificationEmail() {
            try {
                const data = await chrome.storage.sync.get('notification_email');
                this.notificationEmail = data.notification_email || '';
                console.log('Notification email loaded:', this.notificationEmail);
            } catch (error) {
                console.error('Error loading notification email:', error);
                this.notificationEmail = '';
            }
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
                this.exporter.exportToEmail(limit, this.notificationEmail);
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
    

    const hooks = {
        keep_revoked_messages: new RenderableMessageHook(),
        keep_edited_messages: new EditMessageHook(),
        indicate_sender_os: new HookRendered(),
        special_tags: new HookSendMessage(),
        blue_ticks: new HookReceipts(),
        export_messages: new HookExport(),
        settings_hook: new SettingsHook()
    };
    
    function handle_settings_update() {
        for (const [setting_name, hook] of Object.entries(hooks)) {
            if (active_settings[setting_name] === false) {
                hook.unregister();
            } else {
                hook.register();
            }
        }
    }
    
    let active_settings = {};
    
    
    window.addEventListener('message', function (event) {
        const message = event.data;
        if (message.settings !== undefined) {
            active_settings = message.settings;
            handle_settings_update();
        }
    });
    
    
    const start = () => {
        initialize_modules();
        for (const [setting_name, hook] of Object.entries(hooks)) {
            if (active_settings[setting_name] !== false) {
                hook.register();
            }
        }
    };
    
    
    console.log('WhatsApp-Plus loaded successfully!');
    // TODO: Solve it the right way. This is a temporary solution.
    const load_and_start = async () => {
        while (Object.values(WA_MODULES).find(m => require(m) === null) !== undefined) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        start();
    };
    setTimeout(load_and_start, 1000);
    
};
if (!window.is_plus_loaded) {
    window.is_plus_loaded = true;
    window.plus_main();
}