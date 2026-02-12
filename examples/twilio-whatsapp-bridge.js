#!/usr/bin/env node

/**
 * Twilio to WhatsApp Bridge
 * 
 * This script receives SMS messages via Twilio webhook and forwards them to WhatsApp.
 * It uses the unofficial whatsapp-web.js library.
 * 
 * Prerequisites:
 * - npm install express body-parser twilio whatsapp-web.js qrcode-terminal
 * - Set up Twilio account and webhook
 * - Run this script on a server accessible from the internet
 */

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configuration
const PORT = process.env.PORT || 3000;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token';
const WHATSAPP_TARGET_NUMBER = process.env.WHATSAPP_TARGET || '1234567890'; // Without '+'

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize WhatsApp Client
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// WhatsApp client events
whatsappClient.on('qr', (qr) => {
    console.log('QR Code received, scan with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

whatsappClient.on('authenticated', () => {
    console.log('WhatsApp authenticated successfully');
});

whatsappClient.on('auth_failure', (msg) => {
    console.error('WhatsApp authentication failed:', msg);
});

// Initialize WhatsApp client
whatsappClient.initialize();

/**
 * Format phone number for WhatsApp
 * @param {string} number - Phone number
 * @returns {string} Formatted number with @c.us suffix
 */
function formatWhatsAppNumber(number) {
    // Remove any non-digit characters
    const cleaned = number.replace(/\D/g, '');
    return `${cleaned}@c.us`;
}

/**
 * Send message to WhatsApp
 * @param {string} targetNumber - WhatsApp number to send to
 * @param {string} message - Message content
 */
async function sendToWhatsApp(targetNumber, message) {
    try {
        const chatId = formatWhatsAppNumber(targetNumber);
        await whatsappClient.sendMessage(chatId, message);
        console.log(`Message sent to ${targetNumber}`);
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return false;
    }
}

/**
 * Webhook endpoint for Twilio SMS
 */
app.post('/sms-webhook', async (req, res) => {
    console.log('Received SMS webhook:', req.body);

    // Validate Twilio signature (optional but recommended)
    const twilioSignature = req.headers['x-twilio-signature'];
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    
    if (TWILIO_AUTH_TOKEN !== 'your_twilio_auth_token') {
        const isValid = twilio.validateRequest(
            TWILIO_AUTH_TOKEN,
            twilioSignature,
            url,
            req.body
        );

        if (!isValid) {
            console.error('Invalid Twilio signature');
            return res.status(403).send('Forbidden');
        }
    }

    // Extract SMS data
    const from = req.body.From || 'Unknown';
    const body = req.body.Body || '';
    const timestamp = new Date().toISOString();

    // Format message for WhatsApp
    const whatsappMessage = `📱 SMS Received
━━━━━━━━━━━━━━
From: ${from}
Time: ${timestamp}
━━━━━━━━━━━━━━
${body}`;

    // Send to WhatsApp
    const success = await sendToWhatsApp(WHATSAPP_TARGET_NUMBER, whatsappMessage);

    // Respond to Twilio
    const twiml = new twilio.twiml.MessagingResponse();
    
    if (success) {
        twiml.message('SMS forwarded to WhatsApp successfully');
    } else {
        twiml.message('Error forwarding SMS to WhatsApp');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    const status = {
        server: 'running',
        whatsapp: whatsappClient.info ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    };
    res.json(status);
});

/**
 * Test endpoint for manual testing
 */
app.post('/test-forward', async (req, res) => {
    const { from, message } = req.body;
    
    if (!from || !message) {
        return res.status(400).json({ error: 'Missing from or message' });
    }

    const testMessage = `📱 Test SMS
━━━━━━━━━━━━━━
From: ${from}
━━━━━━━━━━━━━━
${message}`;

    const success = await sendToWhatsApp(WHATSAPP_TARGET_NUMBER, testMessage);
    
    res.json({ 
        success, 
        message: success ? 'Message sent' : 'Failed to send message' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Webhook URL: http://your-server:${PORT}/sms-webhook`);
    console.log(`❤️  Health check: http://your-server:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://your-server:${PORT}/test-forward`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await whatsappClient.destroy();
    process.exit(0);
});
