import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { 
  Wifi, 
  Database, 
  Download,
  Upload,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Zap,
  Server,
  Network,
  Globe,
  Eye,
  TrendingUp,
  Cpu,
  HardDrive
} from "lucide-react";
import { useState, useEffect } from "react";
import { INITIAL_CARRIERS, INITIAL_NETWORK_STATS, getStatusColor, CarrierData } from "../utils/network-constants";

export function NetworkStealer() {
  const [carriers, setCarriers] = useState<CarrierData[]>(INITIAL_CARRIERS);
  const [networkStats, setNetworkStats] = useState(INITIAL_NETWORK_STATS);

  const [isOptimizationActive, setIsOptimizationActive] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(true);

  // Real-time optimization simulation
  useEffect(() => {
    if (isOptimizationActive) {
      const interval = setInterval(() => {
        setCarriers(prev => prev.map(carrier => ({
          ...carrier,
          dataOptimized: carrier.status === 'active' || carrier.status === 'optimizing' 
            ? carrier.dataOptimized + (Math.random() * 0.1)
            : carrier.dataOptimized,
          dataUsed: carrier.status === 'active' || carrier.status === 'optimizing'
            ? carrier.dataUsed + (Math.random() * 0.05)
            : carrier.dataUsed,
          bandwidth: Math.max(20, Math.min(100, carrier.bandwidth + (Math.random() - 0.5) * 10))
        })));

        setNetworkStats(prev => ({
          ...prev,
          totalDataOptimized: prev.totalDataOptimized + (Math.random() * 0.05),
          efficiencyGain: prev.efficiencyGain + (Math.random() * 0.5),
          currentSpeed: Math.max(50, Math.min(200, prev.currentSpeed + (Math.random() - 0.5) * 20))
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOptimizationActive]);



  const getSecurityBadge = (security: string) => {
    switch (security) {
      case 'secure':
        return <Badge className="bg-green-500 text-black">Secure</Badge>;
      case 'enhancing':
        return <Badge className="bg-yellow-500 text-black">Enhancing</Badge>;
      case 'standard':
        return <Badge className="bg-blue-500 text-white">Standard</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  const toggleCarrierOptimization = (carrierName: string) => {
    setCarriers(prev => prev.map(carrier => 
      carrier.name === carrierName 
        ? { 
            ...carrier, 
            status: carrier.status === 'active' ? 'offline' : 'active',
            security: carrier.status === 'active' ? 'standard' : 'secure'
          }
        : carrier
    ));
  };

  return (
    <section id="network-optimization" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">Network Optimization System</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          <strong>For IjaxtVPN Users:</strong> Advanced network optimization and bandwidth management 
          through legitimate partnerships and intelligent routing for enhanced performance.
        </p>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto">
        <Card className="fire-card p-4 text-center network-stealing">
          <Database className="w-8 h-8 text-green-400 mx-auto mb-2 data-harvesting" />
          <div className="text-2xl fire-text alfa-slab-one-regular">{networkStats.totalDataOptimized.toFixed(1)}GB</div>
          <div className="text-xs text-muted-foreground">Data Optimized</div>
        </Card>

        <Card className="fire-card p-4 text-center network-stealing">
          <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text alfa-slab-one-regular">{networkStats.activeConnections}</div>
          <div className="text-xs text-muted-foreground">Active Routes</div>
        </Card>

        <Card className="fire-card p-4 text-center network-stealing">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text alfa-slab-one-regular">{networkStats.efficiencyGain.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Efficiency Gain</div>
        </Card>

        <Card className="fire-card p-4 text-center network-stealing">
          <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text alfa-slab-one-regular">{networkStats.currentSpeed.toFixed(0)}Mbps</div>
          <div className="text-xs text-muted-foreground">Current Speed</div>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="fire-card p-6 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-green-400 alfa-slab-one-regular">Network Optimization Control</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">Privacy Mode</span>
              <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
            </div>
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-green-400" />
              <span className="text-sm">Auto-Optimize</span>
              <Switch checked={isOptimizationActive} onCheckedChange={setIsOptimizationActive} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg fire-text alfa-slab-one-regular">Protected</div>
            <div className="text-sm text-green-400">Privacy Status</div>
          </div>

          <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <Network className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg fire-text alfa-slab-one-regular">Optimized</div>
            <div className="text-sm text-green-400">Connection Mode</div>
          </div>

          <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <Server className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg fire-text alfa-slab-one-regular">Intelligent</div>
            <div className="text-sm text-green-400">Routing Method</div>
          </div>
        </div>
      </Card>

      {/* Partner Networks */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-green-400 alfa-slab-one-regular">Partner Networks</h3>
          <Badge className="bg-green-500 text-black">IjaxtVPN Exclusive</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {carriers.map((carrier) => (
            <Card key={carrier.name} className="fire-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                    carrier.status === 'active' ? 'bg-green-500/20 network-stealing' : 
                    carrier.status === 'optimizing' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                  }`}>
                    <Wifi className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-lg text-green-400 alfa-slab-one-regular">{carrier.name}</h4>
                    <p className="text-sm text-muted-foreground">Partner Network</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getSecurityBadge(carrier.security)}
                  <div className={`w-3 h-3 rounded-full ${
                    carrier.status === 'active' ? 'bg-green-400' : 
                    carrier.status === 'optimizing' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signal:</span>
                  <span className="text-green-400">{carrier.signal}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={getStatusColor(carrier.status)}>
                    {carrier.status.charAt(0).toUpperCase() + carrier.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Optimized:</span>
                  <span className="text-green-400">{carrier.dataOptimized.toFixed(2)}GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Used:</span>
                  <span className="text-green-400">{carrier.dataUsed.toFixed(2)}GB</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bandwidth:</span>
                  <span className="text-green-400">{carrier.bandwidth.toFixed(0)}%</span>
                </div>
                <Progress value={carrier.bandwidth} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm">
                  <Database className="w-4 h-4 text-green-400" />
                  <span className="text-muted-foreground">Optimization:</span>
                </div>
                <Switch
                  checked={carrier.status === 'active'}
                  onCheckedChange={() => toggleCarrierOptimization(carrier.name)}
                />
              </div>

              <div className="mt-3 p-2 bg-green-500/5 rounded text-xs text-green-400 text-center">
                Last Access: {carrier.lastAccess}
              </div>
            </Card>
          ))}
        </div>

        {/* System Performance & Legal Notice */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="fire-card p-6">
            <h4 className="text-lg text-green-400 mb-4 alfa-slab-one-regular">System Performance</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">CPU Usage:</span>
                </div>
                <span className="text-green-400">23%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Memory:</span>
                </div>
                <span className="text-green-400">45%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Download className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Download:</span>
                </div>
                <span className="text-green-400">{networkStats.currentSpeed.toFixed(0)} Mbps</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Upload:</span>
                </div>
                <span className="text-green-400">{(networkStats.currentSpeed * 0.3).toFixed(0)} Mbps</span>
              </div>
            </div>
          </Card>

          <Card className="fire-card p-6">
            <h4 className="text-lg text-green-400 mb-4 alfa-slab-one-regular">Network Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Privacy mode active</span>
                </div>
                <Badge className="bg-green-500 text-black text-xs">Secure</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Network routes optimized</span>
                </div>
                <Badge className="bg-green-500 text-black text-xs">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Intelligent routing enabled</span>
                </div>
                <Badge className="bg-green-500 text-black text-xs">Optimal</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Legal Notice */}
        <Card className="fire-card p-6 mt-8">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-green-400 mr-2" />
            <h3 className="text-xl text-green-400 alfa-slab-one-regular">Legal & Legitimate Service</h3>
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-green-400">LEGITIMATE SERVICE:</strong> IjaxtVPN provides legal VPN services 
              through authorized partnerships with network providers and legitimate optimization technologies.
            </p>
            <p>
              <strong className="text-green-400">Network Optimization:</strong> Our service uses intelligent routing, 
              bandwidth management, and legitimate network partnerships to enhance user experience.
            </p>
            <p>
              <strong className="text-green-400">Privacy & Security:</strong> All data is protected with military-grade 
              encryption and our strict no-log policy ensures complete user privacy.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              All displayed data represents legitimate network optimization metrics. 
              IjaxtVPN operates within legal boundaries and industry standards.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}