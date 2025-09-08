<p align="centre">
  <a href="">
  <img src="https://raw.githubusercontent.com/hackesofice/Z/refs/heads/main/Live-Server-backend/Live.jpg" alt="Live server img">
</p>

![](https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=C084FC&center=true&vCenter=true&width=705&lines=🚀+Acode+Live+Server+Plugin+by+Hackesofice;💻+Live+Preview+for+HTML+on+Android;🌐+Open+Source+and+Free+Forever!)



  
  <p align="center">
        <img src="https://media.giphy.com/media/2wYFfJR9uZoOs/giphy.gif" height="25">
        <a href="https://github.com/hackesofice/Acode-live-server-backend/issues?q=is%3Aissue+is%3Aclosed">
          <img alt="Closed Issues" src="https://img.shields.io/github/issues-closed/hackesofice/Acode-live-server-backend?style=for-the-badge&color=3cb371&logo=checkmarx">
        </a>
    <img src="https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/stargazers">
      <img alt="Stars" src="https://img.shields.io/github/stars/hackesofice/Acode-live-server-backend?style=for-the-badge&color=ffd700&logo=github">
    </a>
    <img src="https://media.giphy.com/media/d31vTpVi1LAcDvdm/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/network">
      <img alt="Forks" src="https://img.shields.io/github/forks/hackesofice/Acode-live-server-backend?style=for-the-badge&color=ff7f50&logo=git">
    </a>
    <img src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/hackesofice/Acode-live-server-backend?style=for-the-badge&color=00bfff&logo=bugatti">
    </a>
    <img src="https://media.giphy.com/media/W5T1OR1XEDaXS/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server/pulls">
      <img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/hackesofice/Acode-live-server-backend?style=for-the-badge&color=9370db&logo=githubactions">
    </a>
    <img src="https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/commits/main">
      <img alt="Last Commit" src="https://img.shields.io/github/last-commit/hackesofice/Acode-live-server-backend?style=for-the-badge&color=32cd32&logo=clockify">
    </a>
    <img src="https://media.giphy.com/media/3oEjI5VtIhHvK37WYo/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/hackesofice/Acode-live-server-backend?style=for-the-badge&color=ff69b4&logo=open-source-initiative">
    </a>
    <img src="https://media.giphy.com/media/SuV6PMf5dUvvW/giphy.gif" height="25">
    <a href="https://acode.app/plugin/liveserver">
      <img alt="Downloads" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Facode.app%2Fapi%2Fplugin%2Fliveserver&query=downloads&style=for-the-badge&label=Downloads&labelColor=363a4f&color=c084fc&logo=download">
    </a>
    <img src="https://media.giphy.com/media/j5QcmXoFWlYJk/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend">
      <img alt="Repo Size" src="https://img.shields.io/github/repo-size/hackesofice/Acode-live-server-backend?style=for-the-badge&color=00ced1&logo=files">
    </a>
  </p>



# Disclaimer

This is a simple **backend server** for the **<a href="https://acode.app/plugin/liveserver">Acode Live Server</a>** plugin. It runs inside the **Termux** app on your Android device.

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&duration=4000&pause=1000&center=true&vCenter=true&width=435&lines=HEY+DEAR+WELCOME+TO+THE+REPOSITORY+;PLEASE+DON'T+FORGET+TO+STAR+%E2%AD%90+US;REPORT+FOR+ANY+ISSUES+;FOLLOW+US+ON+YOUTUBE;USE+100%+FREE+)](https://git.io/typing-svg)

---

## Installation Steps

### BACKEND (THIS ONE)

1. <a href="https://f-droid.org/repo/com.termux_1000.apk">Download</a> Termux from F-Droid  
2. Install and open Termux.  
3. Copy and paste the following commands one by one **OR** all at once into Termux, then press Enter:

```
rm -rf Acode-live-server-backend
pkg update && pkg upgrade -y
termux-setup-storage
pkg install python -y
pkg install git -y
git clone https://github.com/hackesofice/Acode-live-server-backend.git
cd Acode-live-server-backend
pip install -r requirements.txt
python main.py
```

> Note - If you're asked for permission or prompted with Y/N, type `Y` and press Enter, or tap "Allow" when requested.

---

### HOW TO RUN NEXT TIME

Each time you want to use the plugin, run these two commands:

```
cd Acode-live-server-backend
python main.py
```

---

### BONUS STEP (RECOMMENDED)

If you don’t want to run the commands manually every time, check out this tool:  
<a href="https://github.com/hackesofice/all-in-one-runner.git">https://github.com/hackesofice/all-in-one-runner.git</a>

---

## Frontend (Acode App Plugin)

1. Install the **Acode app** from the Google Play Store.  
2. Tap the **menu icon** (top-left corner).  
3. Tap the **Extensions** icon.  
4. Search for **Live Server**.  
5. Tap on the result, then tap **Install**.

---

## Contribution

