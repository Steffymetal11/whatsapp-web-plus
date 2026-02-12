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
|    Export messages to email and files         |      ✔       |
|    SMS to WhatsApp forwarding (guide)         |      ✔       |

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

## Export Messages Feature

The extension now includes a powerful message export feature! You can export your WhatsApp conversations to:
- **Multiple formats**: JSON, Text, and HTML
- **Email**: Quick sharing via your email client
- **Local files**: Download backups to your computer

For detailed instructions, see the [Export Guide](EXPORT_GUIDE.md).

### Quick Start for Export
1. Enable "Export messages" in the extension settings
2. Open any chat in WhatsApp Web
3. Click the **📤 Export** button in the chat header
4. Choose your format and options
5. Download or email your chat history!

## SMS to WhatsApp Forwarding

Want to automatically forward SMS messages (like verification codes) from one phone to WhatsApp? We've got you covered!

The repository now includes a comprehensive guide with multiple methods to set up SMS-to-WhatsApp forwarding:
- 📱 **Android Automation** (Tasker, MacroDroid)
- ☁️ **Cloud Gateways** (Twilio)
- 🔗 **Integration Services** (IFTTT, Zapier)
- 📱 **SMS Forwarder Apps**
- 🐍 **Python Scripts** (Termux)

For detailed setup instructions and working examples, see the [SMS Forwarding Guide](SMS_FORWARDING_GUIDE.md).

### Quick Start for SMS Forwarding
1. Choose your preferred method from the guide
2. Check the [examples directory](examples/) for ready-to-use scripts
3. Follow the setup instructions for your chosen method
4. Test with a sample SMS to ensure it works
5. Start receiving verification codes on WhatsApp!
