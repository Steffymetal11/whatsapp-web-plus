# SMS to WhatsApp Forwarding Guide

## Overview

This guide provides multiple methods to automatically forward SMS messages (especially verification codes) from one phone to WhatsApp on another device or messaging service. This is particularly useful when you need to receive verification codes sent to a secondary phone.

## Use Cases

- Forward verification codes from a secondary phone to your main WhatsApp
- Automatically redirect SMS messages to WhatsApp groups or contacts
- Bridge SMS and WhatsApp communication for business purposes
- Backup SMS messages to WhatsApp for record-keeping

## Prerequisites

Before setting up SMS forwarding, ensure you have:

- A phone with SMS receiving capability (Android recommended)
- An active WhatsApp account
- Internet connectivity on the SMS-receiving device
- Appropriate permissions on the device

## Method 1: Android Automation with Tasker (Recommended)

### Requirements
- Android device (receiving SMS)
- Tasker app (paid) or MacroDroid (free alternative)
- WhatsApp installed on the forwarding phone or target device

### Setup Steps

#### Using Tasker

1. **Install Tasker**
   - Download from Google Play Store
   - Grant necessary permissions (SMS, Notifications, Accessibility)

2. **Create a New Profile**
   - Open Tasker
   - Tap the "+" button to create a new profile
   - Select "Event" → "Phone" → "Received Text"
   - Leave fields blank to capture all SMS (or filter by sender)

3. **Create the Task**
   - Name it "Forward to WhatsApp"
   - Add Action: "Plugin" → "AutoNotification" → "Intercept"
   - Configure to detect SMS notifications

4. **Configure WhatsApp Sending**
   - Add Action: "Plugin" → "WhatsTasker" or use HTTP request
   - Set recipient phone number (with country code)
   - Set message text: "SMS from %SMSRF: %SMSRB"
     - %SMSRF = sender's name/number
     - %SMSRB = message body

5. **Alternative: Use HTTP Webhook**
   ```
   Action: HTTP Request
   Method: POST
   URL: YOUR_WEBHOOK_URL (see Method 3)
   Body: {"from": "%SMSRF", "message": "%SMSRB"}
   ```

6. **Test the Configuration**
   - Send a test SMS to your device
   - Verify it's forwarded to WhatsApp

#### Using MacroDroid (Free Alternative)

1. **Install MacroDroid**
   - Download from Google Play Store
   - Grant SMS and notification permissions

2. **Create a New Macro**
   - Tap "+" to add a macro
   - **Trigger**: "SMS Received" (Any contact or specific)
   - **Action**: "Send Intent"
   - Configure intent to send to WhatsApp:
     ```
     Action: android.intent.action.SENDTO
     Data: smsto:{PHONE_NUMBER}
     Extra: sms_body={SMS_FROM}: {SMS_MESSAGE}
     ```

3. **Test and Enable**
   - Send test SMS
   - Verify forwarding works
   - Enable the macro

### Example Tasker Export

See the [examples/tasker-sms-forward.xml](examples/tasker-sms-forward.xml) file for a complete Tasker configuration you can import.

## Method 2: Cloud-Based SMS Gateway (Twilio + Custom Script)

### Requirements
- Twilio account (or similar SMS gateway service)
- Server or computer to run the forwarding script
- WhatsApp Business API account (or unofficial WhatsApp Web API)

### Setup Steps

