import { Button } from "./ui/button";
import { Shield, Zap, Globe, Lock, Smartphone, Clock, CreditCard } from "lucide-react";
// Using a placeholder logo for now
const newLogoImage = "https://via.placeholder.com/120x120/00ff66/000000?text=IJAXT";

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Logo Section */}
        <div className="logo-container mb-8">
          <img
            src={newLogoImage}
            alt="Ijaxt VPN Logo"
            className="logo-circular-lg logo-circular-subtle-zoom mx-auto"
            draggable={false}
          />
        </div>

        {/* Tagline */}
        <h1 className="text-4xl md:text-6xl mb-6 fire-text alfa-slab-heading" style={{ color: '#00ff66' }}>
          Fast, Secure & Private VPN
        </h1>
        
        {/* Short Description */}
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ color: '#ccc' }}>
          Experience the internet without limits. Ijaxt VPN delivers lightning-fast speeds, 
          military-grade AES-256 encryption, and complete privacy protection with a strict no-log policy. 
          Access content worldwide, stay safe on public Wi-Fi, and enjoy secure browsing across all your devices.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-500 text-black px-8 py-3 fire-effect vpn-select-button alfa-slab-one-regular"
          >
            <Shield className="mr-2 h-5 w-5" />
            Get Protected Now
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black px-8 py-3 alfa-slab-one-regular"
          >
            <Zap className="mr-2 h-5 w-5" />
            Free Trial
          </Button>
        </div>

        {/* Key Features */}
        <div className="mb-12">
          <ul className="text-left max-w-2xl mx-auto space-y-3" style={{ color: '#00ff66', fontSize: '16px' }}>
            <li className="flex items-center">
              <Zap className="w-5 h-5 mr-3 text-green-400" />
              <span>Lightning-Fast Speeds</span>
            </li>
            <li className="flex items-center">
              <Lock className="w-5 h-5 mr-3 text-green-400" />
              <span>Military-Grade Encryption</span>
            </li>
            <li className="flex items-center">
              <Globe className="w-5 h-5 mr-3 text-green-400" />
              <span>Global Network in 50+ Countries</span>
            </li>
            <li className="flex items-center">
              <Shield className="w-5 h-5 mr-3 text-green-400" />
              <span>No-Log Policy & Kill Switch Protection</span>
            </li>
            <li className="flex items-center">
              <Smartphone className="w-5 h-5 mr-3 text-green-400" />
              <span>Multi-Device Support (up to 10 devices)</span>
            </li>
            <li className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-green-400" />
              <span>99.9% Uptime & 24/7 Expert Support</span>
            </li>
            <li className="flex items-center">
              <CreditCard className="w-5 h-5 mr-3 text-green-400" />
              <span>30-Day Money-Back Guarantee</span>
            </li>
          </ul>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="fire-card p-6 rounded-lg">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-green-400 alfa-slab-one-regular">Military-Grade Security</h3>
            <p className="text-muted-foreground">
              AES-256 encryption protects your data from prying eyes
            </p>
          </div>
          
          <div className="fire-card p-6 rounded-lg">
            <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-green-400 alfa-slab-one-regular">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Optimized servers worldwide for maximum speed
            </p>
          </div>
          
          <div className="fire-card p-6 rounded-lg">
            <Globe className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl mb-2 text-green-400 alfa-slab-one-regular">Global Access</h3>
            <p className="text-muted-foreground">
              Access content from anywhere in the world
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="text-sm text-muted-foreground alfa-slab-one-regular">Trusted by 10M+ users</div>
          <div className="text-sm text-muted-foreground alfa-slab-one-regular">99.9% Uptime</div>
          <div className="text-sm text-muted-foreground alfa-slab-one-regular">24/7 Support</div>
          <div className="text-sm text-muted-foreground alfa-slab-one-regular">No Logs Policy</div>
        </div>
      </div>
    </section>
  );
}