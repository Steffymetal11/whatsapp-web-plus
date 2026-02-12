# WhatsApp-Web-Plus

## Features

|                    Feature                    | Availability |
|:---------------------------------------------:|:------------:|
|             Keep revoked messages             |      ✔       |
|             Keep edited messages              |      ✔       |
|              Indicate sender OS               |      ✔       |
|              @everyone, @admins               |      ✔       |
|      See blue ticks without sending them      |      ✔       |
| Forward message to unlimited number of groups |      ✔       |
|       Revoke messages whenever you want       |      ✔       |

## Installing from GitHub

1. To install the extension, download the latest release as a zip file from
   the [Releases](https://github.com/Schwartzblat/WhatsApp-Web-Plus/releases) page
   or [main.zip](https://github.com/Schwartzblat/WhatsApp-Web-Plus/archive/refs/heads/main.zip), or better, just clone
   the source code
   **to a directory**.
2. Go to `chrome://extensions/`.
3. Enable developer mode.
4. Add it to Chrome using the 'Load unpacked extension' option.


## Installing from Chrome Web Store

1. Install the extension from the [WhatsApp-Web-Plus](https://chromewebstore.google.com/detail/whatsapp-web-plus/kgmikiogebpchdgdehpkehgnnnhpdgja).
2. Open [WhatsApp Web](https://web.whatsapp.com/).
3. A payment popup will appear, pay 2$ to activate the extension.
4. Refresh the page and enjoy the features.

## Firebase Setup

This project uses Firebase for authentication and payment tracking. To set up Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `whatsapp-web-plus`
4. Follow the setup wizard to create your project

### 2. Configure Firebase

1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click the Web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "WhatsApp Web Plus Extension")
5. Copy the Firebase configuration object

### 3. Update Firebase Configuration

1. Open `firebaseConfig.js` in the project root
2. Replace the placeholder values with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Deploy to Firebase (Optional)

To deploy the extension files to Firebase Hosting:

```bash
npm run firebase:login  # Login to Firebase
npm run firebase:deploy # Deploy to Firebase Hosting
```

### Firebase Features

- **Authentication**: User login and registration (to be implemented)
- **Firestore**: User subscription and payment tracking (to be implemented)
- **Hosting**: Host extension files and landing page
- **Cloud Functions**: Payment validation and license management (to be implemented)

