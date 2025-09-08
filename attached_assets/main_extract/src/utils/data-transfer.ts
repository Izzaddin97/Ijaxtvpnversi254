import { projectId, publicAnonKey } from './supabase/info';

export interface DataTransferOptions {
  apiKey: string;
  baseUrl?: string;
}
 
export interface DataStats {
  totalItems: number;
  categories: {
    vpnStats: number;
    imsiData: number;
    networkData: number;
    iotDevices: number;
    securityEvents: number;
    userPreferences: number;
    systemConfig: number;
    paymentData: number;
    other: number;
  };
  lastUpdated: string;
}

export interface ExportResult {
  success: boolean;
  data: {
    metadata: {
      exportedAt: string;
      version: string;
      source: string;
    };
    rawData: Array<{ key: string; value: any }>;
  };
  summary: {
    totalItems: number;
    categories: Record<string, number>;
  };
}

export interface ImportResult {
  success: boolean;
  summary: {
    imported: number;
    skipped: number;
    errors: number;
    totalProcessed: number;
  };
  errors: string[];
  message: string;
}

export class DataTransferAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: DataTransferOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || `https://${projectId}.supabase.co/functions/v1/make-server-24b1698c`;
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      'X-API-Key': this.apiKey,
      ...options.headers
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Generate a new API key
  static async generateApiKey(baseUrl?: string): Promise<{ apiKey: string; message: string }> {
    const url = baseUrl || `https://${projectId}.supabase.co/functions/v1/make-server-24b1698c`;
    const response = await fetch(`${url}/generate-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Verify API key
  async verifyApiKey(): Promise<{ valid: boolean; message: string; keyPrefix?: string }> {
    return this.makeRequest('/verify-api-key');
  }

  // Get data statistics
  async getDataStats(): Promise<DataStats> {
    const result = await this.makeRequest('/data-stats');
    return result.stats;
  }

  // Export all data
  async exportData(): Promise<ExportResult> {
    return this.makeRequest('/export-data');
  }

  // Import data
  async importData(data: any, overwrite: boolean = false): Promise<ImportResult> {
    return this.makeRequest('/import-data', {
      method: 'POST',
      body: JSON.stringify({ data, overwrite })
    });
  }

  // Clear all data
  async clearAllData(): Promise<{ success: boolean; message: string; deletedCount: number }> {
    return this.makeRequest('/clear-data', {
      method: 'DELETE',
      body: JSON.stringify({ confirm: 'DELETE_ALL_DATA' })
    });
  }

  // Backup data to file
  async backupToFile(filename?: string): Promise<string> {
    const exportResult = await this.exportData();
    
    const blob = new Blob([JSON.stringify(exportResult, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `ijaxt-vpn-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return a.download;
  }

  // Restore data from file
  async restoreFromFile(file: File, overwrite: boolean = false): Promise<ImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          const result = await this.importData(data, overwrite);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Validate backup file format
  static validateBackupFormat(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Invalid data format: not an object');
      return { valid: false, errors };
    }
    
    if (!data.metadata) {
      errors.push('Missing metadata section');
    } else {
      if (!data.metadata.exportedAt) errors.push('Missing export timestamp');
      if (!data.metadata.version) errors.push('Missing version information');
      if (!data.metadata.source) errors.push('Missing source information');
    }
    
    if (!data.data || !data.data.rawData) {
      errors.push('Missing or invalid data.rawData section');
    } else if (!Array.isArray(data.data.rawData)) {
      errors.push('data.rawData must be an array');
    }
    
    if (!data.summary) {
      errors.push('Missing summary section');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Get backup file info without importing
  static getBackupInfo(data: any): {
    valid: boolean;
    metadata?: {
      exportedAt: string;
      version: string;
      source: string;
    };
    summary?: {
      totalItems: number;
      categories: Record<string, number>;
    };
    errors: string[];
  } {
    const validation = this.validateBackupFormat(data);
    
    if (!validation.valid) {
      return {
        valid: false,
        errors: validation.errors
      };
    }
    
    return {
      valid: true,
      metadata: data.metadata,
      summary: data.summary,
      errors: []
    };
  }
}

// Utility functions for data operations
export const dataTransferUtils = {
  // Generate secure API key
  generateSecureApiKey: (): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ijaxt_';
    for (let i = 0; i < 32; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Format timestamp
  formatTimestamp: (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  },

  // Validate JSON string
  isValidJSON: (str: string): boolean => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  },

  // Get data category display name
  getCategoryDisplayName: (category: string): string => {
    const names: Record<string, string> = {
      vpnStats: 'VPN Statistics',
      imsiData: 'IMSI Data',
      networkData: 'Network Data',
      iotDevices: 'IoT Devices',
      securityEvents: 'Security Events',
      userPreferences: 'User Preferences',
      systemConfig: 'System Configuration',
      paymentData: 'Payment Data',
      other: 'Other Data'
    };
    return names[category] || category;
  },

  // Create backup filename
  createBackupFilename: (prefix: string = 'ijaxt-vpn-backup'): string => {
    const timestamp = new Date().toISOString().split('T')[0];
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${randomSuffix}.json`;
  },

  // Calculate backup size estimate
  estimateBackupSize: (stats: DataStats): string => {
    // Rough estimate: each item averages 200 bytes
    const estimatedBytes = stats.totalItems * 200;
    return dataTransferUtils.formatFileSize(estimatedBytes);
  }
};

export default DataTransferAPI;