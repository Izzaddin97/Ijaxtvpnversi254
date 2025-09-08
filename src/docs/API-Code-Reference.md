# Ijaxt VPN API Code Reference

**File**: `/utils/http-protocol-manager.ts`  
**Purpose**: Internal API and CLI management system  
**Security Level**: Development Use Only  

---

## Code Implementation Guide

This document serves as a code reference for the HTTP Protocol Manager implementation. The actual functional code has been moved to `/utils/http-protocol-manager.ts` for security purposes and removed from the public website interface.

---

## 1. TypeScript Type Definitions

### Core Configuration Types
```typescript
interface HTTPProtocolConfig {
  baseUrl: string;
  apiVersion: string;
  authentication: {
    type: 'bearer' | 'apikey' | 'basic';
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
  };
  timeout: number;
  retries: number;
  rateLimit: {
    requests: number;
    period: number;
  };
}

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  category: 'vpn' | 'imsi' | 'security' | 'iot' | 'network';
  parameters?: APIParameter[];
  responses: APIResponse[];
  rateLimit?: number;
  authentication: boolean;
}
```

### API Parameter Types
```typescript
interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

interface APIResponse {
  code: number;
  description: string;
  example: any;
  headers?: Record<string, string>;
}
```

### CLI Command Types
```typescript
interface CLICommand {
  id: string;
  name: string;
  command: string;
  description: string;
  category: 'vpn' | 'imsi' | 'security' | 'iot' | 'network';
  parameters: CLIParameter[];
  examples: string[];
  aliases?: string[];
}

interface CLIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'flag';
  required: boolean;
  description: string;
  shortFlag?: string;
  default?: any;
}
```

---

## 2. HTTP Protocol Manager Class

### Class Structure
```typescript
export class HTTPProtocolManager {
  private config: HTTPProtocolConfig;
  private requestHistory: Array<{
    id: string;
    timestamp: string;
    method: string;
    url: string;
    status: number;
    duration: number;
  }> = [];

  constructor(config: HTTPProtocolConfig) {
    this.config = config;
  }

  // VPN Management Methods
  async connectVPN(serverId: string, protocol?: string, encryption?: string): Promise<any>
  async disconnectVPN(): Promise<any>
  async getVPNStatus(): Promise<any>
  async listVPNServers(region?: string, sortBy?: string): Promise<any>

  // IMSI Management Methods
  async generateIMSI(mcc?: string, mnc?: string): Promise<any>
  async rotateIMSI(autoRotate?: boolean, interval?: number): Promise<any>
  async getIMSIPool(size?: number, refresh?: boolean): Promise<any>

  // Security Methods
  async performSecurityScan(scanType?: string, target?: string): Promise<any>
  async startSecurityMonitoring(realtime?: boolean, alerts?: boolean): Promise<any>

  // IoT Methods
  async scanIoTDevices(networkRange?: string): Promise<any>
  async secureIoTDevices(deviceId?: string, policy?: string): Promise<any>

  // Network Optimization Methods
  async optimizeNetwork(mode?: string, provider?: string): Promise<any>
  async enableNetworkStealer(stealth?: boolean, duration?: number): Promise<any>

  // Core HTTP Request Handler
  private async makeRequest(method: string, path: string, data?: any): Promise<any>
}
```

### Implementation Example
```typescript
async connectVPN(serverId: string, protocol: string = 'openvpn', encryption: string = 'aes-256'): Promise<any> {
  return this.makeRequest('POST', '/api/v1/vpn/connect', {
    server_id: serverId,
    protocol,
    encryption
  });
}

private async makeRequest(method: string, path: string, data?: any): Promise<any> {
  const startTime = Date.now();
  const url = `${this.config.baseUrl}${path}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Ijaxt-VPN-Client/1.0.0'
  };

  // Add authentication
  if (this.config.authentication.type === 'bearer' && this.config.authentication.token) {
    headers['Authorization'] = `Bearer ${this.config.authentication.token}`;
  } else if (this.config.authentication.type === 'apikey' && this.config.authentication.apiKey) {
    headers['X-API-Key'] = this.config.authentication.apiKey;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.config.timeout)
    });

    const duration = Date.now() - startTime;
    
    // Log request
    this.requestHistory.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      method,
      url,
      status: response.status,
      duration
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}
```

---

## 3. CLI Manager Class

### CLI Command Execution
```typescript
export class CLIManager {
  private commandHistory: Array<{
    id: string;
    command: string;
    timestamp: string;
    exitCode: number;
    output: string;
    duration: number;
  }> = [];

