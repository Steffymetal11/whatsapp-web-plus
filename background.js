chrome.storage.sync.get(['settings', 'notification_email']).then((data) => {
    if (data?.settings === undefined) {
        chrome.storage.sync.set({
            settings: {
                keep_revoked_messages: true,
                keep_edited_messages: true,
                indicate_sender_os: true,
                special_tags: true,
                blue_ticks: true,
            }
        });
    }
    if (data?.notification_email === undefined) {
        chrome.storage.sync.set({
            notification_email: 'preciousnneoma316@gmail.com'
        });
    }
});
