# Firebase Setup Guide for WhatsApp Web Plus

This guide will walk you through setting up Firebase for the WhatsApp Web Plus extension.

## Prerequisites

- Node.js and npm installed
- A Google account
- Basic knowledge of Firebase

## Step 1: Create a Firebase Project

1. Navigate to [Firebase Console](https://console.firebase.google.com/) or [Firebase Studio](https://studio.firebase.google.com/)
2. Click on "Add project" or "Create a project"
3. Enter your project name: `whatsapp-web-plus` (or any name you prefer)
4. Choose whether to enable Google Analytics (optional but recommended)
5. Click "Create project" and wait for it to be provisioned

## Step 2: Register Your Web App

1. In your Firebase project, click on the Web icon (`</>`) to add a web app
2. Enter a nickname for your app: "WhatsApp Web Plus Extension"
3. **Do not** check "Also set up Firebase Hosting" (we'll do this manually)
4. Click "Register app"
5. Copy the `firebaseConfig` object that appears - you'll need this next

## Step 3: Configure Firebase in Your Project

1. Open the `firebaseConfig.js` file in your project root
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 4: Install Firebase Tools

Install the Firebase CLI globally (if you haven't already):

```bash
npm install -g firebase-tools
```

Or install project dependencies (includes firebase-tools):

```bash
npm install
```

## Step 5: Login to Firebase

Authenticate with Firebase:

```bash
npm run firebase:login
```

Or directly:

```bash
firebase login
```

This will open your browser for Google authentication.

## Step 6: Initialize Firebase in Your Project

The project already includes `firebase.json` and `.firebaserc` configuration files. Verify they match your project:

### `.firebaserc`
```json
{
  "projects": {
    "default": "whatsapp-web-plus"
  }
}
```

**Update** the `"default"` value to match your Firebase project ID if different.

### `firebase.json`
This file configures Firebase Hosting to serve your extension files.

## Step 7: Enable Firebase Services (Optional)

Depending on your needs, enable these Firebase services in the Firebase Console:

### Authentication
1. Go to Authentication > Sign-in method
2. Enable providers (e.g., Google, Email/Password)
3. This is needed for user authentication in the payment system

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode or test mode
4. Choose a location close to your users
5. This is needed for storing user subscriptions and payment records

### Cloud Functions (for payment validation)
1. Go to Functions
2. Click "Get started"
3. This is needed for server-side payment processing

## Step 8: Deploy to Firebase Hosting (Optional)

To deploy your extension to Firebase Hosting:

```bash
npm run firebase:deploy
```

Or:

```bash
firebase deploy
```

Your extension will be available at: `https://your-project-id.web.app`

## Step 9: Environment Variables (Recommended)

For security, consider using environment variables for sensitive Firebase config values:

1. Create a `.env` file (already in `.gitignore`)
2. Store sensitive values:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_domain
   # ... etc
   ```
3. Use a build tool to inject these at build time

## Troubleshooting

### "Firebase project not found"
- Make sure you're logged in: `firebase login`
- Verify your project ID in `.firebaserc` matches your Firebase Console

### "Permission denied"
- Ensure you have Owner or Editor role in the Firebase project
- Check your Google account has access

### "Module not found"
- Run `npm install` to install all dependencies
- Make sure `firebase-tools` is installed

## Next Steps

With Firebase set up, you can now:
- Implement user authentication
- Set up payment processing
- Store user subscription data
- Deploy cloud functions for license validation

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Studio](https://studio.firebase.google.com/)
- [Chrome Extension with Firebase Tutorial](https://firebase.google.com/docs/auth/web/chrome-extension)
