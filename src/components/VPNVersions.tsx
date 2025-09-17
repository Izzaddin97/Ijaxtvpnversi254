import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, Zap, Globe, Crown, Star, Rocket } from "lucide-react";
import { useState } from "react";
import { Payment } from "./Payment";
import { PaymentSuccess } from "./PaymentSuccess";

export function VPNVersions() {
  const [selectedVPN, setSelectedVPN] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const vpnOptions = [
    {
      id: "cloudflare",
      name: "1.1.1.1 Cloudflare",
      tagline: "Privacy First",
      description: "Ultra-fast DNS with built-in privacy protection. Perfect for basic browsing and security.",
      icon: Shield,
      price: "Free",
      features: [
        "DNS over HTTPS/TLS",
        "Malware Protection", 
        "No Logging Policy",
        "Global Network",
        "Mobile Apps"
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false,
      speed: "Ultra Fast",
      servers: "Global DNS",
      security: "Basic+",
      isPremium: false
    },
    {
      id: "nordvpn",
      name: "NordVPN",
      tagline: "Complete Security",
      description: "Premium VPN with military-grade encryption, ad blocking, and threat protection.",
      icon: Crown,
      price: "$3.99/mo",
      features: [
        "5500+ Servers",
        "Double VPN",
        "CyberSec Protection",
        "No Logs Policy",
        "6 Devices"
      ],
      gradient: "from-blue-600 to-indigo-600",
      popular: true,
      speed: "Very Fast",
      servers: "5500+",
      security: "Military-Grade",
      isPremium: true
    },
    {
      id: "expressvpn",
      name: "ExpressVPN",
      tagline: "Premium Speed",
      description: "The fastest VPN with premium features, streaming optimization, and 24/7 support.",
      icon: Rocket,
      price: "$12.95/mo",
      features: [
        "3000+ Servers",
        "Lightway Protocol",
        "MediaStreamer",
        "Split Tunneling",
        "5 Devices"
      ],
      gradient: "from-red-500 to-pink-500", 
      popular: false,
      speed: "Fastest",
      servers: "3000+",
      security: "Premium",
      isPremium: true
    }
  ];

  const handleSelectVPN = (vpnId: string) => {
    const vpn = vpnOptions.find(v => v.id === vpnId);
    if (vpn?.isPremium) {
      setSelectedVPN(vpnId);
      setShowPayment(true);
    } else {
      setSelectedVPN(vpnId);
      // For free option, just show selected state
    }
  };

  const handlePaymentSuccess = (details: any) => {
    setPaymentDetails(details);
    setShowPayment(false);
    setPaymentSuccess(true);
  };

  const handleClosePayment = () => {
    setShowPayment(false);
    setSelectedVPN(null);
  };

  const handleCloseSuccess = () => {
    setPaymentSuccess(false);
    setPaymentDetails(null);
  };

  const selectedVPNData = vpnOptions.find(v => v.id === selectedVPN);

  return (
    <>
      <section id="vpn-versions" className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 fire-text">Choose Your VPN Version</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the perfect VPN solution for your needs. From basic DNS protection to premium 
            military-grade security. All premium payments go directly to your Ijaxt VPN account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vpnOptions.map((vpn) => {
            const Icon = vpn.icon;
            const isSelected = selectedVPN === vpn.id;
            
            return (
              <Card 
                key={vpn.id} 
                className={`
                  relative p-8 fire-card transition-all duration-300 cursor-pointer
                  ${isSelected ? 'ring-2 ring-green-400 transform scale-105' : ''}
                  ${vpn.popular ? 'border-green-400' : ''}
                `}
                onClick={() => handleSelectVPN(vpn.id)}
              >
                {vpn.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500 text-black px-3 py-1 fire-effect popular-badge">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 fire-effect">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl mb-2 text-green-400">{vpn.name}</h3>
                  <p className="text-sm text-green-300 mb-2">{vpn.tagline}</p>
                  <div className="text-3xl fire-text mb-2">{vpn.price}</div>
                  {vpn.isPremium && (
                    <Badge variant="outline" className="text-xs border-green-400 text-green-400 mb-2">
                      Premium Plan
                    </Badge>
                  )}
                  <p className="text-muted-foreground text-sm">{vpn.description}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Speed:</span>
                    <span className="text-green-400">{vpn.speed}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Servers:</span>
                    <span className="text-green-400">{vpn.servers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Security:</span>
                    <span className="text-green-400">{vpn.security}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-sm text-green-400 uppercase tracking-wide">Features</h4>
                  {vpn.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`
                    w-full transition-all duration-300 vpn-select-button
                    ${isSelected 
                      ? 'bg-green-500 text-black hover:bg-green-400' 
                      : 'bg-green-600 hover:bg-green-500 text-black'
                    }
                  `}
                  size="lg"
                >
                  {isSelected ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      {vpn.isPremium ? 'Selected' : 'Active'}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      {vpn.isPremium ? 'Subscribe Now' : 'Use Free'}
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {selectedVPN && !vpnOptions.find(v => v.id === selectedVPN)?.isPremium && (
          <div className="mt-12 text-center">
            <Card className="p-6 fire-card max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-400 mr-2" />
                <h3 className="text-xl fire-text">Ready to Connect!</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                You've selected {vpnOptions.find(v => v.id === selectedVPN)?.name}. 
                Configure your device using the setup guides below.
              </p>
              <Button 
                className="bg-green-500 hover:bg-green-400 text-black"
                size="lg"
                onClick={() => document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Go to Setup Guide
              </Button>
            </Card>
          </div>
        )}
      </section>

      {/* Payment Modal */}
      {showPayment && selectedVPNData && (
        <Payment
          selectedVPN={selectedVPNData}
          onClose={handleClosePayment}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && paymentDetails && (
        <PaymentSuccess
          paymentDetails={paymentDetails}
          onClose={handleCloseSuccess}
        />
      )}
    </>
  );
}
