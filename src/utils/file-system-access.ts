/**
 * File System Access API Utility for Ijaxt VPN
 * Secure file operations with Green Fire integration
 * 
 * @version 1.0.0
 * @author Ijaxt VPN Development Team
 */

// Type definitions extending the File System Access API
declare global {
  interface Window {
    showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
    showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
    showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;
  }
}

export interface FileSystemPermissionDescriptor {
  name: 'file-system-access';
  handle: FileSystemHandle;
  mode?: FileSystemPermissionMode;
}

export interface OpenFilePickerOptions {
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
  id?: string;
  startIn?: WellKnownDirectory | FileSystemHandle;
  multiple?: boolean;
}

export interface SaveFilePickerOptions {
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;
  id?: string;
  startIn?: WellKnownDirectory | FileSystemHandle;
  suggestedName?: string;
}

export interface DirectoryPickerOptions {
  id?: string;
  startIn?: WellKnownDirectory | FileSystemHandle;
  mode?: FileSystemPermissionMode;
}

export interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string | string[]>;
}

export type FileSystemPermissionMode = 'read' | 'readwrite';
export type WellKnownDirectory = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';

export interface VPNFileData {
  name: string;
  content: string;
  type: 'config' | 'certificate' | 'key' | 'log' | 'json';
  server?: string;
  protocol?: string;
  createdAt: Date;
  size: number;
}

export class FileSystemAccessManager {
  private static instance: FileSystemAccessManager;
  private supportedMimeTypes = {
    config: {
      'text/plain': ['.txt', '.conf', '.ovpn', '.wg'],
      'application/x-openvpn-profile': ['.ovpn'],
      'application/x-wireguard-profile': ['.conf', '.wg']
    },
    certificate: {
      'application/x-x509-ca-cert': ['.crt', '.cer', '.pem'],
      'application/x-pem-file': ['.pem', '.key']
    },
    json: {
      'application/json': ['.json']
    },
    log: {
      'text/plain': ['.log', '.txt']
    }
  };

  public static getInstance(): FileSystemAccessManager {
    if (!FileSystemAccessManager.instance) {
      FileSystemAccessManager.instance = new FileSystemAccessManager();
    }
    return FileSystemAccessManager.instance;
  }

