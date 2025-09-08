import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { 
  Terminal, 
  Copy, 
  Download,
  Play,
  Square,
  RotateCcw,
  Settings,
  Code,
  FileText,
  GitBranch,
  Package,
  Zap,
  Globe,
  Shield,
  Database,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

interface CLICommand {
  id: string;
  name: string;
  command: string;
  description: string;
  category: string;
  example: string;
  parameters: { name: string; type: string; required: boolean; description: string }[];
}

interface CLIOutput {
  id: string;
  command: string;
  output: string;
  timestamp: string;
  exitCode: number;
  duration: string;
}

interface ThirdPartyCLI {
  id: string;
  name: string;
  provider: string;
  version: string;
  installation: string;
  documentation: string;
  commands: string[];
  status: string;
}

export function HTTPCLIInterface() {
  const [currentCommand, setCurrentCommand] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [cliHistory, setCLIHistory] = useState<CLIOutput[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeCategory, setActiveCategory] = useState("vpn");
  const terminalRef = useRef<HTMLDivElement>(null);

  // Comprehensive CLI commands for all VPN functions
  const cliCommands: CLICommand[] = [
    // VPN Management CLIs
    {
      id: "vpn-connect",
      name: "VPN Connect",
      command: "ijaxt vpn connect",
      description: "Connect to VPN server",
      category: "vpn",
      example: "ijaxt vpn connect --server us-east-1 --protocol openvpn",
      parameters: [
        { name: "--server", type: "string", required: true, description: "VPN server location" },
        { name: "--protocol", type: "string", required: false, description: "Connection protocol" },
        { name: "--encryption", type: "string", required: false, description: "Encryption method" }
      ]
    },
    {
      id: "vpn-disconnect",
      name: "VPN Disconnect",
      command: "ijaxt vpn disconnect",
      description: "Disconnect from VPN",
      category: "vpn",
      example: "ijaxt vpn disconnect",
      parameters: []
    },
    {
      id: "vpn-status",
      name: "VPN Status",
      command: "ijaxt vpn status",
      description: "Show VPN connection status",
      category: "vpn",
      example: "ijaxt vpn status --verbose",
      parameters: [
        { name: "--verbose", type: "boolean", required: false, description: "Show detailed information" }
      ]
    },
    {
      id: "vpn-list",
      name: "List Servers",
      command: "ijaxt vpn list",
      description: "List available VPN servers",
      category: "vpn",
      example: "ijaxt vpn list --region asia --sort speed",
      parameters: [
        { name: "--region", type: "string", required: false, description: "Filter by region" },
        { name: "--sort", type: "string", required: false, description: "Sort by criteria" }
      ]
    },

    // IMSI Management CLIs
    {
      id: "imsi-generate",
      name: "Generate IMSI",
      command: "ijaxt imsi generate",
      description: "Generate new IMSI identity",
      category: "imsi",
      example: "ijaxt imsi generate --mcc 310 --mnc 260",
      parameters: [
        { name: "--mcc", type: "string", required: false, description: "Mobile Country Code" },
        { name: "--mnc", type: "string", required: false, description: "Mobile Network Code" }
      ]
    },
    {
      id: "imsi-rotate",
      name: "Rotate IMSI",
      command: "ijaxt imsi rotate",
      description: "Rotate to new IMSI",
      category: "imsi",
      example: "ijaxt imsi rotate --auto --interval 300",
      parameters: [
        { name: "--auto", type: "boolean", required: false, description: "Enable auto-rotation" },
        { name: "--interval", type: "number", required: false, description: "Rotation interval in seconds" }
      ]
    },
    {
      id: "imsi-pool",
      name: "IMSI Pool",
      command: "ijaxt imsi pool",
      description: "Manage IMSI pool",
      category: "imsi",
      example: "ijaxt imsi pool --size 100 --refresh",
      parameters: [
        { name: "--size", type: "number", required: false, description: "Pool size" },
        { name: "--refresh", type: "boolean", required: false, description: "Refresh pool" }
      ]
    },

    // Network Security CLIs
    {
      id: "security-scan",
      name: "Security Scan",
      command: "ijaxt security scan",
      description: "Perform security scan",
      category: "security",
      example: "ijaxt security scan --type full --output json",
      parameters: [
        { name: "--type", type: "string", required: false, description: "Scan type (quick, full, custom)" },
        { name: "--output", type: "string", required: false, description: "Output format" }
      ]
    },
    {
      id: "security-monitor",
      name: "Security Monitor",
      command: "ijaxt security monitor",
      description: "Start security monitoring",
      category: "security",
      example: "ijaxt security monitor --realtime --alerts",
      parameters: [
        { name: "--realtime", type: "boolean", required: false, description: "Real-time monitoring" },
        { name: "--alerts", type: "boolean", required: false, description: "Enable alerts" }
      ]
    },

    // IoT Device Management CLIs
    {
      id: "iot-scan",
      name: "IoT Device Scan",
      command: "ijaxt iot scan",
      description: "Scan for IoT devices",
      category: "iot",
      example: "ijaxt iot scan --network 192.168.1.0/24",
      parameters: [
        { name: "--network", type: "string", required: false, description: "Network range to scan" }
      ]
    },
    {
      id: "iot-secure",
      name: "Secure IoT Devices",
      command: "ijaxt iot secure",
      description: "Apply security to IoT devices",
      category: "iot",
      example: "ijaxt iot secure --device-id all --policy strict",
      parameters: [
        { name: "--device-id", type: "string", required: false, description: "Device ID or 'all'" },
        { name: "--policy", type: "string", required: false, description: "Security policy" }
      ]
    },

    // Network Optimization CLIs
    {
      id: "network-optimize",
      name: "Network Optimize",
      command: "ijaxt network optimize",
      description: "Optimize network performance",
      category: "network",
      example: "ijaxt network optimize --mode speed --provider auto",
      parameters: [
        { name: "--mode", type: "string", required: false, description: "Optimization mode" },
        { name: "--provider", type: "string", required: false, description: "Network provider" }
      ]
    },
    {
      id: "network-stealer",
      name: "Network Stealer",
      command: "ijaxt network stealer",
      description: "Access free network optimization",
      category: "network",
      example: "ijaxt network stealer --stealth --duration 3600",
      parameters: [
        { name: "--stealth", type: "boolean", required: false, description: "Enable stealth mode" },
        { name: "--duration", type: "number", required: false, description: "Duration in seconds" }
      ]
    }
  ];

  // Third-party CLIs
  const thirdPartyCLIs: ThirdPartyCLI[] = [
    {
      id: "curl",
      name: "cURL",
      provider: "cURL Project",
      version: "8.4.0",
      installation: "curl -O https://curl.se/download/curl-8.4.0.tar.gz",
      documentation: "https://curl.se/docs/",
      commands: [
        "curl -X GET https://api.ijaxt.com/v1/vpn/status",
        "curl -X POST https://api.ijaxt.com/v1/vpn/connect -d '{\"server\":\"us-east-1\"}'",
        "curl -X POST https://api.ijaxt.com/v1/imsi/generate -H 'Authorization: Bearer TOKEN'"
      ],
      status: "active"
    },
    {
      id: "httpie",
      name: "HTTPie",
      provider: "HTTPie Inc.",
      version: "3.2.2",
      installation: "pip install httpie",
      documentation: "https://httpie.io/docs",
      commands: [
        "http GET api.ijaxt.com/v1/vpn/status Authorization:'Bearer TOKEN'",
        "http POST api.ijaxt.com/v1/vpn/connect server=us-east-1",
        "http PUT api.ijaxt.com/v1/imsi/rotate auto:=true"
      ],
      status: "active"
    },
    {
      id: "postman-cli",
      name: "Postman CLI",
      provider: "Postman",
      version: "1.2.1",
      installation: "npm install -g @postman/cli",
      documentation: "https://learning.postman.com/docs/postman-cli/",
      commands: [
        "postman collection run ijaxt-vpn-collection.json",
        "postman login --with-api-key",
        "postman collection convert openapi ijaxt-api.yaml"
      ],
      status: "active"
    },
    {
      id: "jq",
      name: "jq",
      provider: "jq Project",
      version: "1.7",
      installation: "sudo apt-get install jq",
      documentation: "https://jqlang.github.io/jq/",
      commands: [
        "curl api.ijaxt.com/v1/vpn/status | jq '.connection_status'",
        "curl api.ijaxt.com/v1/servers | jq '.[] | select(.region==\"us\")'",
        "cat vpn-log.json | jq '.[] | select(.status==\"connected\")'"
      ],
      status: "active"
    },
    {
      id: "openvpn-cli",
      name: "OpenVPN CLI",
      provider: "OpenVPN Inc.",
      version: "2.6.8",
      installation: "sudo apt-get install openvpn",
      documentation: "https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/",
      commands: [
        "openvpn --config ijaxt-us-east-1.ovpn",
        "openvpn --client --remote vpn.ijaxt.com 1194",
        "openvpn --show-ciphers | grep AES"
      ],
      status: "active"
    },
    {
      id: "wireguard-cli",
      name: "WireGuard CLI",
      provider: "WireGuard LLC",
      version: "1.0.20210914",
      installation: "sudo apt-get install wireguard",
      documentation: "https://www.wireguard.com/quickstart/",
      commands: [
        "wg-quick up ijaxt-wg0",
        "wg show",
        "wg genkey | wg pubkey"
      ],
      status: "active"
    }
  ];

  const categories = [
    { id: "vpn", name: "VPN Management", icon: Shield },
    { id: "imsi", name: "IMSI System", icon: Database },
    { id: "security", name: "Security", icon: Shield },
    { id: "iot", name: "IoT Devices", icon: Package },
    { id: "network", name: "Network", icon: Globe }
  ];

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    setIsExecuting(true);
    
    // Add to history
    const newOutput: CLIOutput = {
      id: Date.now().toString(),
      command: command,
      output: "",
      timestamp: new Date().toISOString(),
      exitCode: 0,
      duration: "0ms"
    };

    // Simulate command execution
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    const endTime = Date.now();
    
    // Generate mock output based on command
    let output = "";
    let exitCode = 0;

    if (command.includes("vpn connect")) {
      output = `✓ Connecting to VPN server...
✓ Establishing secure tunnel...
✓ Connected to us-east-1.ijaxt.com
✓ Your IP: 198.51.100.42
✓ Encryption: AES-256-GCM
✓ Protocol: OpenVPN
✓ Connection established successfully!`;
    } else if (command.includes("vpn status")) {
      output = `VPN Status: Connected
Server: us-east-1.ijaxt.com
Protocol: OpenVPN
Encryption: AES-256-GCM
Uptime: 2h 15m 32s
Data Transfer:
  ↑ Uploaded: 125.6 MB
  ↓ Downloaded: 1.2 GB
Latency: 23ms
Speed: 85.3 Mbps`;
    } else if (command.includes("imsi generate")) {
      output = `✓ Generating new IMSI...
✓ IMSI: 310260987654321
✓ MCC: 310 (United States)
✓ MNC: 260 (T-Mobile USA)
✓ Valid until: 2024-12-31 23:59:59 UTC
✓ IMSI generated successfully!`;
    } else if (command.includes("security scan")) {
      output = `✓ Starting security scan...
✓ Scanning network interfaces...
✓ Checking for vulnerabilities...
✓ Analyzing traffic patterns...
✓ Scan complete!

Results:
  Threats detected: 0
  Vulnerabilities: 0
  Security level: EXCELLENT
  Scan duration: 2.3 seconds`;
    } else if (command.includes("iot scan")) {
      output = `✓ Scanning network for IoT devices...
✓ Found 5 devices:

192.168.1.101 - Smart Thermostat (Nest)
192.168.1.102 - Security Camera (Ring)
192.168.1.103 - Smart Speaker (Amazon Echo)
192.168.1.104 - Smart TV (Samsung)
192.168.1.105 - Router (ASUS AC68U)

✓ All devices secured with VPN protection`;
    } else if (command.includes("network optimize")) {
      output = `✓ Optimizing network performance...
✓ Analyzing current connection...
✓ Applying speed optimizations...
✓ Configuring packet routing...
✓ Optimization complete!

Performance Improvements:
  Speed increase: +25%
  Latency reduction: -15ms
  Packet loss: 0%
  Connection stability: 99.9%`;
    } else if (command.includes("help")) {
      output = `Ijaxt VPN CLI v1.0.0

Available commands:
  vpn connect     - Connect to VPN server
  vpn disconnect  - Disconnect from VPN
  vpn status      - Show connection status
  vpn list        - List available servers
  
  imsi generate   - Generate new IMSI
  imsi rotate     - Rotate IMSI identity
  imsi pool       - Manage IMSI pool
  
  security scan   - Run security scan
  security monitor - Start monitoring
  
  iot scan        - Scan for IoT devices
  iot secure      - Secure IoT devices
  
  network optimize - Optimize performance
  network stealer  - Free network access

Use 'ijaxt <command> --help' for detailed options.`;
    } else {
      output = `Command not found: ${command}
Type 'ijaxt help' for available commands.`;
      exitCode = 1;
    }

    newOutput.output = output;
    newOutput.exitCode = exitCode;
    newOutput.duration = `${endTime - startTime}ms`;

    setCLIHistory(prev => [...prev, newOutput]);
    setCurrentCommand("");
    setHistoryIndex(-1);
    setIsExecuting(false);

    // Scroll to bottom
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isExecuting) {
      executeCommand(currentCommand);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cliHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(cliHistory[cliHistory.length - 1 - newIndex].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(cliHistory[cliHistory.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand("");
      }
    }
  };

  const clearTerminal = () => {
    setCLIHistory([]);
    setHistoryIndex(-1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportCLIScript = () => {
    const script = `#!/bin/bash
# Ijaxt VPN CLI Commands Script
# Generated on ${new Date().toISOString()}

${cliCommands.map(cmd => `# ${cmd.description}
# Example: ${cmd.example}
# ${cmd.command}
`).join('\n')}

# Third-party integrations
${thirdPartyCLIs.map(cli => `# ${cli.name} commands:
${cli.commands.map(cmd => `# ${cmd}`).join('\n')}
`).join('\n')}
`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ijaxt-vpn-cli-commands.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredCommands = cliCommands.filter(cmd => cmd.category === activeCategory);

  return (
    <section className="py-20 fire-effect" id="http-cli">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">
            HTTP CLI Interface
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Powerful command-line interface for all VPN functions. Execute commands, manage APIs, 
            and integrate with third-party tools for automated workflows.
          </p>
        </div>

        <Tabs defaultValue="terminal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="terminal" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              CLI Terminal
            </TabsTrigger>
            <TabsTrigger value="commands" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Commands
            </TabsTrigger>
            <TabsTrigger value="third-party" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Third-party CLIs
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Scripts & Export
            </TabsTrigger>
          </TabsList>

          {/* CLI Terminal */}
          <TabsContent value="terminal">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Quick Commands Sidebar */}
              <div className="space-y-2">
                <div className="text-sm font-medium mb-2">Quick Commands</div>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setCurrentCommand(`ijaxt ${category.id} `)}
                    >
                      <Icon className="h-3 w-3 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
                <Separator className="my-2" />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => setCurrentCommand("ijaxt help")}
                >
                  <Info className="h-3 w-3 mr-2" />
                  Help
                </Button>
              </div>

              {/* Terminal Interface */}
              <div className="lg:col-span-3">
                <Card className="fire-card h-96">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-green-400" />
                        Ijaxt VPN CLI Terminal
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={clearTerminal}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                        <div className="flex gap-1">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div 
                      ref={terminalRef}
                      className="h-64 overflow-y-auto bg-black/90 text-green-400 font-mono text-sm p-4 space-y-2"
                    >
                      {/* Welcome message */}
                      {cliHistory.length === 0 && (
                        <div className="text-green-300">
                          <div>Ijaxt VPN CLI v1.0.0</div>
                          <div>Type 'ijaxt help' for available commands.</div>
                          <div className="text-gray-500">Ready for input...</div>
                        </div>
                      )}
                      
                      {/* Command history */}
                      {cliHistory.map((output) => (
                        <div key={output.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-400">$</span>
                            <span>{output.command}</span>
                            <span className="text-gray-500 text-xs">
                              [{output.duration}]
                            </span>
                          </div>
                          <div className={`pl-4 whitespace-pre-wrap ${
                            output.exitCode === 0 ? 'text-green-300' : 'text-red-400'
                          }`}>
                            {output.output}
                          </div>
                        </div>
                      ))}
                      
                      {/* Current input */}
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">$</span>
                        <Input
                          value={currentCommand}
                          onChange={(e) => setCurrentCommand(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Enter command..."
                          className="border-none bg-transparent text-green-400 font-mono p-0 focus-visible:ring-0"
                          disabled={isExecuting}
                        />
                        {isExecuting && (
                          <div className="text-yellow-400 animate-pulse">executing...</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Commands Documentation */}
          <TabsContent value="commands">
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

              {/* Commands List */}
              <div className="lg:col-span-3 space-y-4">
                {filteredCommands.map((command) => (
                  <Card key={command.id} className="fire-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          {command.name}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(command.example)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </CardTitle>
                      <CardDescription>{command.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1">Command:</div>
                        <code className="bg-muted/20 px-2 py-1 rounded text-sm font-mono">
                          {command.command}
                        </code>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Example:</div>
                        <code className="bg-green-900/20 px-2 py-1 rounded text-sm font-mono text-green-400">
                          {command.example}
                        </code>
                      </div>
                      
                      {command.parameters.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Parameters:</div>
                          <div className="space-y-1">
                            {command.parameters.map((param, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <code className="bg-muted/20 px-1 rounded font-mono">
                                  {param.name}
                                </code>
                                <Badge variant="outline" className="text-xs">{param.type}</Badge>
                                {param.required && (
                                  <Badge variant="destructive" className="text-xs">required</Badge>
                                )}
                                <span className="text-muted-foreground">{param.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Third-party CLIs */}
          <TabsContent value="third-party">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {thirdPartyCLIs.map((cli) => (
                <Card key={cli.id} className="fire-card">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        {cli.name}
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        cli.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    </CardTitle>
                    <CardDescription>by {cli.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Version</span>
                      <Badge variant="outline" className="text-xs">{cli.version}</Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">Installation:</div>
                      <code className="bg-muted/20 px-2 py-1 rounded text-xs font-mono break-all">
                        {cli.installation}
                      </code>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2">Example Commands:</div>
                      <div className="space-y-1">
                        {cli.commands.slice(0, 2).map((command, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <code className="bg-green-900/20 px-2 py-1 rounded text-xs font-mono text-green-400 flex-1">
                              {command}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(command)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={cli.documentation} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-3 w-3 mr-1" />
                        Documentation
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Scripts & Export */}
          <TabsContent value="scripts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Export Options */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-green-400" />
                    Export CLI Documentation
                  </CardTitle>
                  <CardDescription>
                    Download complete CLI documentation and scripts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportCLIScript} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Bash Script
                  </Button>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Available Formats:</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="text-xs justify-center">
                        <Terminal className="h-3 w-3 mr-1" />
                        Bash Script
                      </Badge>
                      <Badge variant="outline" className="text-xs justify-center">
                        <FileText className="h-3 w-3 mr-1" />
                        PowerShell
                      </Badge>
                      <Badge variant="outline" className="text-xs justify-center">
                        <Code className="h-3 w-3 mr-1" />
                        Python
                      </Badge>
                      <Badge variant="outline" className="text-xs justify-center">
                        <GitBranch className="h-3 w-3 mr-1" />
                        Docker
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CLI Statistics */}
              <Card className="fire-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-green-400" />
                    CLI Statistics
                  </CardTitle>
                  <CardDescription>
                    Overview of available commands and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{cliCommands.length}</div>
                      <div className="text-xs text-muted-foreground">Total Commands</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{thirdPartyCLIs.length}</div>
                      <div className="text-xs text-muted-foreground">Third-party CLIs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{categories.length}</div>
                      <div className="text-xs text-muted-foreground">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{cliHistory.length}</div>
                      <div className="text-xs text-muted-foreground">Commands Executed</div>
                    </div>
                  </div>
                  
                  <Alert className="border-green-500/50 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All CLI tools are ready for production use with comprehensive documentation.
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