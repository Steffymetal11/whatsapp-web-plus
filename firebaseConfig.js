// Firebase configuration
// Replace these values with your actual Firebase project configuration
// You can find these values in Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "whatsapp-web-plus.firebaseapp.com",
  projectId: "whatsapp-web-plus",
  storageBucket: "whatsapp-web-plus.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (if Firebase SDK is loaded)
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = firebaseConfig;
}
