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

The API integration is fully functional and ready for production use with proper environment configuration.