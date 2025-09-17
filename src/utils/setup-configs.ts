// VPN setup configurations for different platforms
export const VPN_CONFIGS = {
  ios: `# Ijaxt VPN iOS Configuration
Server: secure.ijaxtvpn.com
Protocol: IKEv2/IPSec
Remote ID: secure.ijaxtvpn.com
Local ID: [Leave blank]
Username: {Your Account Email}
Password: {Your Account Password}

# Advanced Settings
Use Certificate: Yes
Send All Traffic: Yes
Enable Perfect Forward Secrecy: Yes`,

  android: `# Ijaxt VPN Android Configuration
Server: secure.ijaxtvpn.com
Protocol: WireGuard
Port: 51820
Public Key: [Auto-generated]
Private Key: [Auto-generated]
DNS: 1.1.1.1, 1.0.0.1

# OpenVPN Alternative
Server: secure.ijaxtvpn.com  
Protocol: OpenVPN
Port: 1194 (UDP) / 443 (TCP)
Encryption: AES-256-GCM
Authentication: SHA256`,

  windows: `# Ijaxt VPN Windows Configuration
Server: secure.ijaxtvpn.com
Protocol: L2TP/IPSec
Pre-shared Key: IjaxtVPN2024Secure
Username: {Your Account Email}
Password: {Your Account Password}

# Alternative WireGuard Setup
Download: IjaxtVPN Windows App
Server: Auto-select best
Encryption: ChaCha20-Poly1305
Kill Switch: Enabled`,

  router: `# Ijaxt VPN Router Configuration
Server: secure.ijaxtvpn.com
Protocol: OpenVPN
Port: 1194 (UDP recommended)
Configuration File: ijaxt-router.ovpn
Certificate: Download from member portal
Username: {Your Account Email}
Password: {Your Account Password}

# DNS Settings
Primary DNS: 1.1.1.1
Secondary DNS: 1.0.0.1
Enable DNS Leak Protection: Yes`
};

export const SETUP_INSTRUCTIONS = {
  ios: [
    "Go to Settings → General → VPN & Device Management",
    "Tap \"Add VPN Configuration\"",
    "Select \"IKEv2\" and enter the configuration above",
    "Save and toggle the VPN connection"
  ],
  android: [
    "Download and install OpenVPN Connect from Play Store",
    "Import the configuration file",
    "Enter your username and password",
    "Connect to the VPN"
  ],
  windows: [
    "Open Settings → Network & Internet → VPN",
    "Click \"Add a VPN connection\"",
    "Select \"L2TP/IPSec with pre-shared key\"",
    "Enter the configuration details above",
    "Save and connect"
  ],
  router: [
    "Access your router's admin panel",
    "Navigate to VPN settings",
    "Upload the OpenVPN configuration file",
    "Enter your credentials",
    "Enable VPN for all devices"
  ]
};
