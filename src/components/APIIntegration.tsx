import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Code, 
  Image as ImageIcon, 
  Database, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink
} from "lucide-react";
import { ImageProcessor } from "./ImageProcessor";
import { LCIDataViewer } from "./LCIDataViewer";
import { toast } from "sonner@2.0.3";

export function APIIntegration() {
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const features = [
    {
      icon: ImageIcon,
      title: "Image Processing",
      description: "AI-powered background removal and icon generation",
      endpoint: "/process-image",
      method: "POST"
    },
    {
      icon: Database,
      title: "LCI Data Access",
      description: "Real-time network intelligence and metrics",
      endpoint: "/lci/data",
      method: "GET"
    },
    {
      icon: Code,
      title: "RESTful API",
      description: "Simple and secure API endpoints",
      endpoint: "/health",
      method: "GET"
    }
  ];

  const envVariables = [
    {
      key: "VITE_API_BASE_URL",
      value: "https://your-api-endpoint.com/api",
      description: "Base URL for API endpoints"
    },
    {
      key: "VITE_LCI_ACCESS_TOKEN",
      value: "your-lci-access-token",
      description: "Authentication token for LCI data access"
    },
    {
      key: "VITE_IMAGE_PROCESSING_ENDPOINT",
      value: "/process-image",
      description: "Endpoint path for image processing"
    }
  ];

  const codeExample = `// Example API usage
import { apiClient, processImageFile, fetchLCIData } from './utils/api-client';

// Process an image
const processImage = async (file: File) => {
  const result = await processImageFile(file);
  if (result.success) {
    console.log('Processed image URL:', result.downloadUrl);
  }
};

// Fetch LCI data
const getLCIData = async () => {
  const result = await fetchLCIData();
  if (result.success) {
    console.log('LCI data:', result.data);
  }
};`;

  return (
    <section className="py-20 px-4" id="api-integration">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-green-500/50 text-green-400">
            <Zap className="mr-2 h-4 w-4" />
            API Integration
          </Badge>
          <h2 className="text-4xl alfa-slab-one-regular fire-text mb-4">
            Powerful API Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Integrate advanced image processing and network intelligence into your applications
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-muted/20 border border-border/30">
            <TabsTrigger value="overview" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              Overview
            </TabsTrigger>
            <TabsTrigger value="image-processing" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              Image Processing
            </TabsTrigger>
            <TabsTrigger value="lci-data" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              LCI Data
            </TabsTrigger>
            <TabsTrigger value="documentation" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400">
              Documentation
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="fire-card">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-green-400">{feature.title}</CardTitle>
                        <Badge variant="outline" className="text-xs border-green-500/50 text-green-400">
                          {feature.method}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <code className="text-sm font-mono bg-muted/30 px-2 py-1 rounded border text-green-400">
                        {feature.endpoint}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(feature.endpoint, "Endpoint")}
                        className="hover:bg-green-500/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Environment Variables */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="text-green-400">Environment Configuration</CardTitle>
                <CardDescription>
                  Required environment variables for API integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {envVariables.map((env, index) => (
                  <div key={index} className="border border-border/30 rounded-lg p-4 bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                      <code className="font-mono text-green-400">{env.key}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${env.key}=${env.value}`, "Environment variable")}
                        className="hover:bg-green-500/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{env.description}</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded border text-muted-foreground">
                      {env.value}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="text-green-400">Quick Start</CardTitle>
                <CardDescription>
                  Get started with the API integration in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Configure Environment</p>
                      <p className="text-sm text-muted-foreground">Set up your API credentials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Import Utilities</p>
                      <p className="text-sm text-muted-foreground">Use the API client functions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600/20 rounded-full flex items-center justify-center text-green-400 font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Start Building</p>
                      <p className="text-sm text-muted-foreground">Integrate with your app</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Image Processing Tab */}
          <TabsContent value="image-processing">
            <ImageProcessor />
          </TabsContent>

          {/* LCI Data Tab */}
          <TabsContent value="lci-data">
            <LCIDataViewer />
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-8">
            {/* Code Example */}
            <Card className="fire-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-400">Code Example</CardTitle>
                    <CardDescription>
                      Example implementation using the API client
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeExample, "Code example")}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm font-mono bg-muted/20 p-4 rounded border overflow-x-auto text-green-400/80">
                  {codeExample}
                </pre>
              </CardContent>
            </Card>

            {/* API Endpoints */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="text-green-400">API Endpoints</CardTitle>
                <CardDescription>
                  Complete endpoint reference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Processing Endpoint */}
                <div className="border border-border/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/50">POST</Badge>
                    <code className="font-mono text-green-400">/process-image</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Process an image to remove background and optimize for icon use
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Request:</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded border text-muted-foreground block">
                      Content-Type: multipart/form-data<br />
                      Body: {"{ image: File }"}
                    </code>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Response:</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded border text-muted-foreground block">
                      Content-Type: image/png (binary data)
                    </code>
                  </div>
                </div>

                {/* LCI Data Endpoint */}
                <div className="border border-border/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/50">GET</Badge>
                    <code className="font-mono text-green-400">/lci/data</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fetch real-time network intelligence and performance metrics
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Headers:</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded border text-muted-foreground block">
                      x-lci-access: your-lci-access-token
                    </code>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium">Response:</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded border text-muted-foreground block">
                      {`{
  "success": true,
  "data": {
    "metrics": { ... },
    "security": { ... },
    "network": { ... }
  }
}`}
                    </code>
                  </div>
                </div>

                {/* Health Check Endpoint */}
                <div className="border border-border/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/50">GET</Badge>
                    <code className="font-mono text-green-400">/health</code>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check API service health and availability
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Response:</p>
                    <code className="text-xs font-mono bg-muted/30 px-2 py-1 rounded border text-muted-foreground block">
                      {`{ "status": "healthy", "timestamp": "..." }`}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Handling */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="text-green-400">Error Handling</CardTitle>
                <CardDescription>
                  Common error responses and handling strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-600/20 text-red-400 border-red-500/50">400</Badge>
                      <span className="font-medium text-red-400">Bad Request</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Invalid request format or missing required parameters
                    </p>
                  </div>
                  
                  <div className="border border-yellow-500/30 rounded-lg p-4 bg-yellow-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/50">401</Badge>
                      <span className="font-medium text-yellow-400">Unauthorized</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Invalid or missing authentication token
                    </p>
                  </div>
                  
                  <div className="border border-red-500/30 rounded-lg p-4 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-red-600/20 text-red-400 border-red-500/50">500</Badge>
                      <span className="font-medium text-red-400">Server Error</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Internal server error or service unavailable
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate Limits */}
            <Card className="fire-card">
              <CardHeader>
                <CardTitle className="text-green-400">Rate Limits & Best Practices</CardTitle>
                <CardDescription>
                  Guidelines for optimal API usage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-400">Rate Limits</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        100 requests per minute
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        10MB max file size
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        PNG, JPG, JPEG formats
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-400">Best Practices</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Implement retry logic
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Cache responses when possible
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        Monitor API health
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
