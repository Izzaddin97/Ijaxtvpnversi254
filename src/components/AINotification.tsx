import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Bot, Sparkles, X, MessageCircle } from "lucide-react";

interface AINotificationProps {
  onOpenAI: () => void;
}

export function AINotification({ onOpenAI }: AINotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show notification after 5 seconds of page load to avoid overwhelming users
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  useEffect(() => {
    // Auto hide after 8 seconds
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleOpenAI = () => {
    onOpenAI();
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 animate-in slide-in-from-bottom-5 duration-500">
      <Card className="fire-card p-4 max-w-sm border-green-500/30 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-green-400" />
              <Sparkles className="h-3 w-3 text-green-300 animate-pulse ml-1" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-green-400 mb-1">
              🤖 AI Assistant Available!
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Need help with VPN setup, troubleshooting, or have questions? Our AI assistant is ready to help!
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleOpenAI}
                className="bg-green-600 hover:bg-green-500 text-black text-xs px-3 py-1"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Try it now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs px-2 py-1 hover:bg-muted/50"
              >
                Later
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-red-500/20"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </Button>
        </div>
      </Card>
    </div>
  );
}