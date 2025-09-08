import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { 
  Globe, 
  Server, 
  Shield, 
  Zap, 
  Network,
  Database,
  Lock,
  Key,
  Activity,
  CheckCircle,
  AlertTriangle,
  Layers,
  Router,
  Cloud,
  Monitor,
  Wifi,
  Settings
} from "lucide-react";

interface ProtocolStats {
  layer7: {
    http: { requests: number; status: string; performance: number };
    https: { requests: number; status: string; performance: number };
    websocket: { connections: number; status: string; latency: number };
    rest: { endpoints: number; status: string; uptime: number };
    graphql: { queries: number; status: string; cacheHit: number };
  };
  layer4: {
    tcp: { connections: number; status: string; reliability: number };
    udp: { packets: number; status: string; speed: number };
    tls: { handshakes: number; status: string; encryption: string };
    quic: { streams: number; status: string; latency: number };
  };
}

interface HypermediaSystem {
  endpoints: {
    id: string;
    name: string;
    method: string;
    path: string;
    status: string;
    responseTime: number;
    cacheStatus: string;
  }[];
  resources: {
    id: string;
    type: string;
    uri: string;
    relations: string[];
    state: string;
  }[];
}

export function HTTPProtocolSystem() {
  const [stats, setStats] = useState<ProtocolStats | null>(null);
  const [hypermedia, setHypermedia] = useState<HypermediaSystem | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState("http");
  const [systemHealth, setSystemHealth] = useState(95);

  // Mock data generation for demo purposes
  const generateMockStats = (): ProtocolStats => {
    return {
      layer7: {
        http: {
          requests: Math.floor(Math.random() * 10000) + 5000,
          status: "active",
          performance: Math.floor(Math.random() * 30) + 85
        },
        https: {
          requests: Math.floor(Math.random() * 15000) + 8000,
          status: "active",
          performance: Math.floor(Math.random() * 25) + 90
        },
        websocket: {
          connections: Math.floor(Math.random() * 500) + 200,
          status: "active",
          latency: Math.floor(Math.random() * 50) + 10
        },
        rest: {
          endpoints: 24,
          status: "active",
          uptime: 99.8
        },
        graphql: {
          queries: Math.floor(Math.random() * 2000) + 1000,
          status: "active",
          cacheHit: Math.floor(Math.random() * 40) + 60
        }
      },
      layer4: {
        tcp: {
          connections: Math.floor(Math.random() * 1000) + 500,
          status: "active",
          reliability: 99.9
        },
        udp: {
          packets: Math.floor(Math.random() * 50000) + 25000,
          status: "active",
          speed: Math.floor(Math.random() * 500) + 800
        },
        tls: {
          handshakes: Math.floor(Math.random() * 5000) + 2000,
          status: "active",
          encryption: "TLS 1.3"
        },
        quic: {
          streams: Math.floor(Math.random() * 300) + 150,
          status: "active",
          latency: Math.floor(Math.random() * 20) + 5
        }
      }
    };
  };

  const generateMockHypermedia = (): HypermediaSystem => {
    return {
      endpoints: [
        { id: "1", name: "VPN Connect", method: "POST", path: "/api/v1/vpn/connect", status: "healthy", responseTime: 45, cacheStatus: "miss" },
        { id: "2", name: "User Auth", method: "POST", path: "/api/v1/auth/login", status: "healthy", responseTime: 120, cacheStatus: "hit" },
        { id: "3", name: "Server List", method: "GET", path: "/api/v1/servers", status: "healthy", responseTime: 25, cacheStatus: "hit" },
        { id: "4", name: "IMSI Pool", method: "GET", path: "/api/v1/imsi/pool", status: "healthy", responseTime: 35, cacheStatus: "miss" },
        { id: "5", name: "IoT Devices", method: "GET", path: "/api/v1/iot/devices", status: "warning", responseTime: 180, cacheStatus: "expired" },
        { id: "6", name: "Security Scan", method: "POST", path: "/api/v1/security/scan", status: "healthy", responseTime: 95, cacheStatus: "miss" }
      ],
      resources: [
        { id: "1", type: "vpn-connection", uri: "/vpn/connections/active", relations: ["self", "disconnect", "status"], state: "connected" },
        { id: "2", type: "user-session", uri: "/users/sessions/current", relations: ["self", "refresh", "logout"], state: "authenticated" },
        { id: "3", type: "server-pool", uri: "/servers/pool/available", relations: ["self", "connect", "stats"], state: "available" },
        { id: "4", type: "imsi-allocation", uri: "/imsi/allocations/current", relations: ["self", "rotate", "release"], state: "allocated" },
        { id: "5", type: "iot-network", uri: "/iot/networks/secure", relations: ["self", "scan", "configure"], state: "monitoring" }
      ]
    };
  };

  const refreshStats = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStats(generateMockStats());
    setHypermedia(generateMockHypermedia());
    setSystemHealth(Math.floor(Math.random() * 10) + 90);
    setLoading(false);
  };

  useEffect(() => {
    refreshStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case "http": return <Globe className="h-4 w-4" />;
      case "https": return <Shield className="h-4 w-4" />;
      case "websocket": return <Zap className="h-4 w-4" />;
      case "tcp": return <Network className="h-4 w-4" />;
      case "udp": return <Wifi className="h-4 w-4" />;
      case "tls": return <Lock className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "healthy": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section className="py-20 fire-effect" id="http-protocols">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">
            HTTP Protocol Infrastructure
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Advanced Layer 7 (OSI) and Layer 4 (TCP/IP) protocol management for distributed hypermedia systems. 
            Real-time monitoring and optimization of HTTP, HTTPS, WebSocket, TCP, UDP, and TLS protocols.
          </p>
        </div>

        {/* System Health Overview */}
        <Card className="fire-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-green-400" />
              System Health Overview
              <Badge variant={systemHealth > 95 ? "default" : systemHealth > 85 ? "secondary" : "destructive"}>
                {systemHealth}% Healthy
              </Badge>
            </CardTitle>
            <CardDescription>
              Real-time distributed hypermedia system status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Overall System Performance</span>
              <Button onClick={refreshStats} variant="outline" size="sm" disabled={loading}>
                <Activity className="h-4 w-4 mr-2" />
                {loading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
            <Progress value={systemHealth} className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Protocols Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Hypermedia Links</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>RESTful APIs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Cache Efficiency</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="layer7" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layer7" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Layer 7 (Application)
            </TabsTrigger>
            <TabsTrigger value="layer4" className="flex items-center gap-2">
              <Router className="h-4 w-4" />
              Layer 4 (Transport)
            </TabsTrigger>
            <TabsTrigger value="hypermedia" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Hypermedia System
            </TabsTrigger>
          </TabsList>

          {/* Layer 7 Protocols */}
          <TabsContent value="layer7">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats?.layer7 && Object.entries(stats.layer7).map(([protocol, data]) => (
                <Card key={protocol} className="fire-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        {getProtocolIcon(protocol)}
                        {protocol.toUpperCase()}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)}`}></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {protocol === "http" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Requests</span>
                          <span className="font-medium">{data.requests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="font-medium">{data.performance}%</span>
                        </div>
                        <Progress value={data.performance} className="h-2" />
                      </>
                    )}
                    
                    {protocol === "https" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Secure Requests</span>
                          <span className="font-medium">{data.requests.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">SSL Performance</span>
                          <span className="font-medium">{data.performance}%</span>
                        </div>
                        <Progress value={data.performance} className="h-2" />
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          TLS 1.3 Encrypted
                        </Badge>
                      </>
                    )}
                    
                    {protocol === "websocket" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active Connections</span>
                          <span className="font-medium">{data.connections}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Latency</span>
                          <span className="font-medium">{data.latency}ms</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Real-time
                        </Badge>
                      </>
                    )}
                    
                    {protocol === "rest" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Endpoints</span>
                          <span className="font-medium">{data.endpoints}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Uptime</span>
                          <span className="font-medium">{data.uptime}%</span>
                        </div>
                        <Progress value={data.uptime} className="h-2" />
                      </>
                    )}
                    
                    {protocol === "graphql" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Queries</span>
                          <span className="font-medium">{data.queries.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cache Hit Rate</span>
                          <span className="font-medium">{data.cacheHit}%</span>
                        </div>
                        <Progress value={data.cacheHit} className="h-2" />
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Layer 4 Protocols */}
          <TabsContent value="layer4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats?.layer4 && Object.entries(stats.layer4).map(([protocol, data]) => (
                <Card key={protocol} className="fire-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        {getProtocolIcon(protocol)}
                        {protocol.toUpperCase()}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(data.status)}`}></div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {protocol === "tcp" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active Connections</span>
                          <span className="font-medium">{data.connections}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Reliability</span>
                          <span className="font-medium">{data.reliability}%</span>
                        </div>
                        <Progress value={data.reliability} className="h-2" />
                        <Badge variant="outline" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connection-oriented
                        </Badge>
                      </>
                    )}
                    
                    {protocol === "udp" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Packets/sec</span>
                          <span className="font-medium">{data.packets.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Speed</span>
                          <span className="font-medium">{data.speed} Mbps</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Connectionless
                        </Badge>
                      </>
                    )}
                    
                    {protocol === "tls" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Handshakes</span>
                          <span className="font-medium">{data.handshakes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Protocol</span>
                          <span className="font-medium">{data.encryption}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          256-bit Encryption
                        </Badge>
                      </>
                    )}
                    
                    {protocol === "quic" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active Streams</span>
                          <span className="font-medium">{data.streams}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Latency</span>
                          <span className="font-medium">{data.latency}ms</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          HTTP/3 Ready
                        </Badge>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hypermedia System */}
          <TabsContent value="hypermedia">
            <div className="space-y-6">
              {/* API Endpoints */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-400" />
                    RESTful API Endpoints
                  </CardTitle>
                  <CardDescription>
                    Distributed hypermedia system endpoints with HATEOAS support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hypermedia?.endpoints.map((endpoint) => (
                      <div key={endpoint.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {endpoint.method}
                          </Badge>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                          <span className="text-sm text-muted-foreground">{endpoint.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={endpoint.cacheStatus === "hit" ? "default" : "secondary"} className="text-xs">
                            {endpoint.cacheStatus}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{endpoint.responseTime}ms</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(endpoint.status)}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Hypermedia Resources */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-green-400" />
                    Hypermedia Resources
                  </CardTitle>
                  <CardDescription>
                    Self-describing resources with navigational links (HATEOAS)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hypermedia?.resources.map((resource) => (
                      <div key={resource.id} className="p-3 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                            <span className="font-mono text-sm">{resource.uri}</span>
                          </div>
                          <Badge variant={resource.state === "connected" || resource.state === "authenticated" ? "default" : "secondary"} className="text-xs">
                            {resource.state}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {resource.relations.map((relation, index) => (
                            <Badge key={index} variant="outline" className="text-xs opacity-70">
                              rel:{relation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Protocol Information */}
        <Alert className="mt-8 border-green-500/50 text-green-400">
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <strong>Distributed Hypermedia System:</strong> This infrastructure supports REST architectural constraints, 
            HATEOAS (Hypermedia as the Engine of Application State), content negotiation, and stateless communication 
            across Layer 7 and Layer 4 protocols for optimal VPN service delivery.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}