  /**
   * Check if File System Access API is supported
   */
  public isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'showOpenFilePicker' in window &&
      'showSaveFilePicker' in window &&
      'showDirectoryPicker' in window
    );
  }

  /**
   * Check if the current context is secure (HTTPS)
   */
  public isSecureContext(): boolean {
    return typeof window !== 'undefined' && window.isSecureContext;
  }

  /**
   * Open file picker for single or multiple files
   */
  public async openFiles(options: {
    multiple?: boolean;
    types?: string[];
    startIn?: WellKnownDirectory;
  } = {}): Promise<VPNFileData[]> {
    if (!this.isSupported()) {
      throw new Error('File System Access API is not supported');
    }

    if (!this.isSecureContext()) {
      throw new Error('File System Access API requires a secure context (HTTPS)');
    }

    try {
      const fileTypes = this.buildFileTypes(options.types);
      
      const pickerOptions: OpenFilePickerOptions = {
        multiple: options.multiple || false,
        startIn: options.startIn || 'documents'
      };

      if (fileTypes.length > 0) {
        pickerOptions.types = fileTypes;
      }

      const fileHandles = await window.showOpenFilePicker(pickerOptions);
      const files: VPNFileData[] = [];

      for (const handle of fileHandles) {
        const file = await handle.getFile();
        const content = await file.text();
        
        files.push({
          name: handle.name,
          content,
          type: this.detectFileType(handle.name, content),
          createdAt: new Date(file.lastModified),
          size: file.size,
          server: this.extractServerFromConfig(content),
          protocol: this.detectProtocol(handle.name, content)
        });
      }

      return files;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('File selection was cancelled');
      }
      throw new Error(`Failed to open files: ${error.message}`);
    }
  }

  /**
   * Save file with specified content
   */
  public async saveFile(
    content: string,
    suggestedName: string,
    type: keyof typeof this.supportedMimeTypes = 'config'
  ): Promise<string> {
    if (!this.isSupported()) {
      throw new Error('File System Access API is not supported');
    }

    if (!this.isSecureContext()) {
      throw new Error('File System Access API requires a secure context (HTTPS)');
    }

    try {
      const fileTypes = this.buildFileTypes([type]);
      
      const pickerOptions: SaveFilePickerOptions = {
        suggestedName,
        startIn: 'downloads'
      };

      if (fileTypes.length > 0) {
        pickerOptions.types = fileTypes;
      }

      const fileHandle = await window.showSaveFilePicker(pickerOptions);
      const writable = await fileHandle.createWritable();
      
      // Add Ijaxt VPN header to configuration files
      let finalContent = content;
      if (type === 'config' && !content.includes('# Ijaxt VPN')) {
        finalContent = `# Ijaxt VPN Green Fire Configuration
# Generated: ${new Date().toISOString()}
# Security Level: Enterprise Grade

${content}`;
      }

      await writable.write(finalContent);
      await writable.close();

      return fileHandle.name;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('File save was cancelled');
      }
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  /**
   * Open directory picker
   */
  public async openDirectory(mode: FileSystemPermissionMode = 'read'): Promise<{
    name: string;
    handle: FileSystemDirectoryHandle;
    contents: Array<{
      name: string;
      kind: 'file' | 'directory';
      size?: number;
      lastModified?: Date;
    }>;
  }> {
    if (!this.isSupported()) {
      throw new Error('File System Access API is not supported');
    }

    try {
      const directoryHandle = await window.showDirectoryPicker({
        mode,
        startIn: 'documents'
      });

      const contents: Array<{
        name: string;
        kind: 'file' | 'directory';
        size?: number;
        lastModified?: Date;
      }> = [];

      for await (const [name, handle] of directoryHandle.entries()) {
        if (handle.kind === 'file') {
          const file = await (handle as FileSystemFileHandle).getFile();
          contents.push({
            name,
            kind: 'file',
            size: file.size,
            lastModified: new Date(file.lastModified)
          });
        } else {
          contents.push({
            name,
            kind: 'directory'
          });
        }
      }

      return {
        name: directoryHandle.name,
        handle: directoryHandle,
        contents
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Directory selection was cancelled');
      }
      throw new Error(`Failed to open directory: ${error.message}`);
    }
  }

  /**
   * Request permission for a file handle
   */
  public async requestPermission(
    handle: FileSystemHandle,
    mode: FileSystemPermissionMode = 'read'
  ): Promise<PermissionState> {
    try {
      return await handle.requestPermission({ mode });
    } catch (error: any) {
      throw new Error(`Failed to request permission: ${error.message}`);
    }
  }

  /**
   * Query permission for a file handle
   */
  public async queryPermission(
    handle: FileSystemHandle,
    mode: FileSystemPermissionMode = 'read'
  ): Promise<PermissionState> {
    try {
      return await handle.queryPermission({ mode });
    } catch (error: any) {
      throw new Error(`Failed to query permission: ${error.message}`);
    }
  }

  /**
   * Create VPN configuration templates
   */
  public generateVPNConfig(server: string, protocol: 'openvpn' | 'wireguard' | 'ikev2'): string {
    const templates = {
      openvpn: `client
dev tun
proto udp
remote ${server}.ijaxt.com 1194
resolv-retry infinite
nobind
persist-key
persist-tun
ca ca.crt
cert client.crt
key client.key
cipher AES-256-GCM
auth SHA256
comp-lzo
verb 3

# Ijaxt VPN Green Fire Security Enhanced
auth-user-pass
script-security 2
up /etc/openvpn/update-resolv-conf
down /etc/openvpn/update-resolv-conf
redirect-gateway def1 bypass-dhcp
dhcp-option DNS 1.1.1.1
dhcp-option DNS 8.8.8.8`,

      wireguard: `[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1, 8.8.8.8
MTU = 1420

[Peer]
PublicKey = IJAXT_${server.toUpperCase()}_SERVER_KEY
Endpoint = ${server}.ijaxt.com:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25

# Ijaxt VPN Green Fire WireGuard Configuration
# High-performance encrypted tunnel
# Enterprise-grade security with ChaCha20-Poly1305`,

      ikev2: `# IKEv2 Configuration for Ijaxt VPN
conn ijaxt-${server}
    keyexchange=ikev2
    auto=add
    compress=no
    type=tunnel
    fragmentation=yes
    forceencaps=yes
    ike=aes256gcm16-sha256-modp4096,aes256-sha256-modp4096!
    esp=aes256gcm16-sha256,aes256-sha256!
    dpdaction=clear
    dpddelay=300s
    rekey=no
    left=%defaultroute
    leftid=@ijaxt-client
    leftsubnet=0.0.0.0/0
    right=${server}.ijaxt.com
    rightid=@${server}.ijaxt.com
    rightsourceip=10.0.0.2
    rightdns=1.1.1.1,8.8.8.8
    leftauth=eap-mschapv2
    eap_identity=%identity`
    };

    return templates[protocol];
  }

  /**
   * Build file types for picker options
   */
  private buildFileTypes(types?: string[]): FilePickerAcceptType[] {
    if (!types || types.length === 0) {
      return [{
        description: 'All supported files',
        accept: {
          'text/plain': ['.txt', '.conf', '.ovpn', '.wg', '.log'],
          'application/json': ['.json'],
          'application/x-x509-ca-cert': ['.crt', '.cer', '.pem'],
          'application/x-pem-file': ['.pem', '.key']
        }
      }];
    }

    return types.map(type => {
      const mimeTypes = this.supportedMimeTypes[type as keyof typeof this.supportedMimeTypes];
      return {
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} files`,
        accept: mimeTypes || { 'text/plain': ['.txt'] }
      };
    });
  }

  /**
   * Detect file type based on name and content
   */
  private detectFileType(name: string, content: string): VPNFileData['type'] {
    const extension = name.toLowerCase().split('.').pop() || '';
    
    if (['.ovpn', '.conf'].includes(`.${extension}`) || content.includes('client\n') || content.includes('[Interface]')) {
      return 'config';
    }
    
    if (['.crt', '.cer', '.pem'].includes(`.${extension}`) || content.includes('BEGIN CERTIFICATE')) {
      return 'certificate';
    }
    
    if (extension === 'key' || content.includes('BEGIN PRIVATE KEY')) {
      return 'key';
    }
    
    if (extension === 'json') {
      return 'json';
    }
    
    if (['.log', '.txt'].includes(`.${extension}`) && content.includes('[')) {
      return 'log';
    }

    return 'config';
  }

  /**
   * Extract server name from configuration content
   */
  private extractServerFromConfig(content: string): string | undefined {
    // OpenVPN
    const openVpnMatch = content.match(/remote\s+([\w.-]+)/);
    if (openVpnMatch) {
      return openVpnMatch[1].replace('.ijaxt.com', '');
    }

    // WireGuard
    const wireGuardMatch = content.match(/Endpoint\s*=\s*([\w.-]+)/);
    if (wireGuardMatch) {
      return wireGuardMatch[1].replace('.ijaxt.com:51820', '');
    }

    // IKEv2
    const ikev2Match = content.match(/right=([\w.-]+)/);
    if (ikev2Match) {
      return ikev2Match[1].replace('.ijaxt.com', '');
    }

    return undefined;
  }

  /**
   * Detect VPN protocol from file
   */
  private detectProtocol(name: string, content: string): string | undefined {
    if (name.endsWith('.ovpn') || content.includes('client\n') || content.includes('remote ')) {
      return 'OpenVPN';
    }

    if (name.endsWith('.wg') || content.includes('[Interface]') || content.includes('[Peer]')) {
      return 'WireGuard';
    }

    if (content.includes('keyexchange=ikev2') || content.includes('conn ')) {
      return 'IKEv2';
    }

    return undefined;
  }

  /**
   * Validate file content for security
   */
  public validateConfigFile(content: string): {
    isValid: boolean;
    issues: string[];
    protocol?: string;
    server?: string;
  } {
    const issues: string[] = [];
    let protocol: string | undefined;
    let server: string | undefined;

    // Detect protocol
    if (content.includes('client\n') || content.includes('remote ')) {
      protocol = 'OpenVPN';
      server = this.extractServerFromConfig(content);

      // OpenVPN validation
      if (!content.includes('ca ') && !content.includes('ca.crt')) {
        issues.push('Missing CA certificate reference');
      }
      if (!content.includes('cipher ')) {
        issues.push('No encryption cipher specified');
      }
      if (content.includes('cipher DES') || content.includes('cipher 3DES')) {
        issues.push('Weak encryption cipher detected');
      }
    } else if (content.includes('[Interface]') || content.includes('[Peer]')) {
      protocol = 'WireGuard';
      server = this.extractServerFromConfig(content);

      // WireGuard validation
      if (!content.includes('PrivateKey')) {
        issues.push('Missing private key');
      }
      if (!content.includes('PublicKey')) {
        issues.push('Missing public key');
      }
      if (!content.includes('Endpoint')) {
        issues.push('Missing endpoint');
      }
    } else if (content.includes('keyexchange=ikev2')) {
      protocol = 'IKEv2';
      server = this.extractServerFromConfig(content);
    } else {
      issues.push('Unknown or unsupported VPN protocol');
    }

    // Security checks
    if (content.includes('auth none')) {
      issues.push('Authentication disabled - security risk');
    }
    
    if (content.includes('verify-x509-name') && content.includes('verify-x509-name ""')) {
      issues.push('Certificate verification disabled - security risk');
    }

    // Check for Ijaxt VPN servers
    if (server && !server.includes('ijaxt.com') && !content.includes('# Ijaxt VPN')) {
      issues.push('Configuration may not be for Ijaxt VPN servers');
    }

    return {
      isValid: issues.length === 0,
      issues,
      protocol,
      server
    };
  }

  /**
   * Export system configuration
   */
  public async exportSystemConfig(): Promise<string> {
    const config = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      system: 'Ijaxt VPN Green Fire',
      vpn: {
        protocols: ['OpenVPN', 'WireGuard', 'IKEv2'],
        servers: [
          'us-east-1.ijaxt.com',
          'us-west-1.ijaxt.com',
          'eu-west-1.ijaxt.com',
          'ap-southeast-1.ijaxt.com'
        ],
        encryption: {
          openvpn: 'AES-256-GCM',
          wireguard: 'ChaCha20-Poly1305',
          ikev2: 'AES-256-GCM'
        }
      },
      security: {
        imsi_rotation: true,
        iot_protection: true,
        network_stealer: true,
        threat_monitoring: true,
        dns_servers: ['1.1.1.1', '8.8.8.8'],
        kill_switch: true
      },
      features: {
        green_fire_theme: true,
        ai_assistant: true,
        real_time_monitoring: true,
        enterprise_grade: true
      },
      generated_by: 'Ijaxt VPN File System Manager'
    };

    return JSON.stringify(config, null, 2);
  }
}

// Export singleton instance
export const fileSystemAccess = FileSystemAccessManager.getInstance();

// Export utility functions
export const createVPNConfigFile = async (server: string, protocol: 'openvpn' | 'wireguard' | 'ikev2') => {
  const content = fileSystemAccess.generateVPNConfig(server, protocol);
  const filename = `${server}-${protocol}.${protocol === 'openvpn' ? 'ovpn' : 'conf'}`;
  
  try {
    await fileSystemAccess.saveFile(content, filename, 'config');
    return { success: true, filename };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export const importVPNConfig = async () => {
  try {
    const files = await fileSystemAccess.openFiles({
      types: ['config'],
      multiple: false
    });
    
    if (files.length > 0) {
      const validation = fileSystemAccess.validateConfigFile(files[0].content);
      return { success: true, file: files[0], validation };
    }
    
    return { success: false, error: 'No files selected' };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

export default fileSystemAccess;
