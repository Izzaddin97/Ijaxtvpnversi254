import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Shield,
  Eye,
  BarChart3,
  Network,
  Server
} from "lucide-react";
import { fetchLCIData, checkAPIHealth } from "../utils/api-client";
import { toast } from "sonner@2.0.3";

interface LCIData {
  id: string;
  status: string;
  timestamp: string;
  metrics?: {
    connections: number;
    throughput: string;
    latency: string;
    uptime: string;
  };
  security?: {
    threatsBlocked: number;
    encryptionLevel: string;
    activeTunnels: number;
  };
  network?: {
    servers: number;
    countries: number;
    totalBandwidth: string;
  };
}

export function LCIDataViewer() {
  const [lciData, setLciData] = useState<LCIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiHealth, setApiHealth] = useState<{ healthy: boolean; message?: string } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Check API health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  // Auto refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadLCIData(false); // Silent refresh
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const checkHealth = async () => {
    try {
      const health = await checkAPIHealth();
      setApiHealth(health);
      
      if (!health.healthy) {
        toast.error('API service is unavailable');
      }
    } catch (err: any) {
      setApiHealth({ healthy: false, message: err.message });
    }
  };

  const loadLCIData = async (showToast = true) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchLCIData();
      
      if (result.success && result.data) {
        setLciData(result.data);
        setLastUpdated(new Date());
        
        if (showToast) {
          toast.success('LCI data updated successfully');
        }
      } else {
        throw new Error(result.error || 'Failed to fetch LCI data');
      }
    } catch (err: any) {
      setError(err.message);
      if (showToast) {
        toast.error('Failed to load LCI data: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.info(autoRefresh ? 'Auto-refresh disabled' : 'Auto-refresh enabled');
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-green-500/50 text-green-400">
            <Database className="mr-2 h-4 w-4" />
            LCI Integration
          </Badge>
          <h2 className="text-4xl alfa-slab-one-regular fire-text mb-4">
            Live Connection Intelligence
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real-time network data and performance metrics from our LCI system
          </p>
        </div>

        {/* API Health Status */}
        <Card className="fire-card mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Server className="h-5 w-5" />
                API Status
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={checkHealth}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Check
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {apiHealth ? (
              <div className="flex items-center gap-3">
                {apiHealth.healthy ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                )}
                <span className={apiHealth.healthy ? 'text-green-400' : 'text-red-400'}>
                  {apiHealth.healthy ? 'API Online' : 'API Offline'}
                </span>
                {apiHealth.message && (
                  <span className="text-muted-foreground text-sm">
                    - {apiHealth.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-green-400" />
                <span className="text-muted-foreground">Checking API status...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="fire-card mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-green-400">Data Controls</h3>
                {lastUpdated && (
                  <p className="text-sm text-muted-foreground">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoRefresh}
                  className={`border-green-500/50 hover:bg-green-500/10 ${
                    autoRefresh ? 'text-green-400 bg-green-500/10' : 'text-green-400'
                  }`}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                  Auto Refresh
                </Button>
                <Button
                  onClick={() => loadLCIData()}
                  disabled={isLoading || !apiHealth?.healthy}
                  className="bg-green-600 hover:bg-green-500 text-black"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="mr-2 h-4 w-4" />
                  )}
                  Load Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="border-red-500/50 text-red-400 mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* LCI Data Display */}
        {lciData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Metrics Card */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <BarChart3 className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Real-time connection performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      {lciData.metrics?.connections.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Throughput</span>
                    <span className="font-mono text-green-400">{lciData.metrics?.throughput}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Latency</span>
                    <span className="font-mono text-green-400">{lciData.metrics?.latency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="font-mono text-green-400">{lciData.metrics?.uptime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
                <CardDescription>Network security overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Threats Blocked</span>
                    <Badge variant="outline" className="border-red-500/50 text-red-400">
                      {lciData.security?.threatsBlocked}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Encryption</span>
                    <span className="font-mono text-green-400">{lciData.security?.encryptionLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Tunnels</span>
                    <span className="font-mono text-green-400">{lciData.security?.activeTunnels}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/50">
                      Protected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Card */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Network className="h-5 w-5" />
                  Network Infrastructure
                </CardTitle>
                <CardDescription>Global network capacity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Servers</span>
                    <span className="font-mono text-green-400">{lciData.network?.servers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Countries</span>
                    <span className="font-mono text-green-400">{lciData.network?.countries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Bandwidth</span>
                    <span className="font-mono text-green-400">{lciData.network?.totalBandwidth}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Load Balancing</span>
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/50">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="fire-card">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No LCI Data Available</h3>
                <p className="text-muted-foreground mb-6">
                  Click "Load Data" to fetch the latest information from our LCI system
                </p>
                <Button
                  onClick={() => loadLCIData()}
                  disabled={isLoading || !apiHealth?.healthy}
                  className="bg-green-600 hover:bg-green-500 text-black"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Database className="mr-2 h-4 w-4" />
                  )}
                  Load LCI Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raw Data Viewer */}
        {lciData && (
          <Card className="fire-card mt-8">
            <CardHeader>
              <CardTitle className="text-green-400">Raw Data</CardTitle>
              <CardDescription>
                Complete LCI data response for debugging and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40 w-full">
                <pre className="text-xs font-mono bg-muted/20 p-4 rounded border text-green-400/80">
                  {JSON.stringify(lciData, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
