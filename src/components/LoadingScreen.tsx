import { useEffect, useState } from "react";
// import loadingLogoImage from 'figma:asset/39dbcabcc6487c034e6a9e60ef1f6b748d528251.png';
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing");

  useEffect(() => {
    const loadingSteps = [
      { text: "Initializing", duration: 800 },
      { text: "Loading VPN Services", duration: 1000 },
      { text: "Connecting to Servers", duration: 1200 },
      { text: "Preparing Interface", duration: 800 },
      { text: "Almost Ready", duration: 600 }
    ];

    let currentStep = 0;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += 2;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 50);

    const textInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(textInterval);
      }
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center z-50 loading-screen">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-transparent to-green-400/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-300 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping opacity-50" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo Container with Professional Styling */}
        <div className="mb-8 relative">
          <div className="logo-container logo-loading-screen relative inline-block">
            <img
              src={loadingLogoImage}
              alt="Ijaxt VPN"
              className="logo-circular-xl logo-circular-optimal select-none"
              draggable={false}
            />
            
            {/* Multiple Shadow Layers */}
            <div className="logo-shadow-1"></div>
            <div className="logo-shadow-2"></div>
            <div className="logo-shadow-3"></div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mb-6">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin mx-auto mb-4" />
          <div className="text-green-400 text-lg mb-2 fire-text alfa-slab-one-regular">
            {loadingText}
          </div>
          <div className="text-muted-foreground text-sm animate-pulse">
            {progress}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-500 rounded-full transition-all duration-300 ease-out progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-xs text-muted-foreground">
          <p className="alfa-slab-one-regular">Ijaxt VPN v2.0</p>
          <p className="text-green-400/60">Fast • Secure • Private</p>
        </div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-green-400/30 corner-glow"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-green-400/30 corner-glow"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-green-400/30 corner-glow"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-green-400/30 corner-glow"></div>
    </div>
  );
}