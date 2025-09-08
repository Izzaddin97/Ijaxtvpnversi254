import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Shield,
  HelpCircle,
  Minimize2,
  Maximize2,
  X
} from "lucide-react";
import { env } from '../utils/security/env-config';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}

export function AIAssistant({ isMinimized = false, onToggleMinimize, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Ijaxt VPN AI Assistant. I can help you with VPN setup, troubleshooting, security questions, and general support. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const baseUrl = env.app.apiBaseUrl;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when component mounts or is maximized
  useEffect(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${baseUrl}/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.supabase.anonKey}`
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message);
      console.error('AI Chat Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I set up Ijaxt VPN?",
    "Why is my connection slow?",
    "What is IMSI management?",
    "How secure is the encryption?",
    "How to use network optimization?",
    "Troubleshoot connection issues"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleMinimize}
          className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-500 text-black shadow-lg fire-effect"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] max-h-[90vh]">
      <Card className="fire-card h-full flex flex-col border-green-500/30 shadow-2xl">
        <CardHeader className="pb-3 bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-400" />
                <Sparkles className="h-4 w-4 text-green-300 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-green-400 text-lg">Ijaxt AI Assistant</CardTitle>
                <CardDescription className="text-xs text-green-300/70">
                  Powered by Cloudflare AI
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="h-8 w-8 p-0 hover:bg-green-500/20"
              >
                <Minimize2 className="h-4 w-4 text-green-400" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4 text-red-400" />
                </Button>
              )}
            </div>
          </div>
          <Badge variant="outline" className="w-fit text-xs border-green-500/50 text-green-400">
            <Shield className="h-3 w-3 mr-1" />
            Secure AI Chat
          </Badge>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-b border-border/50">
              <h4 className="text-sm font-medium text-green-400 mb-2 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Quick Questions
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs text-left justify-start h-auto py-2 px-3 hover:bg-green-500/10 text-muted-foreground hover:text-green-400"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-green-600 text-black'
                        : 'bg-muted/50 border border-border/50'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-muted/50 border border-border/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Error Display */}
          {error && (
            <div className="p-4 pt-0">
              <Alert className="border-red-500/50 text-red-400">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about Ijaxt VPN..."
                className="flex-1 bg-muted/50 border-border/50 focus:border-green-500/50"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-green-600 hover:bg-green-500 text-black"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send • Powered by Cloudflare AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}