import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { VPNVersions } from "./components/VPNVersions";
import { IMSIManager } from "./components/IMSIManager";
import { NetworkStealer } from "./components/NetworkStealer";
import { IoTDashboard } from "./components/IoTDashboard";
import { NetworkSecurity } from "./components/NetworkSecurity";
import { FileSystemAccess } from "./components/FileSystemAccess";
import { Features } from "./components/Features";
import { Setup } from "./components/Setup";
import { Footer } from "./components/Footer";
import { LoadingScreen } from "./components/LoadingScreen";
import { AIAssistant } from "./components/AIAssistant";
import { AINotification } from "./components/AINotification";
import { useEffect, useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showApp, setShowApp] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(true);
  const [showAI, setShowAI] = useState(true);

  useEffect(() => {
    // Force dark mode for Green Fire theme
    document.documentElement.classList.add("dark");
    // Ensure smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Add smooth transition delay with error handling
    setTimeout(() => {
      setShowApp(true);
    }, 300);
  };

  const handleToggleAI = () => {
    setIsAIMinimized(!isAIMinimized);
  };

  const handleOpenAI = () => {
    setIsAIMinimized(false);
    setShowAI(true);
  };

  const handleCloseAI = () => {
    setShowAI(false);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div
      className={`min-h-screen bg-background relative transition-opacity duration-500 ${
        showApp ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="fire-effect">
        <Header onToggleAI={handleToggleAI} />
        <main className="relative z-10">
          <Hero />
          <Stats />
          <VPNVersions />
          <IMSIManager />
          <NetworkStealer />
          <IoTDashboard />
          <NetworkSecurity />
          <FileSystemAccess />
          <Features />
          <Setup />
        </main>
        <Footer />
      </div>
      
      {/* AI Notification - Only show when AI is minimized */}
      {showAI && showApp && isAIMinimized && (
        <AINotification onOpenAI={handleOpenAI} />
      )}
      
      {/* AI Assistant - Enhanced with better error boundaries */}
      {showAI && showApp && !isLoading && (
        <AIAssistant
          isMinimized={isAIMinimized}
          onToggleMinimize={handleToggleAI}
          onClose={handleCloseAI}
        />
      )}
    </div>
  );
}
