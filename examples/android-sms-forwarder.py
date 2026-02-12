#!/usr/bin/env python3

"""
Android SMS Forwarder using Termux
This script monitors SMS messages on Android and forwards them to WhatsApp or a webhook.

Prerequisites:
1. Install Termux from F-Droid
2. Install Termux:API from F-Droid
3. Install required packages:
   pkg install python termux-api
   pip install requests

Usage:
    python android-sms-forwarder.py

Configuration:
    Edit the CONFIG section below to set your preferences.
"""

import subprocess
import json
import time
import re
import requests
from datetime import datetime
from typing import Dict, Optional

# ============== CONFIGURATION ==============

CONFIG = {
    # Forwarding method: 'webhook' or 'whatsapp_intent'
    'method': 'webhook',
    
    # Webhook configuration (if method is 'webhook')
    'webhook_url': 'https://your-server.com/webhook',
    'webhook_api_key': 'your_api_key_here',
    
    # WhatsApp configuration
    'whatsapp_target': '+1234567890',  # Include country code
    
    # Filtering options
    'filter_enabled': True,
    'filter_keywords': ['verification', 'code', 'otp', 'pin', 'verify'],
    'filter_regex': r'\b\d{4,6}\b',  # Match 4-6 digit codes
    
    # Polling interval (seconds)
    'poll_interval': 5,
    
    # Logging
    'log_file': '/data/data/com.termux/files/home/sms-forwarder.log',
    'verbose': True
}

# ============================================


class SMSForwarder:
    """Main SMS forwarding class"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.last_sms_id = None
        self.log(f"SMS Forwarder initialized with method: {config['method']}")
    
    def log(self, message: str):
        """Log messages to console and file"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        
        if self.config['verbose']:
            print(log_message)
        
        try:
            with open(self.config['log_file'], 'a') as f:
                f.write(log_message + '\n')
        except Exception as e:
            print(f"Error writing to log: {e}")
    
    def get_latest_sms(self) -> Optional[Dict]:
        """Get the latest SMS using termux-sms-list"""
        try:
            result = subprocess.run(
                ['termux-sms-list', '-l', '1', '-t', 'inbox'],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode != 0:
                self.log(f"Error getting SMS: {result.stderr}")
                return None
            
            sms_list = json.loads(result.stdout)
            
            if not sms_list or len(sms_list) == 0:
                return None
            
            return sms_list[0]
        
        except subprocess.TimeoutExpired:
            self.log("Timeout while getting SMS")
            return None
        except json.JSONDecodeError as e:
            self.log(f"Error parsing SMS data: {e}")
            return None
        except Exception as e:
            self.log(f"Unexpected error: {e}")
            return None
    
    def should_forward(self, sms: Dict) -> bool:
        """Determine if SMS should be forwarded based on filters"""
        if not self.config['filter_enabled']:
            return True
        
        body = sms.get('body', '').lower()
        
        # Check for keywords
        for keyword in self.config['filter_keywords']:
            if keyword.lower() in body:
                return True
        
        # Check regex pattern
        if re.search(self.config['filter_regex'], sms.get('body', '')):
            return True
        
        return False
    
    def forward_via_webhook(self, sms: Dict) -> bool:
        """Forward SMS via webhook"""
        try:
            payload = {
                'from': sms.get('number', 'Unknown'),
                'message': sms.get('body', ''),
                'timestamp': sms.get('received', datetime.now().isoformat()),
                'type': 'sms'
            }
            
            headers = {
                'Content-Type': 'application/json',
                'X-API-Key': self.config['webhook_api_key']
            }
            
            response = requests.post(
                self.config['webhook_url'],
                json=payload,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log(f"✅ SMS forwarded via webhook: {sms.get('number')}")
                return True
            else:
                self.log(f"❌ Webhook error: {response.status_code} - {response.text}")
                return False
        
        except requests.exceptions.RequestException as e:
            self.log(f"❌ Network error: {e}")
            return False
        except Exception as e:
            self.log(f"❌ Error forwarding via webhook: {e}")
            return False
    
    def forward_via_whatsapp_intent(self, sms: Dict) -> bool:
        """Forward SMS via Android intent to WhatsApp"""
        try:
            message = f"📱 SMS from {sms.get('number', 'Unknown')}\\n{sms.get('body', '')}"
            
            # Use termux-open-url with WhatsApp URL scheme
            whatsapp_url = f"https://wa.me/{self.config['whatsapp_target'].replace('+', '')}?text={message}"
            
            result = subprocess.run(
                ['termux-open-url', whatsapp_url],
                capture_output=True,
                timeout=5
            )
            
            if result.returncode == 0:
                self.log(f"✅ SMS forwarded to WhatsApp: {sms.get('number')}")
                return True
            else:
                self.log(f"❌ Error opening WhatsApp: {result.stderr}")
                return False
        
        except Exception as e:
            self.log(f"❌ Error forwarding to WhatsApp: {e}")
            return False
    
    def forward_sms(self, sms: Dict) -> bool:
        """Forward SMS using configured method"""
        method = self.config['method']
        
        if method == 'webhook':
            return self.forward_via_webhook(sms)
        elif method == 'whatsapp_intent':
            return self.forward_via_whatsapp_intent(sms)
        else:
            self.log(f"❌ Unknown forwarding method: {method}")
            return False
    
    def run(self):
        """Main loop to monitor and forward SMS"""
        self.log("🚀 SMS Forwarder started")
        self.log(f"   Method: {self.config['method']}")
        self.log(f"   Filter: {'Enabled' if self.config['filter_enabled'] else 'Disabled'}")
        self.log(f"   Poll interval: {self.config['poll_interval']}s")
        
        try:
            while True:
                sms = self.get_latest_sms()
                
                if sms:
                    sms_id = sms.get('_id') or sms.get('threadid')
                    
                    # Check if this is a new SMS
                    if self.last_sms_id is None:
                        # First run, just save the ID
                        self.last_sms_id = sms_id
                        self.log(f"📱 Monitoring started. Last SMS ID: {sms_id}")
                    elif sms_id != self.last_sms_id:
                        # New SMS received
                        self.log(f"📨 New SMS from {sms.get('number', 'Unknown')}")
                        
                        if self.should_forward(sms):
                            self.log("   ✅ SMS matches filter criteria")
                            success = self.forward_sms(sms)
                            
                            if success:
                                self.last_sms_id = sms_id
                        else:
                            self.log("   ⏭️  SMS filtered out, not forwarding")
                            self.last_sms_id = sms_id
                
                time.sleep(self.config['poll_interval'])
        
        except KeyboardInterrupt:
            self.log("👋 SMS Forwarder stopped by user")
        except Exception as e:
            self.log(f"❌ Fatal error: {e}")
            raise


def check_termux_api():
    """Check if Termux:API is installed and accessible"""
    try:
        result = subprocess.run(
            ['termux-sms-list', '-h'],
            capture_output=True,
            timeout=5
        )
        return result.returncode == 0
    except FileNotFoundError:
        return False
    except Exception:
        return False


def main():
    """Main entry point"""
    print("=" * 60)
    print("SMS to WhatsApp Forwarder for Android (Termux)")
    print("=" * 60)
    
    # Check prerequisites
    if not check_termux_api():
        print("❌ Error: Termux:API not found or not accessible")
        print("\nPlease install:")
        print("1. Termux:API app from F-Droid")
        print("2. Run: pkg install termux-api")
        return
    
    print("✅ Termux:API is available")
    
    # Create and run forwarder
    forwarder = SMSForwarder(CONFIG)
    forwarder.run()


if __name__ == '__main__':
    main()
