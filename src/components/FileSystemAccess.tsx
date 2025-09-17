import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { 
  FolderOpen, 
  Save, 
  Download, 
  Upload,
  File,
  FileText,
  Settings,
  Shield,
  Key,
  Database,
  AlertTriangle,
  CheckCircle,
  Copy,
  Trash2,
  RefreshCw,
  Lock,
  Unlock
} from "lucide-react";

interface FileSystemItem {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified?: Date;
  handle?: FileSystemHandle;
}

interface VPNConfig {
  serverName: string;
  protocol: string;
  encryption: string;
  port: number;
  config: string;
}

export function FileSystemAccess() {
  const [isSupported, setIsSupported] = useState(typeof window !== 'undefined' && 'showOpenFilePicker' in window);
  const [selectedFiles, setSelectedFiles] = useState<FileSystemItem[]>([]);
  const [selectedDirectory, setSelectedDirectory] = useState<FileSystemDirectoryHandle | null>(null);
  const [directoryContents, setDirectoryContents] = useState<FileSystemItem[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // VPN Configuration Templates
  const vpnConfigTemplates: VPNConfig[] = [
    {
      serverName: "US-East-1",
      protocol: "OpenVPN",
      encryption: "AES-256-GCM",
      port: 1194,
      config: `client
dev tun
proto udp
remote us-east-1.ijaxt.com 1194
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
# Ijaxt VPN Green Fire Security
auth-user-pass
script-security 2
up /etc/openvpn/update-resolv-conf
down /etc/openvpn/update-resolv-conf`
    },
    {
      serverName: "EU-West-1",
      protocol: "WireGuard",
      encryption: "ChaCha20-Poly1305",
      port: 51820,
      config: `[Interface]
PrivateKey = YOUR_PRIVATE_KEY
Address = 10.0.0.2/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = IJAXT_SERVER_PUBLIC_KEY
Endpoint = eu-west-1.ijaxt.com:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25

# Ijaxt VPN Green Fire Protection
# High-speed encrypted tunnel
# Enterprise-grade security`
    }
  ];

  const checkFileSystemSupport = useCallback(() => {
    const supported = typeof window !== 'undefined' && 'showOpenFilePicker' in window;
    setIsSupported(supported);
    
    if (!supported) {
      setError("File System Access API is not supported in this browser. Please use Chrome 86+ or Edge 86+");
    }
    
    return supported;
  }, []);

  const openFilePicker = async (multiple: boolean = false, accept?: Record<string, string[]>) => {
    if (!checkFileSystemSupport()) return;

    try {
      setLoading(true);
      setError("");
      
      const options: OpenFilePickerOptions = {
        multiple,
        types: []
      };

      if (accept) {
        options.types = [{
          description: "VPN Configuration Files",
          accept
        }];
      }

      const fileHandles = await window.showOpenFilePicker(options);
      const files: FileSystemItem[] = [];

      for (const handle of fileHandles) {
        const file = await handle.getFile();
        files.push({
          name: handle.name,
          type: 'file',
          size: file.size,
          lastModified: new Date(file.lastModified),
          handle
        });
      }

      setSelectedFiles(files);
      
      // If single file, read content
      if (files.length === 1) {
        const file = await fileHandles[0].getFile();
        const content = await file.text();
        setFileContent(content);
        setFileName(file.name);
      }

      setSuccess(`Successfully selected ${files.length} file(s)`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(`Failed to open file picker: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async (content: string, suggestedName: string) => {
    if (!checkFileSystemSupport()) return;

    try {
      setLoading(true);
      setError("");

      const options: SaveFilePickerOptions = {
        suggestedName,
        types: [{
          description: "Configuration Files",
          accept: {
            'text/plain': ['.txt', '.conf', '.ovpn'],
            'application/json': ['.json']
          }
        }]
      };

      const fileHandle = await window.showSaveFilePicker(options);
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      setSuccess(`File saved successfully as ${fileHandle.name}`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(`Failed to save file: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const openDirectoryPicker = async () => {
    if (!checkFileSystemSupport()) return;

    try {
      setLoading(true);
      setError("");

      const directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });

      setSelectedDirectory(directoryHandle);
      
      // Read directory contents
      const contents: FileSystemItem[] = [];
      for await (const [name, handle] of directoryHandle.entries()) {
        if (handle.kind === 'file') {
          const file = await handle.getFile();
          contents.push({
            name,
            type: 'file',
            size: file.size,
            lastModified: new Date(file.lastModified),
            handle
          });
        } else {
          contents.push({
            name,
            type: 'directory',
            handle
          });
        }
      }

      setDirectoryContents(contents);
      setSuccess(`Directory selected: ${directoryHandle.name}`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(`Failed to open directory: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateVPNConfig = (template: VPNConfig) => {
    setFileContent(template.config);
    setFileName(`${template.serverName.toLowerCase()}-${template.protocol.toLowerCase()}.${template.protocol === 'OpenVPN' ? 'ovpn' : 'conf'}`);
    setSuccess(`Generated ${template.protocol} configuration for ${template.serverName}`);
  };

  const downloadSystemConfig = async () => {
    const systemConfig = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      vpn: {
        protocol: "OpenVPN",
        encryption: "AES-256-GCM",
        servers: ["us-east-1.ijaxt.com", "eu-west-1.ijaxt.com"]
      },
      security: {
        imsi_rotation: true,
        iot_protection: true,
        network_stealer: true
      },
      generated_by: "Ijaxt VPN Green Fire System"
    };

    const content = JSON.stringify(systemConfig, null, 2);
    setFileContent(content);
    setFileName("ijaxt-vpn-config.json");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Copied to clipboard!");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="py-20 bg-muted/5" id="file-system">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">
            File System Access
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Securely manage VPN configuration files, certificates, and system settings with 
            advanced file system integration. All operations are encrypted with Green Fire security.
          </p>
        </div>

        {/* Browser Support Alert */}
        {!isSupported && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              File System Access API is not supported in this browser. Please use Chrome 86+, Edge 86+, or other Chromium-based browsers.
            </AlertDescription>
          </Alert>
        )}

        {/* Status Alerts */}
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500/50 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Config Gen
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              File Access
            </TabsTrigger>
            <TabsTrigger value="directory" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Configuration Generator */}
          <TabsContent value="config">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* VPN Templates */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-green-400" />
                    VPN Configuration Templates
                  </CardTitle>
                  <CardDescription>
                    Pre-configured VPN settings for Ijaxt servers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vpnConfigTemplates.map((template, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/20 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{template.serverName}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{template.protocol}</Badge>
                            <Badge variant="outline" className="text-xs">{template.encryption}</Badge>
                            <Badge variant="outline" className="text-xs">Port {template.port}</Badge>
                          </div>
                        </div>
                        <Button
                          onClick={() => generateVPNConfig(template)}
                          size="sm"
                          className="ml-2"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Configuration */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-400" />
                    System Configuration
                  </CardTitle>
                  <CardDescription>
                    Download complete system settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button
                      onClick={downloadSystemConfig}
                      className="w-full"
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate System Config
                    </Button>
                    
                    <Button
                      onClick={() => saveFile(JSON.stringify({
                        certificates: {
                          ca: "-----BEGIN CERTIFICATE-----\n[CA Certificate Content]\n-----END CERTIFICATE-----",
                          client: "-----BEGIN CERTIFICATE-----\n[Client Certificate Content]\n-----END CERTIFICATE-----",
                          key: "-----BEGIN PRIVATE KEY-----\n[Private Key Content]\n-----END PRIVATE KEY-----"
                        },
                        generated: new Date().toISOString()
                      }, null, 2), "ijaxt-certificates.json")}
                      variant="outline"
                      className="w-full"
                      disabled={!isSupported || loading}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Export Certificates
                    </Button>
                    
                    <Button
                      onClick={() => saveFile(`# Ijaxt VPN Log Export
# Generated: ${new Date().toISOString()}
# System: Green Fire Security

[2024-09-07 12:00:00] VPN Connected to us-east-1.ijaxt.com
[2024-09-07 12:01:15] IMSI Rotation: 310260123456789 -> 310260987654321
[2024-09-07 12:02:30] IoT Device Secured: 192.168.1.101
[2024-09-07 12:03:45] Network Optimization Applied: +25% speed
[2024-09-07 12:04:00] Security Scan Complete: No threats detected
[2024-09-07 12:05:00] Data Transfer: 150MB up, 2.3GB down
[2024-09-07 12:06:00] Connection Stable: 99.9% uptime`, "ijaxt-vpn-logs.txt")}
                      variant="outline"
                      className="w-full"
                      disabled={!isSupported || loading}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* File Access */}
          <TabsContent value="files">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* File Operations */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-green-400" />
                    File Operations
                  </CardTitle>
                  <CardDescription>
                    Open, read, and import configuration files
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={() => openFilePicker(false, {
                        'text/plain': ['.txt', '.conf', '.ovpn', '.log'],
                        'application/json': ['.json']
                      })}
                      disabled={!isSupported || loading}
                      className="w-full"
                    >
                      <File className="h-4 w-4 mr-2" />
                      Open File
                    </Button>
                    
                    <Button
                      onClick={() => openFilePicker(true)}
                      disabled={!isSupported || loading}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Open Multiple
                    </Button>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center py-4">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Processing files...
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Selected Files */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-400" />
                    Selected Files
                  </CardTitle>
                  <CardDescription>
                    Currently loaded files and their properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFiles.length > 0 ? (
                    <div className="space-y-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-green-400" />
                            <div>
                              <div className="font-medium text-sm">{file.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {file.size && formatFileSize(file.size)} • {file.lastModified?.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {file.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <File className="h-8 w-8 mx-auto mb-2" />
                      <p>No files selected</p>
                      <p className="text-xs">Open files to see them here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Directory Access */}
          <TabsContent value="directory">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-green-400" />
                  Directory Access
                </CardTitle>
                <CardDescription>
                  Browse and manage entire directories with read/write access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button
                  onClick={openDirectoryPicker}
                  disabled={!isSupported || loading}
                  className="w-full sm:w-auto"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Open Directory
                </Button>

                {selectedDirectory && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-lg border border-border">
                      <FolderOpen className="h-4 w-4 text-green-400" />
                      <span className="font-medium">Selected: {selectedDirectory.name}</span>
                    </div>

                    {directoryContents.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Directory Contents:</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {directoryContents.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/10 border border-border/50">
                              <div className="flex items-center gap-2">
                                {item.type === 'directory' ? (
                                  <FolderOpen className="h-4 w-4 text-blue-400" />
                                ) : (
                                  <File className="h-4 w-4 text-green-400" />
                                )}
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {item.size && (
                                  <span className="text-xs text-muted-foreground">
                                    {formatFileSize(item.size)}
                                  </span>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {item.type}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* File Editor */}
          <TabsContent value="editor">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  Configuration Editor
                </CardTitle>
                <CardDescription>
                  Edit and save configuration files directly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="filename">File Name</Label>
                  <Input
                    id="filename"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter filename (e.g., config.ovpn)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">File Content</Label>
                  <Textarea
                    id="content"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    placeholder="Paste or edit your configuration content here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => saveFile(fileContent, fileName || "config.txt")}
                    disabled={!isSupported || loading || !fileContent}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save File
                  </Button>
                  
                  <Button
                    onClick={() => copyToClipboard(fileContent)}
                    disabled={!fileContent}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setFileContent("");
                      setFileName("");
                    }}
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {fileContent && (
                  <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground mb-1">Preview:</div>
                    <div className="text-xs font-mono bg-background p-2 rounded border max-h-20 overflow-y-auto">
                      {fileContent.substring(0, 200)}
                      {fileContent.length > 200 && "..."}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Security Status */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Security Status
                  </CardTitle>
                  <CardDescription>
                    File system access security and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Browser Support</span>
                      </div>
                      <Badge variant={isSupported ? "default" : "destructive"} className="text-xs">
                        {isSupported ? "Supported" : "Not Supported"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Secure Context</span>
                      </div>
                      <Badge variant="default" className="text-xs">
                        HTTPS Required
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-green-400" />
                        <span className="text-sm">User Permissions</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        User Granted
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions Guide */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="h-5 w-5 text-green-400" />
                    Permissions Guide
                  </CardTitle>
                  <CardDescription>
                    How file system permissions work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-lg bg-green-900/20 border border-green-500/30">
                      <div className="font-medium text-green-400 mb-1">Read Access</div>
                      <div className="text-muted-foreground">
                        Open and read files with user permission
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                      <div className="font-medium text-blue-400 mb-1">Write Access</div>
                      <div className="text-muted-foreground">
                        Create and modify files in selected directories
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                      <div className="font-medium text-yellow-400 mb-1">Security</div>
                      <div className="text-muted-foreground">
                        All operations require explicit user consent
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
