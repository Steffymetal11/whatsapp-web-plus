// Firebase configuration for WhatsApp Web Plus Extension
// Replace these values with your actual Firebase project configuration
// You can find these values in Firebase Console > Project Settings > General > Your apps

// Note: This configuration is designed for Firebase SDK v9+ with compat mode
// If using the modular SDK, import like: import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'whatsapp-web-plus.firebaseapp.com',
    projectId: 'whatsapp-web-plus',
    storageBucket: 'whatsapp-web-plus.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
};

// For browser environment with Firebase compat library
// Requires: <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
if (typeof firebase !== 'undefined' && firebase.initializeApp) {
    firebase.initializeApp(firebaseConfig);
}

// Export for use in Node.js/CommonJS modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}

