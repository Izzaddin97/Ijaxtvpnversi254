import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import { 
  Cpu, 
  Wifi, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Zap,
  TrendingUp,
  Globe,
  Eye,
  Settings,
  Lock
} from "lucide-react";
import { useState, useEffect } from "react";
import { INITIAL_IOT_DEVICES, INITIAL_IOT_STATS, getStatusColor, IoTDevice } from "../utils/iot-constants";

export function IoTDashboard() {
  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_IOT_DEVICES);
  const [networkStats, setNetworkStats] = useState(INITIAL_IOT_STATS);

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoProtect, setAutoProtect] = useState(true);

  // Real-time updates simulation
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setNetworkStats(prev => ({
          ...prev,
          dataTransfer: prev.dataTransfer + Math.floor(Math.random() * 5),
          threatsBlocked: Math.random() > 0.95 ? prev.threatsBlocked + 1 : prev.threatsBlocked
        }));

        setDevices(prev => prev.map(device => ({
          ...device,
          dataUsage: Math.min(300, device.dataUsage + Math.floor(Math.random() * 3)),
          batteryLevel: device.batteryLevel ? Math.max(0, device.batteryLevel - (Math.random() > 0.98 ? 1 : 0)) : undefined,
          temperature: device.temperature ? 20 + Math.random() * 10 : undefined
        })));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const toggleDeviceProtection = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { 
            ...device, 
            isProtected: !device.isProtected,
            security: !device.isProtected ? 'protected' : 'secure'
          }
        : device
    ));
  };

  const getSecurityBadge = (security: string) => {
    switch (security) {
      case 'protected':
        return <Badge className="bg-green-500 text-black">Protected</Badge>;
      case 'secure':
        return <Badge className="bg-blue-500 text-white">Secure</Badge>;
      case 'vulnerable':
        return <Badge className="bg-red-500 text-white">Vulnerable</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Unknown</Badge>;
    }
  };

  return (
    <section id="iot-dashboard" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 fire-text">IoT Security Dashboard</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Comprehensive Internet of Things management with real-time monitoring, 
          device protection, and advanced security controls for your connected devices.
        </p>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 max-w-6xl mx-auto">
        <Card className="fire-card p-4 text-center">
          <Cpu className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text">{networkStats.totalDevices}</div>
          <div className="text-xs text-muted-foreground">Total Devices</div>
        </Card>

        <Card className="fire-card p-4 text-center">
          <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text">{networkStats.onlineDevices}</div>
          <div className="text-xs text-muted-foreground">Online Now</div>
        </Card>

        <Card className="fire-card p-4 text-center">
          <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text">{networkStats.secureDevices}</div>
          <div className="text-xs text-muted-foreground">Protected</div>
        </Card>

        <Card className="fire-card p-4 text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text">{networkStats.dataTransfer}MB</div>
          <div className="text-xs text-muted-foreground">Data Transfer</div>
        </Card>

        <Card className="fire-card p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl fire-text">{networkStats.threatsBlocked}</div>
          <div className="text-xs text-muted-foreground">Threats Blocked</div>
        </Card>
      </div>

      {/* Control Panel */}
      <Card className="fire-card p-6 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-green-400">Network Control Center</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-green-400" />
              <span className="text-sm">Real-time Monitoring</span>
              <Switch checked={isMonitoring} onCheckedChange={setIsMonitoring} />
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm">Auto-Protect New Devices</span>
              <Switch checked={autoProtect} onCheckedChange={setAutoProtect} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <Globe className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg fire-text">Network Status</div>
            <div className="text-sm text-green-400">Fully Secured</div>
          </div>

          <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg fire-text">Firewall</div>
            <div className="text-sm text-green-400">Active & Updated</div>
          </div>

          <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/20">
            <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-lg fire-text">Encryption</div>
            <div className="text-sm text-green-400">AES-256 Active</div>
          </div>
        </div>
      </Card>

      {/* Device List */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-green-400">Connected Devices</h3>
          <Button className="bg-green-600 hover:bg-green-500 text-black">
            <Settings className="w-4 h-4 mr-2" />
            Manage Devices
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {devices.map((device) => {
            const IconComponent = device.icon;
            
            return (
              <Card key={device.id} className="fire-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-lg text-green-400">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">{device.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSecurityBadge(device.security)}
                    <div className={`w-3 h-3 rounded-full ${
                      device.status === 'online' ? 'bg-green-400' : 
                      device.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={getStatusColor(device.status)}>
                      {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span className="text-green-400">{device.lastSeen}</span>
                  </div>
                  {device.batteryLevel && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Battery:</span>
                      <span className="text-green-400">{device.batteryLevel}%</span>
                    </div>
                  )}
                  {device.temperature && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span className="text-green-400">{device.temperature.toFixed(1)}°C</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Usage:</span>
                    <span className="text-green-400">{device.dataUsage}MB</span>
                  </div>
                  <Progress value={(device.dataUsage / 300) * 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-muted-foreground">VPN Protection:</span>
                  </div>
                  <Switch
                    checked={device.isProtected}
                    onCheckedChange={() => toggleDeviceProtection(device.id)}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Security Alerts */}
      <Card className="fire-card p-6 mt-8 max-w-6xl mx-auto">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-green-400 mr-2" />
          <h3 className="text-xl text-green-400">Security Alerts & Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-sm">All critical devices are protected with VPN encryption</span>
            </div>
            <Badge className="bg-green-500 text-black text-xs">Secure</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm">Smart TV has vulnerable firmware - Update recommended</span>
            </div>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-400 text-black">
              Update
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm">Network performance optimal - 23 threats blocked today</span>
            </div>
            <Badge className="bg-blue-500 text-white text-xs">Info</Badge>
          </div>
        </div>
      </Card>
    </section>
  );
}