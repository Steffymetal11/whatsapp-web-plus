#!/usr/bin/env node

/**
 * Generic Webhook Server for SMS Forwarding
 * 
 * This server receives SMS data via webhooks (from IFTTT, Zapier, or custom integrations)
 * and forwards them to WhatsApp.
 * 
 * Prerequisites:
 * - npm install express body-parser whatsapp-web.js qrcode-terminal dotenv
 */

const express = require('express');
const bodyParser = require('body-parser');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

// Configuration
const PORT = process.env.PORT || 3000;
const WHATSAPP_TARGET = process.env.WHATSAPP_TARGET || '1234567890';
const API_KEY = process.env.API_KEY || 'change_me_to_secure_key';

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize WhatsApp Client
const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let isWhatsAppReady = false;

// WhatsApp events
whatsappClient.on('qr', (qr) => {
    console.log('🔐 QR Code for WhatsApp authentication:');
    qrcode.generate(qr, { small: true });
    console.log('\nScan this QR code with WhatsApp on your phone');
});

whatsappClient.on('ready', () => {
    console.log('✅ WhatsApp client is ready!');
    isWhatsAppReady = true;
});

whatsappClient.on('authenticated', () => {
    console.log('✅ WhatsApp authenticated');
});

whatsappClient.on('auth_failure', () => {
    console.error('❌ WhatsApp authentication failed');
    isWhatsAppReady = false;
});

whatsappClient.on('disconnected', () => {
    console.log('⚠️  WhatsApp disconnected');
    isWhatsAppReady = false;
});

// Initialize
console.log('🚀 Starting WhatsApp Web client...');
whatsappClient.initialize();

/**
 * Authentication middleware
 */
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (API_KEY !== 'change_me_to_secure_key' && 
        (!apiKey || apiKey !== API_KEY) && 
        (!authHeader || authHeader !== `Bearer ${API_KEY}`)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
}

/**
 * Format phone number for WhatsApp
 */
function formatWhatsAppNumber(number) {
    const cleaned = number.replace(/\D/g, '');
    return `${cleaned}@c.us`;
}

/**
 * Send message to WhatsApp
 */
async function sendToWhatsApp(targetNumber, message) {
    if (!isWhatsAppReady) {
        throw new Error('WhatsApp client not ready');
    }

    try {
        const chatId = formatWhatsAppNumber(targetNumber);
        await whatsappClient.sendMessage(chatId, message);
        console.log(`✅ Message sent to ${targetNumber}`);
        return true;
    } catch (error) {
        console.error('❌ Error sending message:', error.message);
        throw error;
    }
}

/**
 * Main webhook endpoint
 * Accepts various formats from different services
 */
app.post('/webhook', authenticate, async (req, res) => {
    console.log('📨 Webhook received:', JSON.stringify(req.body, null, 2));

    try {
        // Parse incoming data (flexible format)
        let from = req.body.from || req.body.sender || req.body.From || 'Unknown';
        let messageBody = req.body.message || req.body.text || req.body.body || req.body.Body || '';
        let timestamp = req.body.timestamp || req.body.time || new Date().toISOString();

        // Support for IFTTT format
        if (req.body.From && req.body.Text) {
            from = req.body.From;
            messageBody = req.body.Text;
            timestamp = req.body.OccurredAt || timestamp;
        }

        // Validate data
        if (!messageBody) {
            return res.status(400).json({ 
                error: 'Missing message content',
                received: req.body
            });
        }

        // Format message
        const whatsappMessage = `📱 SMS Received
━━━━━━━━━━━━━━
From: ${from}
Time: ${timestamp}
━━━━━━━━━━━━━━
${messageBody}`;

        // Send to WhatsApp
        await sendToWhatsApp(WHATSAPP_TARGET, whatsappMessage);

        res.json({ 
            success: true, 
            message: 'SMS forwarded to WhatsApp',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

/**
 * IFTTT-specific endpoint (with their expected response format)
 */
app.post('/ifttt', authenticate, async (req, res) => {
    console.log('📨 IFTTT webhook received');

    try {
        const from = req.body.From || 'Unknown';
        const message = req.body.Text || '';

        const whatsappMessage = `📱 SMS via IFTTT
━━━━━━━━━━━━━━
From: ${from}
━━━━━━━━━━━━━━
${message}`;

        await sendToWhatsApp(WHATSAPP_TARGET, whatsappMessage);

        res.json({ 
            data: [{ 
                id: Date.now(),
                created_at: new Date().toISOString()
            }]
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ errors: [{ message: error.message }] });
    }
});

/**
 * Zapier-specific endpoint
 */
app.post('/zapier', authenticate, async (req, res) => {
    console.log('📨 Zapier webhook received');

    try {
        const from = req.body.from || req.body.phone || 'Unknown';
        const message = req.body.message || req.body.body || '';

        const whatsappMessage = `📱 SMS via Zapier
━━━━━━━━━━━━━━
From: ${from}
━━━━━━━━━━━━━━
${message}`;

        await sendToWhatsApp(WHATSAPP_TARGET, whatsappMessage);

        res.json({ 
            status: 'success',
            id: Date.now()
        });

    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'running',
        whatsapp: isWhatsAppReady ? 'ready' : 'not ready',
        timestamp: new Date().toISOString()
    });
});

/**
 * Test endpoint
 */
app.post('/test', authenticate, async (req, res) => {
    try {
        const testMessage = `🧪 Test Message
━━━━━━━━━━━━━━
This is a test from the webhook server.
Time: ${new Date().toISOString()}`;

        await sendToWhatsApp(WHATSAPP_TARGET, testMessage);

        res.json({ 
            success: true, 
            message: 'Test message sent' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║        SMS to WhatsApp Webhook Server                     ║
╚═══════════════════════════════════════════════════════════╝

✅ Server running on port ${PORT}

📡 Webhook endpoints:
   • Generic:  POST http://your-server:${PORT}/webhook
   • IFTTT:    POST http://your-server:${PORT}/ifttt
   • Zapier:   POST http://your-server:${PORT}/zapier

🏥 Health:     GET  http://your-server:${PORT}/health
🧪 Test:       POST http://your-server:${PORT}/test

🔐 API Key: ${API_KEY === 'change_me_to_secure_key' ? '⚠️  CHANGE ME!' : '✅ Configured'}
📱 Target: +${WHATSAPP_TARGET}

💡 Set API key via: 
   - Header: Authorization: Bearer YOUR_KEY
   - Header: x-api-key: YOUR_KEY
   - Query:  ?api_key=YOUR_KEY
    `);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down...');
    await whatsappClient.destroy();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n👋 Shutting down...');
    await whatsappClient.destroy();
    process.exit(0);
});
