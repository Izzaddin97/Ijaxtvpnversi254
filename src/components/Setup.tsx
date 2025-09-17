import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Smartphone, Monitor, Tablet, Wifi, Copy, Check } from "lucide-react";
import { useState } from "react";
import { VPN_CONFIGS, SETUP_INSTRUCTIONS } from "../utils/setup-configs";

export function Setup() {
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);

  const copyToClipboard = (text: string, configType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedConfig(configType);
    setTimeout(() => setCopiedConfig(null), 2000);
  };

  return (
    <section id="setup" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 fire-text">Easy Setup on Any Device</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get connected in minutes with our simple setup guides for all your devices.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="ios" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ios" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              iOS
            </TabsTrigger>
            <TabsTrigger value="android" className="flex items-center gap-2">
              <Tablet className="h-4 w-4" />
              Android
            </TabsTrigger>
            <TabsTrigger value="windows" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Windows
            </TabsTrigger>
            <TabsTrigger value="router" className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              Router
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ios" className="mt-6">
            <Card className="p-6 fire-card">
              <h3 className="mb-4 text-green-400">Setup on iOS</h3>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm whitespace-pre-line">{VPN_CONFIGS.ios}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(VPN_CONFIGS.ios, 'ios')}
                    >
                      {copiedConfig === 'ios' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {SETUP_INSTRUCTIONS.ios.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="android" className="mt-6">
            <Card className="p-6 fire-card">
              <h3 className="mb-4 text-green-400">Setup on Android</h3>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm whitespace-pre-line">{VPN_CONFIGS.android}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(VPN_CONFIGS.android, 'android')}
                    >
                      {copiedConfig === 'android' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {SETUP_INSTRUCTIONS.android.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="windows" className="mt-6">
            <Card className="p-6 fire-card">
              <h3 className="mb-4 text-green-400">Setup on Windows</h3>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm whitespace-pre-line">{VPN_CONFIGS.windows}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(VPN_CONFIGS.windows, 'windows')}
                    >
                      {copiedConfig === 'windows' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {SETUP_INSTRUCTIONS.windows.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="router" className="mt-6">
            <Card className="p-6 fire-card">
              <h3 className="mb-4 text-green-400">Setup on Router</h3>
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm whitespace-pre-line">{VPN_CONFIGS.router}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(VPN_CONFIGS.router, 'router')}
                    >
                      {copiedConfig === 'router' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  {SETUP_INSTRUCTIONS.router.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
