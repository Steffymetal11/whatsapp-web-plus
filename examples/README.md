# SMS Forwarding Examples

This directory contains working examples for forwarding SMS messages to WhatsApp using various methods.

## Available Examples

### 1. Tasker Configuration (`tasker-sms-forward.xml`)
Import this XML file into Tasker (Android automation app) to automatically forward SMS to WhatsApp.

**How to use:**
1. Install Tasker from Google Play Store
2. Open Tasker → Import → Select this XML file
3. Edit the task to set your WhatsApp number
4. Enable the profile
5. Test by sending yourself an SMS

### 2. Twilio Bridge Server (`twilio-whatsapp-bridge.js`)
Node.js server that receives SMS via Twilio and forwards to WhatsApp.

**How to run:**
```bash
# Install dependencies
npm install

# Set environment variables
export TWILIO_AUTH_TOKEN="your_token"
export WHATSAPP_TARGET="1234567890"

# Run the server
node twilio-whatsapp-bridge.js
```

**Setup:**
1. Create Twilio account
2. Purchase a phone number
3. Set webhook URL to your server
4. Run this script on a publicly accessible server

### 3. Generic Webhook Server (`webhook-server.js`)
Universal webhook server compatible with IFTTT, Zapier, and custom integrations.

**How to run:**
```bash
# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
WHATSAPP_TARGET=1234567890
API_KEY=your_secure_api_key
EOF

# Run the server
node webhook-server.js
```

**Endpoints:**
- `POST /webhook` - Generic endpoint
- `POST /ifttt` - IFTTT-specific format
- `POST /zapier` - Zapier-specific format
- `GET /health` - Server health check
- `POST /test` - Send test message

**Test the webhook:**
```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_api_key" \
  -d '{
    "from": "+1234567890",
    "message": "Test verification code: 123456"
  }'
```

### 4. Android SMS Forwarder (`android-sms-forwarder.py`)
Python script that runs on Android via Termux to monitor and forward SMS.

**How to run:**
```bash
# Prerequisites (in Termux)
pkg install python termux-api
pip install requests

# Edit configuration in the script
nano android-sms-forwarder.py
# Update CONFIG section with your settings

# Run the forwarder
python android-sms-forwarder.py

# Or run in background
nohup python android-sms-forwarder.py &
```

**Auto-start on boot:**
```bash
mkdir -p ~/.termux/boot
cat > ~/.termux/boot/start-sms-forwarder.sh << EOF
#!/data/data/com.termux/files/usr/bin/bash
python /path/to/android-sms-forwarder.py &
EOF
chmod +x ~/.termux/boot/start-sms-forwarder.sh
```

## Dependencies Installation

For Node.js examples (twilio-whatsapp-bridge.js and webhook-server.js):

```bash
npm install express body-parser twilio whatsapp-web.js qrcode-terminal dotenv
```

Or use the provided package.json:

```bash
npm install
```

For Python example (android-sms-forwarder.py):

```bash
# In Termux
pkg install python termux-api
pip install requests
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Keys**: Always use strong, unique API keys
2. **HTTPS**: Use HTTPS in production (Let's Encrypt is free)
3. **Firewall**: Restrict access to webhook endpoints
4. **Authentication**: Enable authentication on all webhook endpoints
5. **Rate Limiting**: Implement rate limiting to prevent abuse
6. **Logging**: Be careful with logging sensitive SMS content
7. **Compliance**: Ensure compliance with privacy laws (GDPR, etc.)

## Troubleshooting

### WhatsApp Not Connecting

**Problem**: QR code not appearing or WhatsApp not connecting

**Solutions:**
1. Ensure whatsapp-web.js is up to date: `npm update whatsapp-web.js`
2. Clear WhatsApp Web session: Delete `.wwebjs_auth` folder
3. Check if port 3000 is available
4. Try running with `--no-sandbox` flag (already included)

### SMS Not Being Received

**Problem**: Webhook not receiving SMS data

**Solutions:**
1. Check if server is publicly accessible
2. Verify webhook URL in Twilio/IFTTT/Zapier
3. Check server logs for errors
4. Test with curl command (see examples above)

### Messages Not Forwarding

**Problem**: SMS received but not forwarded to WhatsApp

**Solutions:**
1. Verify WhatsApp number format (must include country code)
2. Check if WhatsApp client is authenticated
3. Review logs for error messages
4. Test with `/test` endpoint

## Production Deployment

### Using PM2 (Node.js Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start the server
pm2 start webhook-server.js --name "sms-forwarder"

# View logs
pm2 logs sms-forwarder

# Auto-start on reboot
pm2 startup
pm2 save
```

### Using Docker

```bash
# Build Docker image
docker build -t sms-forwarder .

# Run container
docker run -d \
  -p 3000:3000 \
  -e WHATSAPP_TARGET="1234567890" \
  -e API_KEY="your_secure_key" \
  --name sms-forwarder \
  sms-forwarder
```

### Using systemd (Linux)

```bash
# Create service file
sudo nano /etc/systemd/system/sms-forwarder.service

# Add content (see systemd example in docs)

# Enable and start
sudo systemctl enable sms-forwarder
sudo systemctl start sms-forwarder
```

## Testing

### Test Twilio Integration

```bash
# Send test SMS via Twilio API
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json \
  --data-urlencode "From=+1234567890" \
  --data-urlencode "To=YOUR_TWILIO_NUMBER" \
  --data-urlencode "Body=Test message 123456" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN
```

### Test Webhook Server

```bash
# Health check
curl http://localhost:3000/health

# Send test message
curl -X POST http://localhost:3000/test \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json"

# Simulate IFTTT webhook
curl -X POST http://localhost:3000/ifttt \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"From":"+1234567890","Text":"Test code: 654321"}'
```

### Test Android Forwarder

```bash
# In Termux, test SMS retrieval
termux-sms-list -l 1 -t inbox

# Run forwarder with verbose logging
python android-sms-forwarder.py
```

## Support

For issues or questions:
1. Check the main [SMS_FORWARDING_GUIDE.md](../SMS_FORWARDING_GUIDE.md)
2. Review the [repository issues](https://github.com/Steffymetal11/whatsapp-web-plus/issues)
3. Check the [Troubleshooting](#troubleshooting) section above

## License

These examples are provided as-is for educational purposes. Use at your own risk and ensure compliance with all applicable terms of service and laws.
