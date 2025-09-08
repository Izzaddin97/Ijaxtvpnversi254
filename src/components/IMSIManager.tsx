import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Switch } from "./ui/switch";
import {
  Smartphone,
  Shield,
  RefreshCw,
  Lock,
  Unlock,
  Signal,
  Wifi,
  Globe,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Zap,
  Play,
  Square,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  generateRandomIMSI,
  getCarrierFromIMSI,
  formatIMSI,
  formatTime,
} from "../utils/imsi-helpers";

export function IMSIManager() {
  const [currentIMSI, setCurrentIMSI] = useState("");
  const [isProtectionActive, setIsProtectionActive] =
    useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showIMSI, setShowIMSI] = useState(false);
  const [lastRotation, setLastRotation] = useState<Date>(
    new Date(),
  );
  const [rotationProgress, setRotationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  // Initialize with random IMSI
  useEffect(() => {
    setCurrentIMSI(generateRandomIMSI());
  }, []);

  // Session timer
  useEffect(() => {
    if (isProtectionActive) {
      const interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isProtectionActive]);

  // Auto rotation timer (only for progress bar, not actual rotation)
  useEffect(() => {
    if (autoRotate && isProtectionActive) {
      const interval = setInterval(() => {
        setRotationProgress((prev) => {
          if (prev >= 100) {
            return 0; // Reset progress but don't rotate IMSI
          }
          return prev + 1;
        });
      }, 600); // 60 second cycle

      return () => clearInterval(interval);
    } else {
      setRotationProgress(0);
    }
  }, [autoRotate, isProtectionActive]);

  const handleManualRotateIMSI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCurrentIMSI(generateRandomIMSI());
      setLastRotation(new Date());
      setIsGenerating(false);
      setRotationProgress(0);
    }, 1500);
  };

  const handleStartProtection = () => {
    if (!isProtectionActive) {
      setIsProtectionActive(true);
      setSessionTime(0);
      setLastRotation(new Date());
    }
  };

  const handleStopProtection = () => {
    if (isProtectionActive) {
      setIsProtectionActive(false);
      setSessionTime(0);
      setRotationProgress(0);
      setIsGenerating(true);
      setTimeout(() => {
        setCurrentIMSI(generateRandomIMSI());
        setLastRotation(new Date());
        setIsGenerating(false);
      }, 1500);
    }
  };

  return (
    <section
      id="imsi-manager"
      className="container mx-auto px-4 py-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">
          IMSI Security Manager
        </h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Advanced International Mobile Subscriber Identity
          protection with manual rotation and privacy controls
          for maximum anonymity and security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* IMSI Display Card */}
        <Card className="fire-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Smartphone className="w-6 h-6 text-green-400 mr-2" />
              <h3 className="text-xl text-green-400 alfa-slab-one-regular">
                Current IMSI
              </h3>
            </div>
            <Badge
              className={`${isProtectionActive ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}
            >
              {isProtectionActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20">
              <div className="flex items-center">
                <code className="transaction-id text-lg mr-4 alfa-slab-one-regular">
                  {isGenerating
                    ? "Generating..."
                    : formatIMSI(currentIMSI, showIMSI)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIMSI(!showIMSI)}
                  className="h-8 w-8 p-0"
                  disabled={isGenerating}
                >
                  {showIMSI ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={handleManualRotateIMSI}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-500 text-black"
                size="sm"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Rotate
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Carrier:
                </span>
                <span className="text-green-400">
                  {getCarrierFromIMSI(currentIMSI)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Last Change:
                </span>
                <span className="text-green-400">
                  {lastRotation.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Session Time:
                </span>
                <span className="text-green-400">
                  {formatTime(sessionTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Auto Rotation Progress */}
          {autoRotate && isProtectionActive && (
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Auto-Rotation Cycle:
                </span>
                <span className="text-green-400">
                  {Math.ceil((100 - rotationProgress) * 0.6)}s
                </span>
              </div>
              <Progress
                value={rotationProgress}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                IMSI changes automatically when protection is
                stopped
              </p>
            </div>
          )}

          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
              <div className="flex items-center">
                <RefreshCw className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm">
                  Auto-Rotate Indicator
                </span>
              </div>
              <Switch
                checked={autoRotate}
                onCheckedChange={setAutoRotate}
                disabled={!isProtectionActive}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg">
              <div className="flex items-center">
                {isProtectionActive ? (
                  <Lock className="w-4 h-4 text-green-400 mr-2" />
                ) : (
                  <Unlock className="w-4 h-4 text-red-400 mr-2" />
                )}
                <span className="text-sm">Privacy Mode</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartProtection}
                  disabled={isProtectionActive || isGenerating}
                  className="bg-green-600 hover:bg-green-500 text-black"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
                <Button
                  onClick={handleStopProtection}
                  disabled={!isProtectionActive || isGenerating}
                  className="bg-red-600 hover:bg-red-500 text-white"
                  size="sm"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-xs text-blue-400">
              <strong>Note:</strong> IMSI automatically changes
              when you click "Stop" to ensure maximum privacy.
              Manual rotation is available anytime during active
              sessions.
            </p>
          </div>
        </Card>

        {/* Security Status Card */}
        <Card className="fire-card p-6">
          <div className="text-center mb-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isProtectionActive
                  ? "bg-green-500"
                  : "bg-red-500"
              } fire-effect`}
            >
              {isProtectionActive ? (
                <Shield className="w-8 h-8 text-black" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-lg text-green-400 mb-2 alfa-slab-one-regular">
              Security Level
            </h3>
            <Badge
              className={`${isProtectionActive ? "bg-green-500 text-black" : "bg-red-500 text-white"} text-lg px-4 py-1`}
            >
              {isProtectionActive ? "Maximum" : "Inactive"}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Identity Masking:
              </span>
              <div className="flex items-center">
                {isProtectionActive ? (
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span
                  className={
                    isProtectionActive
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {isProtectionActive ? "Active" : "Disabled"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Location Privacy:
              </span>
              <div className="flex items-center">
                {isProtectionActive ? (
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span
                  className={
                    isProtectionActive
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {isProtectionActive ? "Hidden" : "Exposed"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Network Tracing:
              </span>
              <div className="flex items-center">
                {isProtectionActive ? (
                  <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span
                  className={
                    isProtectionActive
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {isProtectionActive ? "Blocked" : "Possible"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Auto-Change:
              </span>
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400">On Stop</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <p className="text-xs text-center text-green-400">
              {isProtectionActive
                ? "Your IMSI is protected and will change when you stop"
                : "Click START to activate IMSI protection"}
            </p>
          </div>
        </Card>
      </div>

      {/* Network Information */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        <Card className="fire-card p-4">
          <div className="flex items-center mb-3">
            <Signal className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 alfa-slab-one-regular">
              Network Status
            </span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Signal Strength:
              </span>
              <span className="text-green-400">Excellent</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Network Type:
              </span>
              <span className="text-green-400">5G</span>
            </div>
          </div>
        </Card>

        <Card className="fire-card p-4">
          <div className="flex items-center mb-3">
            <Wifi className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 alfa-slab-one-regular">
              Connection
            </span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                IP Address:
              </span>
              <span className="text-green-400">
                {isProtectionActive
                  ? "••.••.••.••"
                  : "192.168.1.1"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                DNS:
              </span>
              <span className="text-green-400">Encrypted</span>
            </div>
          </div>
        </Card>

        <Card className="fire-card p-4">
          <div className="flex items-center mb-3">
            <Globe className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-green-400 alfa-slab-one-regular">
              Location
            </span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Country:
              </span>
              <span className="text-green-400">
                {isProtectionActive ? "Anonymous" : "Malaysia"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                City:
              </span>
              <span className="text-green-400">
                {isProtectionActive ? "Hidden" : "Kuala Lumpur"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}