Contributions are welcome! Everything is open source:  
- Found an issue? Open one on GitHub.  
- Want to contribute code? Fork the repo, make your changes, and submit a pull request with a clear description.
-  # Security Audit Report - Ijaxt VPN

## Issues Fixed ✅

### 1. Hardcoded Cloudflare Account ID
**Issue**: Account ID was hardcoded in server/index.tsx
**Fix**: Moved to environment variable `CLOUDFLARE_ACCOUNT_ID`
**Impact**: Prevents credential exposure in source code

### 2. KV Store Data Export Bug
**Issue**: `getByPrefix` function returning wrong data format
**Fix**: Return complete `{key, value}` objects instead of values only
**Impact**: Fixes data transfer functionality

### 3. Environment Variable Management
**Issue**: Limited environment variable handling
**Fix**: Created comprehensive security configuration system
**Impact**: Better credential management and fallbacks

### 4. Missing Security Documentation
**Issue**: No security guidelines for deployment
**Fix**: Added comprehensive security documentation
**Impact**: Better security practices for users

## Current Security Status ✅

### Authentication & Authorization
- ✅ Supabase Anon Key properly configured (safe for client-side)
- ✅ API key validation for data transfer operations
- ✅ Service Role Key properly isolated for server-side operations
- ✅ Proper CORS configuration

### Data Protection
- ✅ Environment variables for sensitive configuration
- ✅ API key masking in logs
- ✅ Secure API key generation algorithm
- ✅ Input validation on all endpoints

### Infrastructure Security
- ✅ Proper separation of client and server credentials
- ✅ Environment-specific configuration support
- ✅ Secure connection strings without hardcoded values

## Environment Variables Required

### Client-Side (Safe for browsers)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ecjuilkiworwehktwnxe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjanVpbGtpd29yd2Voa3R3bnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzQwMDgsImV4cCI6MjA3MjIxMDAwOH0.F_UlSqn6QXXgQL-IYyhTMURY0XDNxGEK6Ft01sN6Z0o
```

### Server-Side Only (Keep secure)
```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-key-here
CLOUDFLARE_API_TOKEN=your-cloudflare-token-here
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
```

## Recommendations for Production

1. **Rotate Keys Regularly**: Change API keys every 90 days
2. **Monitor Usage**: Implement logging for all API calls
3. **Rate Limiting**: Add rate limits to prevent abuse
4. **SSL/TLS**: Ensure all communications are encrypted
5. **Backup Strategy**: Regular automated backups of critical data

## Compliance Notes

- No hardcoded credentials in source code ✅
- Proper environment variable usage ✅
- Secure API key generation ✅
- Protection against common vulnerabilities ✅

The security improvements have been successfully implemented and the system is now production-ready with proper credential management.
 # Ijaxt VPN API Integration

## Overview

The Ijaxt VPN website includes powerful API integration capabilities for:

1. **Image Processing** - AI-powered background removal and icon generation
2. **LCI Data Access** - Real-time network intelligence and performance metrics

## Quick Start

1. Copy `.env.example` to `.env` and configure your API credentials
2. Import the API client utilities in your components
3. Use the provided React components or build your own integration

## Demo Mode

By default, the application runs in demo mode with simulated API responses. This allows you to:
- Test the UI and functionality without external dependencies
- See how the API integration works
- Develop and prototype quickly

## Environment Variables

```bash
# Required for production API integration
VITE_API_BASE_URL=https://your-api-endpoint.com/api
VITE_LCI_ACCESS_TOKEN=your-lci-access-token
VITE_IMAGE_PROCESSING_ENDPOINT=/process-image
```

## Components

- **APIIntegration** - Main integration showcase with tabs
- **ImageProcessor** - File upload and background removal
- **LCIDataViewer** - Real-time network metrics display

## Features

- ✅ Automatic fallback to demo mode
- ✅ Error handling and retry logic
- ✅ File validation and progress tracking
- ✅ Real-time data updates
- ✅ TypeScript support
- ✅ Responsive design

## Usage Example

```typescript
import { processImageFile, fetchLCIData } from './utils/api-client';

// Process an image
const result = await processImageFile(file);
if (result.success) {
  console.log('Download URL:', result.downloadUrl);
}

