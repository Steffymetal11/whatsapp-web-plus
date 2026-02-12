# Quick Usage Guide

This guide provides quick copy-paste commands to get started with SMS-to-WhatsApp forwarding.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Method 1: Webhook Server (Recommended)](#method-1-webhook-server-recommended)
- [Method 2: Twilio Bridge](#method-2-twilio-bridge)
- [Method 3: Android Python Script](#method-3-android-python-script)
- [Method 4: Tasker Configuration](#method-4-tasker-configuration)
- [Testing](#testing)

## Prerequisites

Make sure you have the necessary tools installed:

```bash
# Check Node.js installation
node --version  # Should be >= 14.0.0

# Check npm installation
npm --version

# Check Python installation (for Android script)
python3 --version  # Should be >= 3.6
```

## Method 1: Webhook Server (Recommended)

This is the easiest method for receiving SMS via webhooks and forwarding to WhatsApp.

### Quick Start

```bash
# Navigate to examples directory
cd examples

# Run quick setup script (interactive)
./quick-setup.sh

# Or set up manually:
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env

# 3. Edit .env with your settings
nano .env

# 4. Start the server
npm start
```

### Configuration

Edit your `.env` file:

```env
PORT=3000
WHATSAPP_TARGET=1234567890
API_KEY=your_secure_random_key_here
```

### Test the Server

```bash
# Health check
curl http://localhost:3000/health

# Send test message
curl -X POST http://localhost:3000/test \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json"

# Simulate incoming SMS
curl -X POST http://localhost:3000/webhook \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+1234567890",
    "message": "Your verification code is: 123456"
  }'
```

### Run in Background (Production)

```bash
# Using nohup
nohup node webhook-server.js > server.log 2>&1 &

# Or using PM2 (recommended)
npm install -g pm2
pm2 start webhook-server.js --name sms-forwarder
pm2 logs sms-forwarder
pm2 save
pm2 startup
```

## Method 2: Twilio Bridge

Use this if you have a Twilio account and want to receive SMS to a Twilio number.

### Quick Start

```bash
cd examples

# Install dependencies
npm install

# Set environment variables
export TWILIO_AUTH_TOKEN="your_twilio_auth_token"
export WHATSAPP_TARGET="1234567890"

# Run the server
node twilio-whatsapp-bridge.js
```

### Twilio Configuration

1. Log in to [Twilio Console](https://console.twilio.com/)
2. Go to Phone Numbers → Manage → Active Numbers
3. Select your number
4. Scroll to "Messaging"
5. Set webhook URL: `http://your-server:3000/sms-webhook`
6. Save

### Test with Twilio

```bash
# Send test SMS via Twilio CLI
twilio api:core:messages:create \
  --from "+your_twilio_number" \
  --to "+your_phone_number" \
  --body "Test code: 654321"
```

## Method 3: Android Python Script

Run directly on your Android phone using Termux.

### Quick Start

```bash
# On Android, in Termux:

# 1. Install prerequisites
pkg install python termux-api
pip install requests

# 2. Download the script
curl -O https://raw.githubusercontent.com/Steffymetal11/whatsapp-web-plus/main/examples/android-sms-forwarder.py

# 3. Edit configuration
nano android-sms-forwarder.py
# Update the CONFIG section with your settings

# 4. Run the forwarder
python android-sms-forwarder.py
```

### Configuration Options

Edit the `CONFIG` dictionary in the script:

```python
CONFIG = {
    'method': 'webhook',  # or 'whatsapp_intent'
    'webhook_url': 'https://your-server.com/webhook',
    'webhook_api_key': 'your_api_key',
    'whatsapp_target': '+1234567890',
    'filter_enabled': True,
    'poll_interval': 5,
}
```

### Run in Background

```bash
# Run in background
nohup python android-sms-forwarder.py > sms-forwarder.log 2>&1 &

# Check if running
ps aux | grep android-sms-forwarder

# View logs
tail -f sms-forwarder.log
```

### Auto-Start on Boot

```bash
# Create boot script
mkdir -p ~/.termux/boot

cat > ~/.termux/boot/start-sms-forwarder.sh << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd $HOME
python android-sms-forwarder.py &
EOF

chmod +x ~/.termux/boot/start-sms-forwarder.sh

# Enable boot service
pkg install termux-services
sv-enable sshd
```

## Method 4: Tasker Configuration

Use Tasker app on Android for automatic forwarding.

### Quick Start

1. Install Tasker from Google Play Store ($3.49)
2. Open Tasker
3. Tap menu → Data → Restore
4. Select `tasker-sms-forward.xml`
5. Edit the task:
   - Open "Forward SMS to WhatsApp" task
   - Find the "Set Variable" action for `%WhatsAppNumber`
   - Change to your WhatsApp number (e.g., +1234567890)
6. Enable the profile
7. Test by sending yourself an SMS

### Manual Tasker Setup

If you prefer to set up manually:

1. **Create Profile:**
   - Event → Phone → Received Text
   - Leave sender blank (or specify)

2. **Create Task:**
   - Action → Variables → Set → `%WhatsAppNumber` = `+1234567890`
   - Action → Variables → Set → `%MessageText` = `SMS from %SMSRF: %SMSRB`
   - Action → System → Send Intent
     - Action: `android.intent.action.SENDTO`
     - Data: `smsto:%WhatsAppNumber`
     - Extra: `sms_body:%MessageText`
     - Package: `com.whatsapp`

3. **Test:**
   - Send SMS to your phone
   - Verify it opens WhatsApp with the message

## Testing

### Test Webhook Endpoints

```bash
# Generic webhook
curl -X POST http://localhost:3000/webhook \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"from":"+1234567890","message":"Test 123"}'

# IFTTT format
curl -X POST http://localhost:3000/ifttt \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"From":"+1234567890","Text":"Test 123"}'

# Zapier format
curl -X POST http://localhost:3000/zapier \
  -H "X-API-Key: your_key" \
  -H "Content-Type: application/json" \
  -d '{"from":"+1234567890","message":"Test 123"}'
```

### Test WhatsApp Connection

When you start the webhook server, it will show a QR code. Scan it with WhatsApp:

1. Open WhatsApp on your phone
2. Go to Settings → Linked Devices
3. Tap "Link a Device"
4. Scan the QR code shown in the terminal

### Verify SMS Forwarding

1. Send a test SMS to your forwarding phone:
   ```
   Your verification code is: 123456
   ```

2. Check the logs:
   ```bash
   # For webhook server
   tail -f /path/to/logs
   
   # For Python script
   tail -f sms-forwarder.log
   
   # For PM2
   pm2 logs sms-forwarder
   ```

3. Check WhatsApp on your target device for the forwarded message

## Troubleshooting

### Webhook Server Not Starting

```bash
# Check if port is in use
lsof -i :3000

# Kill process using the port
kill -9 $(lsof -t -i:3000)

# Or use a different port
PORT=3001 node webhook-server.js
```

### WhatsApp Not Connecting

```bash
# Clear WhatsApp Web session
rm -rf .wwebjs_auth/

# Restart server and scan QR code again
node webhook-server.js
```

### SMS Not Being Forwarded

```bash
# Check Termux:API permissions
termux-sms-list -l 1

# Check if webhook is accessible
curl http://your-server-ip:3000/health

# Check logs for errors
tail -f sms-forwarder.log
```

### Phone Number Format Issues

Ensure phone numbers are in the correct format:
- Include country code
- Remove spaces and special characters
- Example: `1234567890` (not `+1 (234) 567-890`)

## Security Checklist

Before deploying to production:

- [ ] Change default API key to a strong, random value
- [ ] Enable HTTPS (use Let's Encrypt or similar)
- [ ] Configure firewall to restrict access
- [ ] Set up rate limiting
- [ ] Enable authentication on all endpoints
- [ ] Don't log sensitive SMS content
- [ ] Keep dependencies updated
- [ ] Monitor for unusual activity
- [ ] Backup configuration files
- [ ] Review privacy compliance (GDPR, etc.)

## Integration with Other Services

### IFTTT

1. Create IFTTT account
2. Create new applet:
   - **IF**: Android SMS → New SMS received
   - **THEN**: Webhooks → Make a web request
   - URL: `http://your-server:3000/ifttt`
   - Method: POST
   - Content Type: application/json
   - Body: `{"From":"{{From}}","Text":"{{Text}}"}`
3. Add header: `X-API-Key: your_api_key`

### Zapier

1. Create Zapier account
2. Create new Zap:
   - **Trigger**: SMS by Zapier → New Inbound SMS
   - **Action**: Webhooks → POST
   - URL: `http://your-server:3000/zapier`
   - Payload: Map SMS fields
   - Headers: `X-API-Key: your_api_key`

## Support

For more detailed information, see:
- [SMS Forwarding Guide](../SMS_FORWARDING_GUIDE.md) - Complete guide with all methods
- [Examples README](README.md) - Detailed example documentation
- [Main README](../README.md) - Project overview

## License

These examples are provided for educational purposes. Ensure compliance with all applicable terms of service and laws.