1. **Set Up Twilio**
   - Create account at [twilio.com](https://www.twilio.com)
   - Purchase a phone number
   - Configure webhook for incoming messages

2. **Deploy Forwarding Script**
   
   See [examples/twilio-whatsapp-bridge.js](examples/twilio-whatsapp-bridge.js) for a complete Node.js implementation.

3. **Configure Webhook**
   - In Twilio console, set webhook URL to your server
   - Method: POST
   - URL: `https://your-server.com/sms-webhook`

4. **Forward SMS to Your Twilio Number**
   - Use call forwarding on your phone
   - Or port your number to Twilio

## Method 3: IFTTT / Zapier Integration

### Using IFTTT

1. **Create IFTTT Account**
   - Sign up at [ifttt.com](https://ifttt.com)

2. **Create New Applet**
   - **IF**: Android SMS → New SMS received (any/specific sender)
   - **THEN**: Webhooks → Make a web request

3. **Configure Webhook**
   - URL: Your webhook server endpoint
   - Method: POST
   - Content Type: application/json
   - Body: 
   ```json
   {
     "from": "{{From}}",
     "message": "{{Text}}",
     "timestamp": "{{OccurredAt}}"
   }
   ```

4. **Set Up Webhook Server**
   
   See [examples/webhook-server.js](examples/webhook-server.js) for implementation.

### Using Zapier

1. **Create Zapier Account**
   - Sign up at [zapier.com](https://zapier.com)

2. **Create New Zap**
   - **Trigger**: SMS by Zapier → New Inbound SMS
   - **Action**: Webhooks → POST

3. **Configure Action**
   - Similar to IFTTT configuration above

## Method 4: Direct Android SMS Forwarder Apps

### Recommended Apps

1. **SMS Forwarder**
   - Free, open-source
   - Available on F-Droid and Play Store
   - Features: Filter rules, multiple destinations

2. **SMS Auto Forward**
   - Simple interface
   - Supports WhatsApp integration
   - Available on Play Store

### Configuration

1. Install the app
2. Grant SMS and notification permissions
3. Add forwarding rule:
   - Source: Any or specific contacts
   - Destination: WhatsApp number (format: +1234567890)
   - Template: "SMS from {SENDER}: {MESSAGE}"
4. Enable the rule
5. Test with a sample SMS

## Method 5: Python Script for Android (Termux)

For advanced users, you can run a Python script directly on Android using Termux.

### Requirements
- Android device
- Termux app (from F-Droid)
- Termux:API app
- Python installed in Termux

### Setup

1. **Install Termux and Termux:API**
   ```bash
   # In Termux
   pkg update && pkg upgrade
   pkg install python termux-api
   pip install requests
   ```

2. **Create Forwarding Script**
   
   See [examples/android-sms-forwarder.py](examples/android-sms-forwarder.py) for implementation.

3. **Run as Background Service**
   ```bash
   nohup python android-sms-forwarder.py &
   ```

4. **Auto-Start on Boot**
   ```bash
   # Create a boot script
   mkdir -p ~/.termux/boot
   echo "python /path/to/android-sms-forwarder.py" > ~/.termux/boot/start-sms-forward.sh
   chmod +x ~/.termux/boot/start-sms-forward.sh
   ```

## Security Considerations

### Important Warnings

⚠️ **Privacy**: SMS messages may contain sensitive information. Ensure your forwarding method is secure.

⚠️ **Encryption**: Use HTTPS for all webhook communications.

⚠️ **Access Control**: Restrict access to your forwarding servers/webhooks.

⚠️ **Rate Limiting**: Implement rate limiting to prevent abuse.

⚠️ **Logging**: Be careful with logging SMS content.

### Best Practices

1. **Use Authentication**
   - Add API keys or tokens to webhook requests
   - Verify sender identity

2. **Encrypt Data in Transit**
   - Always use HTTPS/TLS
   - Consider end-to-end encryption for sensitive data

3. **Minimize Data Retention**
   - Don't store SMS content longer than necessary
   - Implement automatic deletion

4. **Test Thoroughly**
   - Test with non-sensitive messages first
   - Verify delivery reliability

5. **Monitor Activity**
   - Set up alerts for forwarding failures
   - Monitor for unusual activity

## Troubleshooting

### SMS Not Being Forwarded

1. **Check Permissions**
   - Ensure app has SMS read permission
   - Check notification access (if using)

2. **Verify Automation**
   - Test the trigger manually
   - Check automation app logs

3. **Network Issues**
   - Ensure device has internet connectivity
   - Verify webhook URL is accessible

### WhatsApp Not Receiving Messages

1. **Phone Number Format**
   - Use international format: +[country code][number]
   - Example: +12125551234 (not 212-555-1234)

2. **WhatsApp Web API Issues**
   - Check if you're logged into WhatsApp Web
   - Verify API credentials if using WhatsApp Business API

3. **Rate Limiting**
   - WhatsApp may block if you send too many messages
   - Implement delays between messages

### Webhook Errors

1. **Check Server Logs**
   - Review error messages
   - Verify request format

2. **Test Webhook Manually**
   ```bash
   curl -X POST https://your-server.com/webhook \
     -H "Content-Type: application/json" \
     -d '{"from":"test","message":"test message"}'
   ```

3. **Verify SSL Certificate**
   - Ensure HTTPS is properly configured
   - Check certificate validity

## Advanced Configurations

### Filtering Verification Codes

To forward only verification codes (not all SMS):

**Tasker Filter Example:**
```
IF %SMSRB ~R .*\d{4,6}.*
  OR %SMSRB ~ *verification*
  OR %SMSRB ~ *code*
THEN
  [Forward to WhatsApp]
END IF
```

**Python Filter Example:**
```python
import re

def is_verification_code(message):
    # Look for 4-6 digit codes
    if re.search(r'\b\d{4,6}\b', message):
        return True
    # Look for keywords
    keywords = ['verification', 'code', 'OTP', 'PIN', 'verify']
    return any(keyword.lower() in message.lower() for keyword in keywords)
```

### Multiple Destinations

Forward to multiple WhatsApp numbers or services:

```python
DESTINATIONS = [
    {"type": "whatsapp", "number": "+1234567890"},
    {"type": "telegram", "chat_id": "123456"},
    {"type": "email", "address": "user@example.com"}
]
```

### Custom Message Templates

Create formatted messages:

```
📱 SMS Received
━━━━━━━━━━━━━━
From: {SENDER}
Time: {TIMESTAMP}
━━━━━━━━━━━━━━
{MESSAGE}
```

## Example Scenarios

### Scenario 1: Two-Factor Authentication Codes

**Problem**: You need 2FA codes from a secondary phone.

**Solution**: Use Method 1 (Tasker) with filtering:
- Filter: Only forward messages containing digits
- Recipient: Your primary WhatsApp
- Template: "2FA Code: {MESSAGE}"

### Scenario 2: Business SMS to WhatsApp Group

**Problem**: Forward business SMS to a team WhatsApp group.

**Solution**: Use Method 2 (Cloud Gateway):
- Set up Twilio number for business
- Deploy webhook server
- Configure to send to WhatsApp group ID

### Scenario 3: Temporary Phone Number

**Problem**: You have a temporary SIM for verifications.

**Solution**: Use Method 4 (SMS Forwarder App):
- Install app on phone with temp SIM
- Set forwarding to permanent WhatsApp
- Remove SIM after verification period

## Support and Resources

### Official Documentation
- [Tasker User Guide](https://tasker.joaoapps.com/userguide/en/)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

### Community Resources
- [r/Tasker](https://reddit.com/r/tasker) - Tasker community
- Stack Overflow - Search for specific integration questions

### Example Code Repository
All example scripts mentioned in this guide are available in the `examples/` directory of this repository.

## Legal and Terms of Service

**Important**: Ensure your use complies with:
- WhatsApp Terms of Service
- Local telecommunications regulations
- Privacy laws (GDPR, CCPA, etc.)
- Your mobile carrier's terms

**Disclaimer**: This guide is for educational purposes. Users are responsible for their own implementations and compliance with applicable laws and terms of service.

## Contributing

Found a better method? Have improvements? Please contribute:
1. Fork the repository
2. Add your method/improvement
3. Submit a pull request
4. Include working examples and documentation

## Changelog

- **v1.0.0** (2024): Initial guide with 5 methods
  - Android Automation (Tasker/MacroDroid)
  - Cloud SMS Gateway (Twilio)
  - IFTTT/Zapier Integration
  - SMS Forwarder Apps
  - Python Script (Termux)