// Fetch network data
const data = await fetchLCIData();
if (data.success) {
  console.log('Network metrics:', data.data);
}
```
[![Netlify Status](https://api.netlify.com/api/v1/badges/53c3aeb4-a034-4163-ace6-cc9b221c6b9c/deploy-status)](https://app.netlify.com/projects/ijaxtvpn-v2/deploys)

The API integration is fully functional and ready for production use with proper environment configuration.<p align="centre">
  <a href="">
  <img src="https://raw.githubusercontent.com/hackesofice/Z/refs/heads/main/Live-Server-backend/Live.jpg" alt="Live server img">
</p>

![](https://readme-typing-svg.demolab.com?font=Fira+Code&size=28&duration=3000&pause=1000&color=C084FC&center=true&vCenter=true&width=705&lines=🚀+Acode+Live+Server+Plugin+by+Hackesofice;💻+Live+Preview+for+HTML+on+Android;🌐+Open+Source+and+Free+Forever!)



  
  <p align="center">
        <img src="https://media.giphy.com/media/2wYFfJR9uZoOs/giphy.gif" height="25">
        <a href="https://github.com/hackesofice/Acode-live-server-backend/issues?q=is%3Aissue+is%3Aclosed">
          <img alt="Closed Issues" src="https://img.shields.io/github/issues-closed/hackesofice/Acode-live-server-backend?style=for-the-badge&color=3cb371&logo=checkmarx">
        </a>
    <img src="https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/stargazers">
      <img alt="Stars" src="https://img.shields.io/github/stars/hackesofice/Acode-live-server-backend?style=for-the-badge&color=ffd700&logo=github">
    </a>
    <img src="https://media.giphy.com/media/d31vTpVi1LAcDvdm/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/network">
      <img alt="Forks" src="https://img.shields.io/github/forks/hackesofice/Acode-live-server-backend?style=for-the-badge&color=ff7f50&logo=git">
    </a>
    <img src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/hackesofice/Acode-live-server-backend?style=for-the-badge&color=00bfff&logo=bugatti">
    </a>
    <img src="https://media.giphy.com/media/W5T1OR1XEDaXS/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server/pulls">
      <img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/hackesofice/Acode-live-server-backend?style=for-the-badge&color=9370db&logo=githubactions">
    </a>
    <img src="https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/commits/main">
      <img alt="Last Commit" src="https://img.shields.io/github/last-commit/hackesofice/Acode-live-server-backend?style=for-the-badge&color=32cd32&logo=clockify">
    </a>
    <img src="https://media.giphy.com/media/3oEjI5VtIhHvK37WYo/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend/blob/main/LICENSE">
      <img alt="License" src="https://img.shields.io/github/license/hackesofice/Acode-live-server-backend?style=for-the-badge&color=ff69b4&logo=open-source-initiative">
    </a>
    <img src="https://media.giphy.com/media/SuV6PMf5dUvvW/giphy.gif" height="25">
    <a href="https://acode.app/plugin/liveserver">
      <img alt="Downloads" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Facode.app%2Fapi%2Fplugin%2Fliveserver&query=downloads&style=for-the-badge&label=Downloads&labelColor=363a4f&color=c084fc&logo=download">
    </a>
    <img src="https://media.giphy.com/media/j5QcmXoFWlYJk/giphy.gif" height="25">
    <a href="https://github.com/hackesofice/Acode-live-server-backend">
      <img alt="Repo Size" src="https://img.shields.io/github/repo-size/hackesofice/Acode-live-server-backend?style=for-the-badge&color=00ced1&logo=files">
    </a>
  </p>



# Disclaimer

This is a simple **backend server** for the **<a href="https://acode.app/plugin/liveserver">Acode Live Server</a>** plugin. It runs inside the **Termux** app on your Android device.

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&duration=4000&pause=1000&center=true&vCenter=true&width=435&lines=HEY+DEAR+WELCOME+TO+THE+REPOSITORY+;PLEASE+DON'T+FORGET+TO+STAR+%E2%AD%90+US;REPORT+FOR+ANY+ISSUES+;FOLLOW+US+ON+YOUTUBE;USE+100%+FREE+)](https://git.io/typing-svg)

---

## Installation Steps

### BACKEND (THIS ONE)

1. <a href="https://f-droid.org/repo/com.termux_1000.apk">Download</a> Termux from F-Droid  
2. Install and open Termux.  
3. Copy and paste the following commands one by one **OR** all at once into Termux, then press Enter:

```
rm -rf Acode-live-server-backend
pkg update && pkg upgrade -y
termux-setup-storage
pkg install python -y
pkg install git -y
git clone https://github.com/hackesofice/Acode-live-server-backend.git
cd Acode-live-server-backend
pip install -r requirements.txt
python main.py
```

> Note - If you're asked for permission or prompted with Y/N, type `Y` and press Enter, or tap "Allow" when requested.

---

### HOW TO RUN NEXT TIME

Each time you want to use the plugin, run these two commands:

```
cd Acode-live-server-backend
python main.py
```

---

### BONUS STEP (RECOMMENDED)

If you don’t want to run the commands manually every time, check out this tool:  
<a href="https://github.com/hackesofice/all-in-one-runner.git">https://github.com/hackesofice/all-in-one-runner.git</a>

---

## Frontend (Acode App Plugin)

1. Install the **Acode app** from the Google Play Store.  
2. Tap the **menu icon** (top-left corner).  
3. Tap the **Extensions** icon.  
4. Search for **Live Server**.  
5. Tap on the result, then tap **Install**.

---

## Contribution

Contributions are welcome! Everything is open source:  
- Found an issue? Open one on GitHub.  
- Want to contribute code? Fork the repo, make your changes, and submit a pull request with a clear description.
