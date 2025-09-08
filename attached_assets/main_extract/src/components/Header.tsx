import { Button } from "./ui/button";
import { Menu, Shield, X, Database, Bot, Sparkles } from "lucide-react";
import { useState } from "react";
import newLogoImage from 'figma:asset/3a38e1d7fbacdeadb73c05ce4884be639290250c.png';

interface HeaderProps {
  onToggleAI?: () => void;
}

export function Header({ onToggleAI }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#" },
    { name: "Features", href: "#features" },
    { name: "VPN Plans", href: "#vpn-versions" },
    { name: "Security", href: "#network-security" },

    { name: "Support", href: "#setup" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src={newLogoImage}
              alt="Ijaxt VPN"
              className="logo-circular-sm logo-circular-brand-focus"
              draggable={false}
            />
            <span className="text-xl fire-text alfa-slab-one-regular">Ijaxt VPN</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm hover:text-green-400 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* AI Assistant Button */}
            {onToggleAI && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onToggleAI}
                className="border-green-400/50 text-green-400 hover:bg-green-400/10 hover:border-green-400 group"
              >
                <Bot className="mr-2 h-4 w-4" />
                <Sparkles className="mr-1 h-3 w-3 animate-pulse" />
                AI Help
              </Button>
            )}
            <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
              Login
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-500 text-black">
              <Shield className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-green-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm hover:text-green-400 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/40">
                {/* AI Assistant Button for Mobile */}
                {onToggleAI && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      onToggleAI();
                      setIsMobileMenuOpen(false);
                    }}
                    className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    <Sparkles className="mr-1 h-3 w-3 animate-pulse" />
                    AI Assistant
                  </Button>
                )}
                <Button variant="outline" size="sm" className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black">
                  Login
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-500 text-black">
                  <Shield className="mr-2 h-4 w-4" />
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}