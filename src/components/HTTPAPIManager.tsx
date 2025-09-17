import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { 
  Code, 
  Key, 
  Database, 
  Send,
  Copy,
  Download,
  FileText,
  Settings,
  Terminal,
  Globe,
  Shield,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Eye,
  EyeOff
} from "lucide-react";

interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
  responses: { code: number; description: string; example: any }[];
  category: string;
}

interface ThirdPartyAPI {
  id: string;
  name: string;
  provider: string;
  version: string;
  baseUrl: string;
  documentation: string;
  authentication: string;
  rateLimit: string;
  status: string;
}

export function HTTPAPIManager() {
  const [activeCategory, setActiveCategory] = useState("vpn");
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [testRequest, setTestRequest] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Comprehensive API endpoints for all VPN functions
  const apiEndpoints: APIEndpoint[] = [
    // VPN Management APIs
    {
      id: "vpn-connect",
      name: "VPN Connect",
      method: "POST",
      path: "/api/v1/vpn/connect",
      description: "Establish VPN connection to specified server",
      parameters: [
        { name: "server_id", type: "string", required: true, description: "Target VPN server identifier" },
        { name: "protocol", type: "string", required: false, description: "Connection protocol (OpenVPN, WireGuard, IKEv2)" },
        { name: "encryption", type: "string", required: false, description: "Encryption level (AES-256, ChaCha20)" }
      ],
      responses: [
        { code: 200, description: "Connection successful", example: { "status": "connected", "server": "us-east-1", "ip": "192.168.1.100" } },
        { code: 400, description: "Invalid parameters", example: { "error": "Invalid server_id" } }
      ],
      category: "vpn"
    },
    {
      id: "vpn-disconnect",
      name: "VPN Disconnect",
      method: "POST",
      path: "/api/v1/vpn/disconnect",
      description: "Terminate active VPN connection",
      parameters: [],
      responses: [
        { code: 200, description: "Disconnection successful", example: { "status": "disconnected", "duration": "01:23:45" } }
      ],
      category: "vpn"
    },
    {
      id: "vpn-status",
      name: "VPN Status",
      method: "GET",
      path: "/api/v1/vpn/status",
      description: "Get current VPN connection status",
      parameters: [],
      responses: [
        { code: 200, description: "Status retrieved", example: { "connected": true, "server": "us-east-1", "uptime": "01:23:45", "data_transfer": { "uploaded": "150MB", "downloaded": "2.3GB" } } }
      ],
      category: "vpn"
    },
    
    // IMSI Management APIs
    {
      id: "imsi-generate",
      name: "Generate IMSI",
      method: "POST",
      path: "/api/v1/imsi/generate",
      description: "Generate new random IMSI identity",
      parameters: [
        { name: "mcc", type: "string", required: false, description: "Mobile Country Code" },
        { name: "mnc", type: "string", required: false, description: "Mobile Network Code" }
      ],
      responses: [
        { code: 200, description: "IMSI generated", example: { "imsi": "310260123456789", "mcc": "310", "mnc": "260", "expires_at": "2024-12-31T23:59:59Z" } }
      ],
      category: "imsi"
    },
    {
      id: "imsi-rotate",
      name: "Rotate IMSI",
      method: "PUT",
      path: "/api/v1/imsi/rotate",
      description: "Rotate to new IMSI identity",
      parameters: [],
      responses: [
        { code: 200, description: "IMSI rotated", example: { "old_imsi": "310260123456789", "new_imsi": "310260987654321", "rotated_at": "2024-09-07T12:00:00Z" } }
      ],
      category: "imsi"
    },
    
    // Network Security APIs
    {
      id: "security-scan",
      name: "Security Scan",
      method: "POST",
      path: "/api/v1/security/scan",
      description: "Perform comprehensive security scan",
      parameters: [
        { name: "scan_type", type: "string", required: true, description: "Type of scan (vulnerability, port, malware)" },
        { name: "target", type: "string", required: false, description: "Specific target to scan" }
      ],
      responses: [
        { code: 200, description: "Scan completed", example: { "scan_id": "scan_123", "threats_found": 0, "scan_duration": "00:02:30", "status": "clean" } }
      ],
      category: "security"
    },
    
    // IoT Device Management APIs
    {
      id: "iot-devices",
      name: "List IoT Devices",
      method: "GET",
      path: "/api/v1/iot/devices",
      description: "Get list of connected IoT devices",
      parameters: [
        { name: "status", type: "string", required: false, description: "Filter by device status" }
      ],
      responses: [
        { code: 200, description: "Devices retrieved", example: { "devices": [{ "id": "device_001", "name": "Smart Thermostat", "ip": "192.168.1.101", "status": "online" }] } }
      ],
      category: "iot"
    },
    
    // Network Optimization APIs
    {
      id: "network-optimize",
      name: "Optimize Network",
      method: "POST",
      path: "/api/v1/network/optimize",
      description: "Optimize network routing and performance",
      parameters: [
        { name: "optimization_type", type: "string", required: true, description: "Type of optimization (speed, security, stealth)" }
      ],
      responses: [
        { code: 200, description: "Optimization applied", example: { "optimization_id": "opt_123", "performance_gain": "25%", "applied_at": "2024-09-07T12:00:00Z" } }
      ],
      category: "network"
    }
  ];

  // Third-party APIs and CLIs
  const thirdPartyAPIs: ThirdPartyAPI[] = [
    {
      id: "cloudflare-api",
      name: "Cloudflare API",
      provider: "Cloudflare",
      version: "v4",
      baseUrl: "https://api.cloudflare.com/client/v4",
      documentation: "https://developers.cloudflare.com/api/",
      authentication: "Bearer Token",
      rateLimit: "1200/5min",
      status: "active"
    },
    {
      id: "maxmind-geoip",
      name: "MaxMind GeoIP",
      provider: "MaxMind",
      version: "v2",
      baseUrl: "https://geoip.maxmind.com/geoip/v2.1",
      documentation: "https://dev.maxmind.com/geoip/",
      authentication: "HTTP Basic Auth",
      rateLimit: "1000/hour",
      status: "active"
    },
    {
      id: "virustotal-api",
      name: "VirusTotal API",
      provider: "VirusTotal",
      version: "v3",
      baseUrl: "https://www.virustotal.com/api/v3",
      documentation: "https://developers.virustotal.com/reference/",
      authentication: "API Key",
      rateLimit: "500/day",
      status: "active"
    },
    {
      id: "ipinfo-api",
      name: "IPInfo API",
      provider: "IPInfo",
      version: "v1",
      baseUrl: "https://ipinfo.io",
      documentation: "https://ipinfo.io/developers",
      authentication: "Token",
      rateLimit: "50000/month",
      status: "active"
    },
    {
      id: "shodan-api",
      name: "Shodan API",
      provider: "Shodan",
      version: "v1",
      baseUrl: "https://api.shodan.io",
      documentation: "https://developer.shodan.io/api",
      authentication: "API Key",
      rateLimit: "100/month",
      status: "active"
    }
  ];

  const categories = [
    { id: "vpn", name: "VPN Management", icon: Shield },
    { id: "imsi", name: "IMSI System", icon: Key },
    { id: "security", name: "Security", icon: Shield },
    { id: "iot", name: "IoT Devices", icon: Database },
    { id: "network", name: "Network", icon: Globe }
  ];

  const generateAPIKey = () => {
    const key = `ijaxt_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(key);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportAPICollection = () => {
    const collection = {
      info: {
        name: "Ijaxt VPN API Collection",
        version: "1.0.0",
        description: "Complete API collection for Ijaxt VPN services"
      },
      endpoints: apiEndpoints,
      thirdParty: thirdPartyAPIs,
      generated_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ijaxt-vpn-api-collection.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const testAPIEndpoint = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponse = {
      status: 200,
      statusText: "OK",
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Remaining": "999",
        "X-Response-Time": "45ms"
      },
      data: selectedEndpoint.responses[0]?.example || { message: "Success" }
    };
    
    setTestResponse(JSON.stringify(mockResponse, null, 2));
    setLoading(false);
  };

  const filteredEndpoints = apiEndpoints.filter(endpoint => endpoint.category === activeCategory);

  return (
    <section className="py-20 bg-muted/5" id="http-api">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">
            HTTP API Management
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Comprehensive API management system for all VPN functions. Generate API keys, test endpoints, 
            and integrate with third-party services for enhanced functionality.
          </p>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="endpoints" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              API Endpoints
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              API Testing
            </TabsTrigger>
            <TabsTrigger value="third-party" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Third-party APIs
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              API Management
            </TabsTrigger>
          </TabsList>

          {/* API Endpoints */}
          <TabsContent value="endpoints">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Category Sidebar */}
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>

              {/* Endpoints List */}
              <div className="lg:col-span-3 space-y-4">
                {filteredEndpoints.map((endpoint) => (
                  <Card key={endpoint.id} className="fire-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${
                            endpoint.method === 'GET' ? 'border-green-500 text-green-400' :
                            endpoint.method === 'POST' ? 'border-blue-500 text-blue-400' :
                            endpoint.method === 'PUT' ? 'border-yellow-500 text-yellow-400' :
                            'border-red-500 text-red-400'
                          }`}>
                            {endpoint.method}
                          </Badge>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEndpoint(endpoint)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Parameters:</div>
                        {endpoint.parameters.length > 0 ? (
                          <div className="space-y-1">
                            {endpoint.parameters.map((param, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <Badge variant="outline" className="text-xs">{param.type}</Badge>
                                <span className="font-mono">{param.name}</span>
                                {param.required && <Badge variant="destructive" className="text-xs">required</Badge>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No parameters required</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* API Testing */}
          <TabsContent value="testing">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Request Builder */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-green-400" />
                    API Request Builder
                  </CardTitle>
                  <CardDescription>
                    Test API endpoints with custom requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Endpoint</Label>
                    <select 
                      className="w-full p-2 rounded border bg-background"
                      value={selectedEndpoint?.id || ""}
                      onChange={(e) => {
                        const endpoint = apiEndpoints.find(ep => ep.id === e.target.value);
                        setSelectedEndpoint(endpoint || null);
                      }}
                    >
                      <option value="">Choose an endpoint...</option>
                      {apiEndpoints.map((endpoint) => (
                        <option key={endpoint.id} value={endpoint.id}>
                          {endpoint.method} {endpoint.path} - {endpoint.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedEndpoint && (
                    <>
                      <div className="space-y-2">
                        <Label>Request Body (JSON)</Label>
                        <Textarea
                          value={testRequest}
                          onChange={(e) => setTestRequest(e.target.value)}
                          placeholder="Enter JSON request body..."
                          rows={6}
                          className="font-mono text-xs"
                        />
                      </div>
                      
                      <Button 
                        onClick={testAPIEndpoint}
                        disabled={loading}
                        className="w-full"
                      >
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Test API Endpoint
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Response Viewer */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-400" />
                    API Response
                  </CardTitle>
                  <CardDescription>
                    View API response and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {testResponse ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(testResponse)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={testResponse}
                        readOnly
                        rows={12}
                        className="font-mono text-xs"
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Terminal className="h-8 w-8 mx-auto mb-2" />
                      <p>Test an API endpoint to see the response</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Third-party APIs */}
          <TabsContent value="third-party">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thirdPartyAPIs.map((api) => (
                <Card key={api.id} className="fire-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {api.name}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        api.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </CardTitle>
                    <CardDescription>by {api.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Version</span>
                      <Badge variant="outline" className="text-xs">{api.version}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Authentication</span>
                      <span className="font-medium text-xs">{api.authentication}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate Limit</span>
                      <span className="font-medium text-xs">{api.rateLimit}</span>
                    </div>
                    <Separator />
                    <div className="text-xs font-mono break-all text-muted-foreground">
                      {api.baseUrl}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={api.documentation} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-3 w-3 mr-1" />
                          Docs
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(api.baseUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Management */}
          <TabsContent value="management">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Key Management */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-green-400" />
                    API Key Management
                  </CardTitle>
                  <CardDescription>
                    Generate and manage API authentication keys
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          readOnly
                          placeholder="Generate an API key"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(apiKey)}
                        disabled={!apiKey}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={generateAPIKey} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                  
                  <Alert className="border-green-500/50 text-green-400">
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Store your API key securely. It provides full access to all VPN functions.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Export & Documentation */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-400" />
                    Export & Documentation
                  </CardTitle>
                  <CardDescription>
                    Download API collections and documentation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportAPICollection} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export API Collection
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Available Formats:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="text-xs justify-center">
                        <FileText className="h-3 w-3 mr-1" />
                        Postman
                      </Badge>
                      <Badge variant="outline" className="text-xs justify-center">
                        <Code className="h-3 w-3 mr-1" />
                        OpenAPI
                      </Badge>
                      <Badge variant="outline" className="text-xs justify-center">
                        <Terminal className="h-3 w-3 mr-1" />
                        cURL
                      </Badge>
                      <Badge variant="outline" className="text-xs justify-center">
                        <FileText className="h-3 w-3 mr-1" />
                        Swagger
                      </Badge>
                    </div>
                  </div>
                  
                  <Alert className="border-blue-500/50 text-blue-400">
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Full API documentation with examples, rate limits, and integration guides.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