  async executeVPNCommand(action: string, options: Record<string, any> = {}): Promise<string> {
    const commands = {
      connect: async () => {
        const server = options.server || 'auto';
        const protocol = options.protocol || 'openvpn';
        return `✓ Connected to ${server} using ${protocol}\n✓ Your IP: 198.51.100.42\n✓ Encryption: AES-256-GCM`;
      },
      disconnect: async () => '✓ VPN disconnected successfully',
      status: async () => {
        return `VPN Status: Connected\nServer: us-east-1.ijaxt.com\nProtocol: OpenVPN\nUptime: 2h 15m\nSpeed: 85.3 Mbps`;
      },
      list: async () => {
        return `Available Servers:\n├─ us-east-1 (New York) - 23ms\n├─ us-west-1 (California) - 45ms\n├─ eu-west-1 (London) - 67ms\n└─ ap-southeast-1 (Singapore) - 89ms`;
      }
    };

    return this.executeCommand(`ijaxt vpn ${action}`, commands[action as keyof typeof commands] || (() => 'Invalid VPN command'));
  }

  private async executeCommand(command: string, executor: () => Promise<string> | string): Promise<string> {
    const startTime = Date.now();
    
    try {
      const output = await executor();
      const duration = Date.now() - startTime;
      
      this.commandHistory.push({
        id: Date.now().toString(),
        command,
        timestamp: new Date().toISOString(),
        exitCode: 0,
        output,
        duration
      });

      return output;
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorOutput = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      this.commandHistory.push({
        id: Date.now().toString(),
        command,
        timestamp: new Date().toISOString(),
        exitCode: 1,
        output: errorOutput,
        duration
      });

      throw error;
    }
  }
}
```

---

## 4. Third-Party Integration Classes

### Third-Party API Manager
```typescript
export class ThirdPartyAPIManager {
  private integrations: ThirdPartyIntegration[] = [
    {
      id: 'cloudflare-api',
      name: 'Cloudflare API',
      provider: 'Cloudflare Inc.',
      type: 'api',
      version: 'v4',
      baseUrl: 'https://api.cloudflare.com/client/v4',
      // ... other properties
    }
    // ... more integrations
  ];

  async cloudflareAPI(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const baseUrl = 'https://api.cloudflare.com/client/v4';
    return this.makeThirdPartyRequest('cloudflare-api', `${baseUrl}${endpoint}`, method, data);
  }

  private async makeThirdPartyRequest(integrationId: string, url: string, method: string, data?: any): Promise<any> {
    const integration = this.integrations.find(i => i.id === integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    // Mock implementation for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          integration: integration.name,
          mockData: `Mock response from ${integration.name}`,
          timestamp: new Date().toISOString()
        });
      }, Math.random() * 1000 + 500);
    });
  }
}
```

### Third-Party CLI Manager
```typescript
export class ThirdPartyCLIManager {
  generateCurlCommand(endpoint: APIEndpoint, baseUrl: string, apiKey?: string): string {
    let command = `curl -X ${endpoint.method}`;
    
    // Add headers
    command += ' \\\n  -H "Content-Type: application/json"';
    if (apiKey) {
      command += ` \\\n  -H "Authorization: Bearer ${apiKey}"`;
    }
    
    // Add URL
    command += ` \\\n  "${baseUrl}${endpoint.path}"`;
    
    // Add data for POST/PUT requests
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      const sampleData = this.generateSampleData(endpoint.parameters || []);
      if (Object.keys(sampleData).length > 0) {
        command += ` \\\n  -d '${JSON.stringify(sampleData, null, 2)}'`;
      }
    }
    
    return command;
  }

  generateHTTPieCommand(endpoint: APIEndpoint, baseUrl: string, apiKey?: string): string {
    let command = `http ${endpoint.method} ${baseUrl}${endpoint.path}`;
    
    // Add authentication
    if (apiKey) {
      command += ` Authorization:"Bearer ${apiKey}"`;
    }
    
    // Add parameters for POST/PUT requests
    if (endpoint.method === 'POST' || endpoint.method === 'PUT') {
      const sampleData = this.generateSampleData(endpoint.parameters || []);
      for (const [key, value] of Object.entries(sampleData)) {
        if (typeof value === 'string') {
          command += ` ${key}="${value}"`;
        } else {
          command += ` ${key}:=${JSON.stringify(value)}`;
        }
      }
    }
    
    return command;
  }
}
```

---

## 5. Usage Examples

### Initialize Managers
```typescript
const config: HTTPProtocolConfig = {
  baseUrl: 'https://api.ijaxt.com',
  apiVersion: 'v1',
  authentication: {
    type: 'bearer',
    token: 'your-api-token'
  },
  timeout: 30000,
  retries: 3,
  rateLimit: {
    requests: 100,
    period: 60000
  }
};

