import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  Download, 
  Upload, 
  Key, 
  Database, 
  Trash2, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  BarChart3,
  FileText,
  Settings,
  Play,
  Package
} from "lucide-react";
import { env } from '../utils/security/env-config';
import { DemoDataSeeder, downloadDemoBackup } from '../utils/demo-data-seeder';

interface DataStats {
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

interface ExportData {
  metadata: {
    exportedAt: string;
    version: string;
    source: string;
  };
  summary: {
    totalItems: number;
    categories: Record<string, number>;
  };
  data: any;
}

export function DataTransfer() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState<DataStats | null>(null);
  const [exportData, setExportData] = useState<ExportData | null>(null);
  const [importData, setImportData] = useState('');
  const [overwriteMode, setOverwriteMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const baseUrl = env.app.apiBaseUrl;

  const makeRequest = async (endpoint: string, options: any = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.supabase.anonKey}`,
      ...(apiKey && { 'X-API-Key': apiKey }),
      ...options.headers
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  };

  const generateApiKey = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await makeRequest('/generate-api-key', { method: 'POST' });
      setApiKey(result.apiKey);
      setKeyStatus('valid');
      setSuccess('API key generated successfully! Store it securely.');
    } catch (err: any) {
      setError(err.message);
      setKeyStatus('invalid');
    } finally {
      setLoading(false);
    }
  };

  const verifyApiKey = async () => {
    if (!apiKey) {
      setKeyStatus('invalid');
      setError('Please enter an API key');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await makeRequest('/verify-api-key');
      setKeyStatus('valid');
      setSuccess(`API key verified: ${result.keyPrefix}`);
    } catch (err: any) {
      setKeyStatus('invalid');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDataStats = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await makeRequest('/data-stats');
      setStats(result.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportAllData = async () => {
    try {
      setLoading(true);
      setError('');
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await makeRequest('/export-data');
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setExportData(result);
      setSuccess(`Data exported successfully! ${result.summary.totalItems} items exported.`);
      
      // Auto-download
      const blob = new Blob([JSON.stringify(result, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ijaxt-vpn-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleImportData = async () => {
    if (!importData.trim()) {
      setError('Please paste the backup data');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setProgress(0);
      
      const data = JSON.parse(importData);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const result = await makeRequest('/import-data', {
        method: 'POST',
        body: JSON.stringify({ data, overwrite: overwriteMode })
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setSuccess(`Import completed! ${result.summary.imported} items imported, ${result.summary.skipped} skipped.`);
      
      if (result.errors && result.errors.length > 0) {
        setError(`Some errors occurred: ${result.errors.slice(0, 3).join(', ')}`);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const clearAllData = async () => {
    if (!window.confirm('⚠️ This will permanently delete ALL data! Type "DELETE_ALL_DATA" to confirm.')) {
      return;
    }
    
    const confirmation = window.prompt('Type "DELETE_ALL_DATA" to confirm:');
    if (confirmation !== 'DELETE_ALL_DATA') {
      setError('Confirmation failed. Data not deleted.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await makeRequest('/clear-data', {
        method: 'DELETE',
        body: JSON.stringify({ confirm: 'DELETE_ALL_DATA' })
      });
      
      setSuccess(`All data cleared successfully! ${result.deletedCount} items deleted.`);
      setStats(null);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    try {
      setLoading(true);
      setError('');
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 300);

      const result = await makeRequest('/seed-demo-data', { method: 'POST' });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setSuccess(`Demo data seeded successfully! ${result.seeded} items added.`);
      
      if (result.errors > 0) {
        setError(`Some errors occurred during seeding: ${result.errors} errors`);
      }
      
      // Refresh stats
      await getDataStats();
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
  };

  useEffect(() => {
    if (keyStatus === 'valid') {
      getDataStats();
    }
  }, [keyStatus]);

  return (
    <div className="min-h-screen bg-background p-6 fire-effect">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="alfa-slab-heading text-4xl mb-4 fire-text">
            Ijaxt VPN Data Transfer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Secure backup, transfer, and management system for your VPN data.
            Generate API keys and manage your data with enterprise-grade security.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 border-green-500/50 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Demo
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          {/* API Key Setup */}
          <TabsContent value="setup">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  API Key Management
                </CardTitle>
                <CardDescription>
                  Generate or verify your API key for secure data operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Badge variant={keyStatus === 'valid' ? 'default' : keyStatus === 'invalid' ? 'destructive' : 'secondary'}>
                      {keyStatus === 'valid' ? 'Valid' : keyStatus === 'invalid' ? 'Invalid' : 'Unknown'}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        id="api-key"
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key or generate a new one"
                        className="pr-20"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="h-6 w-6 p-0"
                        >
                          {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        {apiKey && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={verifyApiKey} 
                      variant="outline"
                      disabled={loading || !apiKey}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Generate New API Key</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a new API key for data transfer operations. This will replace any existing key.
                    </p>
                    <Button 
                      onClick={generateApiKey} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Key className="h-4 w-4 mr-2" />
                      )}
                      Generate New API Key
                    </Button>
                  </div>
                </div>

                {keyStatus === 'valid' && (
                  <Alert className="border-green-500/50 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      API key is valid and ready for data operations!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Statistics */}
          <TabsContent value="stats">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Data Statistics
                </CardTitle>
                <CardDescription>
                  Overview of your current data storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {keyStatus !== 'valid' ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please verify your API key in the Setup tab to view statistics.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Total Items</h3>
                        <p className="text-3xl font-bold text-primary">
                          {stats?.totalItems || 0}
                        </p>
                      </div>
                      <Button onClick={getDataStats} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>

                    {stats && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.entries(stats.categories).map(([category, count]) => (
                          <div key={category} className="p-4 rounded-lg bg-muted/20 border border-border">
                            <div className="text-sm text-muted-foreground capitalize">
                              {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                            <div className="text-2xl font-bold text-primary">{count}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {stats && (
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(stats.lastUpdated).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Data */}
          <TabsContent value="export">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  Export Data
                </CardTitle>
                <CardDescription>
                  Download a complete backup of all your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {keyStatus !== 'valid' ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please verify your API key in the Setup tab to export data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    {progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Exporting data...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )}

                    <Button 
                      onClick={exportAllData} 
                      disabled={loading}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-5 w-5 mr-2" />
                      )}
                      Export All Data
                    </Button>

                    {exportData && (
                      <div className="space-y-4 p-4 bg-muted/20 rounded-lg border">
                        <h3 className="font-medium text-primary">Export Summary</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Total Items:</span>
                            <div className="font-bold">{exportData.summary.totalItems}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Export Date:</span>
                            <div className="font-bold">
                              {new Date(exportData.metadata.exportedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {Object.entries(exportData.summary.categories).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span className="font-bold">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Import Data */}
          <TabsContent value="import">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Import Data
                </CardTitle>
                <CardDescription>
                  Restore data from a backup file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {keyStatus !== 'valid' ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please verify your API key in the Setup tab to import data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="overwrite"
                          checked={overwriteMode}
                          onChange={(e) => setOverwriteMode(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="overwrite" className="text-sm">
                          Overwrite existing data
                        </Label>
                      </div>
                      
                      <Alert className="border-yellow-500/50 text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {overwriteMode 
                            ? "Overwrite mode: Existing data will be replaced with imported data."
                            : "Safe mode: Only new data will be imported, existing data will be preserved."
                          }
                        </AlertDescription>
                      </Alert>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="import-data">Backup Data (JSON)</Label>
                      <Textarea
                        id="import-data"
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste your backup JSON data here..."
                        rows={10}
                        className="font-mono text-xs"
                      />
                    </div>

                    {progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Importing data...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )}

                    <Button 
                      onClick={handleImportData} 
                      disabled={loading || !importData.trim()}
                      className="w-full"
                      size="lg"
                    >
                      {loading ? (
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-5 w-5 mr-2" />
                      )}
                      Import Data
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Data */}
          <TabsContent value="demo">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Demo Data
                </CardTitle>
                <CardDescription>
                  Test the system with sample data or download demo backup files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Demo Data Information */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-primary">Demo Data Package</h3>
                    <div className="p-4 bg-muted/20 rounded-lg border">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Items:</span>
                          <span className="font-bold">{DemoDataSeeder.getDemoDataStats().total}</span>
                        </div>
                        <div className="space-y-1">
                          {Object.entries(DemoDataSeeder.getDemoDataStats().categories).map(([category, count]) => (
                            <div key={category} className="flex justify-between text-xs">
                              <span className="text-muted-foreground capitalize">
                                {category.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span>{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="border-blue-500/50 text-blue-400">
                      <Package className="h-4 w-4" />
                      <AlertDescription>
                        Demo data includes sample VPN stats, IMSI pools, IoT devices, security events, and system configurations.
                      </AlertDescription>
                    </Alert>
                  </div>

                  {/* Demo Actions */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-primary">Demo Actions</h3>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={downloadDemoBackup}
                        className="w-full"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Demo Backup
                      </Button>
                      
                      <Button 
                        onClick={() => {
                          const demoData = DemoDataSeeder.generateDemoBackupData();
                          setImportData(JSON.stringify(demoData, null, 2));
                          setSuccess('Demo data loaded into import field! Switch to Import tab to proceed.');
                        }}
                        className="w-full"
                        variant="outline"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Load Demo Data for Import
                      </Button>

                      {keyStatus === 'valid' && (
                        <>
                          <Separator />
                          
                          {progress > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Seeding demo data...</span>
                                <span>{progress}%</span>
                              </div>
                              <Progress value={progress} className="w-full" />
                            </div>
                          )}

                          <Button 
                            onClick={seedDemoData}
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? (
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Seed Demo Data to Database
                          </Button>
                          
                          <Alert className="border-blue-500/50 text-blue-400">
                            <Play className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              This will add sample data directly to your database for testing the system features.
                            </AlertDescription>
                          </Alert>
                        </>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Demo Data Categories:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-muted/10 rounded border">
                          <div className="font-medium text-green-400">VPN Statistics</div>
                          <div className="text-muted-foreground">Users, connections, data transfer</div>
                        </div>
                        <div className="p-2 bg-muted/10 rounded border">
                          <div className="font-medium text-green-400">IMSI Data</div>
                          <div className="text-muted-foreground">Malaysia IMSI pools, rotation config</div>
                        </div>
                        <div className="p-2 bg-muted/10 rounded border">
                          <div className="font-medium text-green-400">Network Data</div>
                          <div className="text-muted-foreground">Optimization, stealer config</div>
                        </div>
                        <div className="p-2 bg-muted/10 rounded border">
                          <div className="font-medium text-green-400">IoT Devices</div>
                          <div className="text-muted-foreground">Routers, firewalls, bridges</div>
                        </div>
                        <div className="p-2 bg-muted/10 rounded border">
                          <div className="font-medium text-green-400">Security Events</div>
                          <div className="text-muted-foreground">Threats, intrusions, alerts</div>
                        </div>
                        <div className="p-2 bg-muted/10 rounded border">
                          <div className="font-medium text-green-400">System Config</div>
                          <div className="text-muted-foreground">Version, settings, preferences</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="manage">
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Advanced data management operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {keyStatus !== 'valid' ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please verify your API key in the Setup tab to manage data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    <Alert className="border-destructive/50 text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Danger Zone:</strong> These operations cannot be undone. 
                        Make sure to export your data before performing destructive operations.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="p-4 border border-destructive/50 rounded-lg">
                        <h3 className="font-medium text-destructive mb-2">Clear All Data</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This will permanently delete all stored data except your API key. 
                          This action cannot be undone.
                        </p>
                        <Button 
                          onClick={clearAllData} 
                          disabled={loading}
                          variant="destructive"
                          className="w-full"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear All Data
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}