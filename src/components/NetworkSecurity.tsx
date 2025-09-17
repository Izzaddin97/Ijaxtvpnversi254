import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Wifi,
  Globe,
  Server,
  AlertTriangle,
  CheckCircle,
  Fingerprint,
  Key,
  Zap,
  Activity,
  Database,
  Network,
  Cpu,
  HardDrive
} from "lucide-react";
import { useState, useEffect } from "react";

export function NetworkSecurity() {
  const [securitySettings, setSecuritySettings] = useState({
    firewallEnabled: true,
    intrusionDetection: true,
    dnsFiltering: true,
    dataEncryption: true,
    anonymousMode: true,
    killSwitch: true,
    autoConnect: false,
    splitTunneling: true,
    malwareProtection: true,
    adBlocking: true,
    trackingProtection: true,
    leakProtection: true
  });

  const [securityMetrics, setSecurityMetrics] = useState({
    encryptionLevel: 256,
    connectionSpeed: 'Fast',
    serverLocation: 'Anonymous',
    protocolUsed: 'WireGuard',
    dataTransferred: '2.4GB',
    threatsBlocked: 45,
    adsBlocked: 234,
    trackersBlocked: 89
  });

  const [realTimeData, setRealTimeData] = useState({
    activeThreat: false,
    cpuUsage: 23,
    memoryUsage: 45,
    networkLoad: 67,
    encryptionRate: 99.9
  });

  // Real-time monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeThreat: Math.random() > 0.98,
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        networkLoad: Math.max(30, Math.min(95, prev.networkLoad + (Math.random() - 0.5) * 12)),
        encryptionRate: Math.max(99.5, Math.min(100, 99.9 + (Math.random() - 0.5) * 0.2))
      }));

      setSecurityMetrics(prev => ({
        ...prev,
        threatsBlocked: Math.random() > 0.95 ? prev.threatsBlocked + 1 : prev.threatsBlocked,
        adsBlocked: Math.random() > 0.92 ? prev.adsBlocked + Math.floor(Math.random() * 3) : prev.adsBlocked,
        trackersBlocked: Math.random() > 0.94 ? prev.trackersBlocked + 1 : prev.trackersBlocked
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleSetting = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const getSecurityScore = () => {
    const enabledCount = Object.values(securitySettings).filter(Boolean).length;
    return Math.round((enabledCount / Object.keys(securitySettings).length) * 100);
  };

  const securityScore = getSecurityScore();

  return (
    <section id="network-security" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 fire-text">Network Security Center</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Advanced privacy and security controls with real-time monitoring, threat detection, 
          and comprehensive protection for all your network activities.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Security Score Card */}
            <Card className="fire-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-green-400">Security Status</h3>
                <div className="text-center">
                  <div className={`text-3xl fire-text ${securityScore >= 80 ? 'text-green-400' : securityScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {securityScore}%
                  </div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">AES-{securityMetrics.encryptionLevel}</div>
                  <div className="text-xs text-muted-foreground">Encryption</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{securityMetrics.connectionSpeed}</div>
                  <div className="text-xs text-muted-foreground">Connection</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Server className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{securityMetrics.protocolUsed}</div>
                  <div className="text-xs text-muted-foreground">Protocol</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{securityMetrics.serverLocation}</div>
                  <div className="text-xs text-muted-foreground">Location</div>
                </div>
              </div>
            </Card>

            {/* Security Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="fire-card p-6">
                <h4 className="text-lg text-green-400 mb-4">Core Security</h4>
                <div className="space-y-4">
                  {[
                    { key: 'firewallEnabled', label: 'Advanced Firewall', icon: Shield },
                    { key: 'intrusionDetection', label: 'Intrusion Detection', icon: AlertTriangle },
                    { key: 'dnsFiltering', label: 'DNS Filtering', icon: Globe },
                    { key: 'dataEncryption', label: 'Data Encryption', icon: Lock },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <Switch
                        checked={securitySettings[key as keyof typeof securitySettings]}
                        onCheckedChange={() => toggleSetting(key)}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="fire-card p-6">
                <h4 className="text-lg text-green-400 mb-4">Protection Features</h4>
                <div className="space-y-4">
                  {[
                    { key: 'malwareProtection', label: 'Malware Protection', icon: Shield },
                    { key: 'killSwitch', label: 'Kill Switch', icon: Zap },
                    { key: 'leakProtection', label: 'DNS/IP Leak Protection', icon: Eye },
                    { key: 'anonymousMode', label: 'Anonymous Mode', icon: EyeOff },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <Switch
                        checked={securitySettings[key as keyof typeof securitySettings]}
                        onCheckedChange={() => toggleSetting(key)}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="fire-card p-6">
                <h4 className="text-lg text-green-400 mb-4">Privacy Controls</h4>
                <div className="space-y-4">
                  {[
                    { key: 'trackingProtection', label: 'Anti-Tracking', icon: Eye },
                    { key: 'adBlocking', label: 'Ad Blocking', icon: Shield },
                    { key: 'anonymousMode', label: 'Anonymous Browsing', icon: EyeOff },
                    { key: 'splitTunneling', label: 'Split Tunneling', icon: Network },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm">{label}</span>
                      </div>
                      <Switch
                        checked={securitySettings[key as keyof typeof securitySettings]}
                        onCheckedChange={() => toggleSetting(key)}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="fire-card p-6">
                <h4 className="text-lg text-green-400 mb-4">Privacy Statistics</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-500/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Ads Blocked:</span>
                    <span className="text-green-400 fire-text">{securityMetrics.adsBlocked.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-500/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Trackers Blocked:</span>
                    <span className="text-green-400 fire-text">{securityMetrics.trackersBlocked}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-500/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Data Transferred:</span>
                    <span className="text-green-400 fire-text">{securityMetrics.dataTransferred}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-500/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Threats Blocked:</span>
                    <span className="text-green-400 fire-text">{securityMetrics.threatsBlocked}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            {/* Real-time Alerts */}
            <Card className="fire-card p-6">
              <h4 className="text-lg text-green-400 mb-4">Real-time Security Monitoring</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Cpu className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{realTimeData.cpuUsage.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">CPU Usage</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <HardDrive className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{realTimeData.memoryUsage.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Memory</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{realTimeData.networkLoad.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Network Load</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                  <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg fire-text">{realTimeData.encryptionRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Encryption</div>
                </div>
              </div>

              {/* Threat Alert */}
              {realTimeData.activeThreat && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-400">Active Threat Detected</span>
                    <Badge className="ml-2 bg-red-500 text-white">High Priority</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Suspicious network activity blocked automatically. Your connection remains secure.
                  </p>
                </div>
              )}

              {/* Recent Activity */}
              <div className="space-y-2">
                <h5 className="text-sm text-green-400">Recent Security Events</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between p-2 bg-green-500/5 rounded text-sm">
                    <span className="text-muted-foreground">Malware attempt blocked</span>
                    <span className="text-green-400">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-500/5 rounded text-sm">
                    <span className="text-muted-foreground">DNS query filtered</span>
                    <span className="text-green-400">5 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-500/5 rounded text-sm">
                    <span className="text-muted-foreground">Tracker blocked</span>
                    <span className="text-green-400">8 min ago</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="fire-card p-6">
              <h4 className="text-lg text-green-400 mb-4">Advanced Security Settings</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                    <div className="flex items-center">
                      <Key className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">Perfect Forward Secrecy</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                    <div className="flex items-center">
                      <Fingerprint className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">Certificate Pinning</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-sm">Zero-Log Policy</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                    <h5 className="text-sm text-green-400 mb-2">Encryption Details</h5>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cipher:</span>
                        <span className="text-green-400">ChaCha20-Poly1305</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Key Exchange:</span>
                        <span className="text-green-400">X25519</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hash:</span>
                        <span className="text-green-400">BLAKE2s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
