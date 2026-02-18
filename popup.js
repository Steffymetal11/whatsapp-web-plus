const settings_toggles = {
    'keep_revoked_messages': 'Keep revoked messages',
    'keep_edited_messages': 'Keep edited messages',
    'indicate_sender_os': 'Indicate sender OS',
    'special_tags': 'Special tags',
    'blue_ticks': 'Send blue ticks',
    'export_messages': 'Export messages',
};

let active_settings = Object.fromEntries(Object.keys(settings_toggles).map(key => [key, true]));
let notification_email = '';

const on_toggle = async (event) => {
    active_settings[event.target.id] = event.target.checked;
    chrome.storage.sync.set({settings: active_settings});
};

const add_setting_toggle = (setting_key, title) => {
    const item = document.createElement('div');
    item.setAttribute('class', 'setting-item');

    const label = document.createElement('label');
    label.setAttribute('for', setting_key);
    label.textContent = title;
    item.appendChild(label);

    const toggle_switch = document.createElement('div');
    toggle_switch.setAttribute('class', 'toggle-switch');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('id', setting_key);
    input.addEventListener('change', on_toggle);
    input.checked = active_settings[setting_key];
    toggle_switch.appendChild(input);

    const toggle_label = document.createElement('label');
    toggle_label.setAttribute('for', setting_key);
    toggle_label.setAttribute('class', 'switch-label');
    toggle_switch.appendChild(toggle_label);

    item.appendChild(toggle_switch);
    return item;
};


const settings_section = document.getElementById('settings_section');
const email_input = document.getElementById('notification_email');

// Load settings and email
chrome.storage.sync.get(['settings', 'notification_email']).then(data => {
    active_settings = data.settings;
    notification_email = data.notification_email || '';
    
    // Set email input value
    if (email_input) {
        email_input.value = notification_email;
    }
    
    // Add toggle settings
    for (const [setting_key, title] of Object.entries(settings_toggles)) {
        const item = add_setting_toggle(setting_key, title);
        settings_section.appendChild(item);
    }
});

// Handle email input changes
if (email_input) {
    email_input.addEventListener('blur', async () => {
        notification_email = email_input.value.trim();
        await chrome.storage.sync.set({notification_email: notification_email});
        console.log('Notification email saved:', notification_email);
    });
    
    email_input.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            notification_email = email_input.value.trim();
            await chrome.storage.sync.set({notification_email: notification_email});
            console.log('Notification email saved:', notification_email);
            email_input.blur();
        }
    });
}