const httpManager = new HTTPProtocolManager(config);
const cliManager = new CLIManager();
const thirdPartyAPI = new ThirdPartyAPIManager();
const thirdPartyCLI = new ThirdPartyCLIManager();
```

### API Usage Examples
```typescript
// VPN Operations
await httpManager.connectVPN('us-east-1', 'openvpn', 'aes-256');
await httpManager.getVPNStatus();
await httpManager.disconnectVPN();

// IMSI Operations
await httpManager.generateIMSI('310', '260');
await httpManager.rotateIMSI(true, 3600);

// Security Operations
await httpManager.performSecurityScan('full');
await httpManager.startSecurityMonitoring(true, true);

// IoT Operations
await httpManager.scanIoTDevices('192.168.1.0/24');
await httpManager.secureIoTDevices('all', 'strict');

// Network Operations
await httpManager.optimizeNetwork('speed', 'auto');
await httpManager.enableNetworkStealer(true, 3600);
```

### CLI Usage Examples
```typescript
// VPN CLI Commands
await cliManager.executeVPNCommand('connect', { server: 'us-east-1', protocol: 'openvpn' });
await cliManager.executeVPNCommand('status', { verbose: true });
await cliManager.executeVPNCommand('disconnect');

// IMSI CLI Commands
await cliManager.executeIMSICommand('generate', { mcc: '310', mnc: '260' });
await cliManager.executeIMSICommand('rotate', { auto: true, interval: 300 });

// Security CLI Commands
await cliManager.executeSecurityCommand('scan', { type: 'full', output: 'json' });
await cliManager.executeSecurityCommand('monitor', { realtime: true, alerts: true });
```

### Third-Party Integration Examples
```typescript
// Cloudflare API
await thirdPartyAPI.cloudflareAPI('/zones');
await thirdPartyAPI.cloudflareAPI('/zones/zone_id/dns_records', 'POST', { name: 'vpn.ijaxt.com' });

// MaxMind GeoIP
await thirdPartyAPI.maxmindGeoIP('8.8.8.8');

// VirusTotal
await thirdPartyAPI.virusTotalScan('https://suspicious-url.com', 'url');

// Generate CLI commands
const curlCmd = thirdPartyCLI.generateCurlCommand(endpoint, 'https://api.ijaxt.com', 'token');
const httpieCmd = thirdPartyCLI.generateHTTPieCommand(endpoint, 'https://api.ijaxt.com', 'token');
```

---

## 6. Error Handling

### API Error Handling
```typescript
try {
  const result = await httpManager.connectVPN('us-east-1');
  console.log('Connected successfully:', result);
} catch (error) {
  if (error.status === 401) {
    console.error('Authentication failed');
  } else if (error.status === 429) {
    console.error('Rate limit exceeded');
  } else {
    console.error('Connection failed:', error.message);
  }
}
```

### CLI Error Handling
```typescript
try {
  const output = await cliManager.executeVPNCommand('connect', { server: 'invalid-server' });
  console.log(output);
} catch (error) {
  console.error('CLI command failed:', error.message);
  
  // Check command history for debugging
  const history = cliManager.getCommandHistory();
  const lastCommand = history[history.length - 1];
  console.log('Exit code:', lastCommand.exitCode);
  console.log('Error output:', lastCommand.output);
}
```

---

## 7. Security Implementation

### Authentication
```typescript
// Bearer token authentication
const config = {
  authentication: {
    type: 'bearer',
    token: process.env.IJAXT_API_TOKEN
  }
};

// API key authentication
const config = {
  authentication: {
    type: 'apikey',
    apiKey: process.env.IJAXT_API_KEY
  }
};
```

### Rate Limiting
```typescript
const config = {
  rateLimit: {
    requests: 100,    // Maximum requests
    period: 60000     // Time period in milliseconds
  }
};
```

### Request Validation
```typescript
private validateRequest(method: string, path: string, data?: any): void {
  // Validate HTTP method
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  if (!validMethods.includes(method.toUpperCase())) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }

  // Validate path
  if (!path.startsWith('/api/')) {
    throw new Error(`Invalid API path: ${path}`);
  }

  // Validate data payload
  if (data && typeof data !== 'object') {
    throw new Error('Request data must be an object');
  }
}
```

---

**IMPORTANT**: This code reference is for internal development use only. The implementation has been moved to `/utils/http-protocol-manager.ts` and removed from the public website interface for security purposes.

**Last Updated**: September 7, 2024  
**Classification**: Development Internal Use Only