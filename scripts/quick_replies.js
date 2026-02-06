class QuickRepliesHook extends Hook {
    constructor() {
        super();
        this.quick_replies = [
            { trigger: 'hello', reply: '👋 Hello! How can I help you?' },
            { trigger: 'thanks', reply: '😊 You\'re welcome!' },
            { trigger: 'yes', reply: '✅ Great!' },
            { trigger: 'no', reply: '👍 Okay, no problem!' },
            { trigger: 'busy', reply: '⏰ Sorry, I\'m busy right now. I\'ll get back to you later!' },
        ];
        this.button_element = null;
    }

    register() {
        if (this.is_registered) {
            return;
        }
        super.register();
        this.inject_quick_reply_button();
    }

    unregister() {
        if (!this.is_registered) {
            return;
        }
        super.unregister();
        if (this.button_element) {
            this.button_element.remove();
            this.button_element = null;
        }
    }

    inject_quick_reply_button() {
        // This function will inject a button into WhatsApp Web's compose area
        // We'll check periodically for the compose area to exist
        const check_interval = setInterval(() => {
            const footer = document.querySelector('footer[class*="copyable-area"]');
            if (footer && !this.button_element) {
                this.button_element = this.create_quick_reply_button();
                footer.appendChild(this.button_element);
                clearInterval(check_interval);
            }
        }, 1000);

        // Clear interval after 30 seconds to avoid infinite checking
        setTimeout(() => clearInterval(check_interval), 30000);
    }

    create_quick_reply_button() {
        const button = document.createElement('button');
        button.innerHTML = '⚡';
        button.title = 'Quick Replies';
        button.style.cssText = `
            position: absolute;
            right: 60px;
            bottom: 10px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #00a884;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            z-index: 1000;
            transition: background 0.2s;
        `;
        button.onmouseover = () => button.style.background = '#008669';
        button.onmouseout = () => button.style.background = '#00a884';
        button.onclick = () => this.show_quick_replies_menu();
        return button;
    }

    show_quick_replies_menu() {
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: absolute;
            right: 60px;
            bottom: 60px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 10px;
            z-index: 1001;
            min-width: 200px;
        `;

        const title = document.createElement('div');
        title.textContent = 'Quick Replies';
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
        `;
        menu.appendChild(title);

        this.quick_replies.forEach(item => {
            const reply_item = document.createElement('div');
            reply_item.textContent = item.reply;
            reply_item.style.cssText = `
                padding: 8px;
                cursor: pointer;
                border-radius: 4px;
                margin: 5px 0;
                transition: background 0.2s;
            `;
            reply_item.onmouseover = () => reply_item.style.background = '#f0f0f0';
            reply_item.onmouseout = () => reply_item.style.background = 'white';
            reply_item.onclick = () => {
                this.insert_reply(item.reply);
                menu.remove();
            };
            menu.appendChild(reply_item);
        });

        // Close button
        const close_btn = document.createElement('button');
        close_btn.textContent = 'Close';
        close_btn.style.cssText = `
            width: 100%;
            padding: 8px;
            margin-top: 10px;
            border: none;
            background: #e0e0e0;
            border-radius: 4px;
            cursor: pointer;
        `;
        close_btn.onclick = () => menu.remove();
        menu.appendChild(close_btn);

        document.body.appendChild(menu);

        // Close menu when clicking outside
        setTimeout(() => {
            const close_on_click_outside = (e) => {
                if (!menu.contains(e.target) && !this.button_element.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', close_on_click_outside);
                }
            };
            document.addEventListener('click', close_on_click_outside);
        }, 100);
    }

    insert_reply(reply_text) {
        // Find the message input box and insert the reply
        const input_box = document.querySelector('div[contenteditable="true"][data-tab="10"]');
        if (input_box) {
            input_box.textContent = reply_text;
            input_box.dispatchEvent(new Event('input', { bubbles: true }));
            input_box.focus();
        }
    }
}
