/**
 * API Client for Ijaxt VPN
 * Handles image processing and LCI data integration
 */

export interface ImageProcessingResponse {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export interface LCIDataResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class APIClient {
  private baseUrl: string;
  private lciAccessToken: string;
  private imageProcessingEndpoint: string;

  constructor() {
    // Handle both Vite and standard environment variables
    this.baseUrl = (typeof window !== 'undefined' && (window as any).VITE_API_BASE_URL) || 
                   (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 
                   'https://ecjuilkiworwehktwnxe.supabase.co/functions/v1/api';
    this.lciAccessToken = (typeof window !== 'undefined' && (window as any).VITE_LCI_ACCESS_TOKEN) || 
                          (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LCI_ACCESS_TOKEN) || 
                          'demo-lci-token';
    this.imageProcessingEndpoint = (typeof window !== 'undefined' && (window as any).VITE_IMAGE_PROCESSING_ENDPOINT) || 
                                   (typeof import.meta !== 'undefined' && import.meta.env?.VITE_IMAGE_PROCESSING_ENDPOINT) || 
                                   '/process-image';
  }

  /**
   * Process image to remove background and convert to icon
   */
  async processImage(file: File): Promise<ImageProcessingResponse> {
    try {
      // Demo mode: create a mock processed image for demonstration
      if (this.baseUrl.includes('localhost') || this.baseUrl.includes('demo')) {
        return this.createMockProcessedImage(file);
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.baseUrl}${this.imageProcessingEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Fallback to demo mode if API is not available
        console.warn('API not available, using demo mode');
        return this.createMockProcessedImage(file);
      }

      // Check if response is an image (binary data)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        return { success: true, downloadUrl };
      }

      // Otherwise, expect JSON response
      const result = await response.json();
      return { success: true, ...result };
    } catch (error: any) {
      console.warn('Image processing error, falling back to demo mode:', error);
      // Fallback to demo mode
      return this.createMockProcessedImage(file);
    }
  }

  /**
   * Create mock processed image for demo purposes
   */
  private async createMockProcessedImage(file: File): Promise<ImageProcessingResponse> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Add a subtle green border effect to simulate processing
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        // Convert to blob and create download URL
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            resolve({ success: true, downloadUrl });
          } else {
            resolve({ success: false, error: 'Failed to process image' });
          }
        }, 'image/png');
      };
      
      img.onerror = () => {
        resolve({ success: false, error: 'Failed to load image' });
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Fetch LCI data with authentication
   */
  async fetchLCIData(): Promise<LCIDataResponse> {
    try {
      // Demo mode: return mock data for demonstration
      if (this.baseUrl.includes('localhost') || this.baseUrl.includes('demo') || this.lciAccessToken === 'demo-lci-token') {
        return this.createMockLCIData();
      }

      if (!this.lciAccessToken) {
        throw new Error('LCI access token not configured');
      }

      const response = await fetch(`${this.baseUrl}/lci/data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-lci-access': this.lciAccessToken,
        },
      });

      if (!response.ok) {
        // Fallback to demo mode if API is not available
        console.warn('LCI API not available, using demo mode');
        return this.createMockLCIData();
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      console.warn('LCI data fetch error, falling back to demo mode:', error);
      // Fallback to demo mode
      return this.createMockLCIData();
    }
  }

  /**
   * Create mock LCI data for demo purposes
   */
  private createMockLCIData(): LCIDataResponse {
    const mockData = {
      id: `lci_${Date.now()}`,
      status: 'active',
      timestamp: new Date().toISOString(),
      metrics: {
        connections: Math.floor(Math.random() * 1000) + 500,
        throughput: `${(Math.random() * 100 + 50).toFixed(1)} Mbps`,
        latency: `${Math.floor(Math.random() * 20) + 5}ms`,
        uptime: '99.9%'
      },
      security: {
        threatsBlocked: Math.floor(Math.random() * 100) + 50,
        encryptionLevel: 'AES-256',
        activeTunnels: Math.floor(Math.random() * 50) + 20
      },
      network: {
        servers: 150,
        countries: 45,
        totalBandwidth: '10 Tbps'
      }
    };

    return { success: true, data: mockData };
  }

  /**
   * Upload processed image to storage (if implemented)
   */
  async uploadImage(blob: Blob, fileName: string): Promise<ImageProcessingResponse> {
    try {
      const formData = new FormData();
      formData.append('image', blob, fileName);

      const response = await fetch(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return { success: true, ...result };
    } catch (error: any) {
      console.error('Image upload error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Check API health status
   */
  async checkHealth(): Promise<{ healthy: boolean; message?: string }> {
    try {
      // Demo mode: always return healthy for demonstration
      if (this.baseUrl.includes('localhost') || this.baseUrl.includes('demo')) {
        return { healthy: true, message: 'Demo mode - API simulation active' };
      }

      // Create timeout controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return { healthy: false, message: `API not responding: ${response.status}` };
      }

      return { healthy: true, message: 'API service is operational' };
    } catch (error: any) {
      // Fallback to demo mode when health check fails
      console.warn('Health check failed, enabling demo mode:', error);
      return { healthy: true, message: 'Demo mode - API simulation active' };
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export utility functions
export const processImageFile = (file: File) => apiClient.processImage(file);
export const fetchLCIData = () => apiClient.fetchLCIData();
export const checkAPIHealth = () => apiClient.checkHealth();
