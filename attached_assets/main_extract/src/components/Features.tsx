import { Card } from "./ui/card";
import { 
  Shield, 
  Zap, 
  Globe, 
  Eye, 
  Lock, 
  Smartphone, 
  Cpu,
  CheckCircle,
  Star,
  Award,
  TrendingUp
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "Military-Grade Encryption",
      description: "AES-256 bit encryption with ChaCha20 protocol ensures your data is completely secure from any surveillance or hacking attempts.",
      highlight: "Most Secure",
      premium: true
    },
    {
      icon: Eye,
      title: "Zero-Log Privacy Policy", 
      description: "Strictly verified no-log policy. We never track, collect, store, or share any of your personal data or browsing activity.",
      highlight: "Privacy First",
      premium: true
    },
    {
      icon: Zap,
      title: "Ultra-Fast Performance",
      description: "Lightning-fast speeds up to 10Gbps with our optimized WireGuard protocol and premium Tier-1 network infrastructure.", 
      highlight: "Speed Optimized",
      premium: true
    },
    {
      icon: Globe,
      title: "Global Network Access",
      description: "Access content worldwide with 1000+ servers in 50+ countries, including specialized streaming and P2P servers.",
      highlight: "Worldwide",
      premium: false
    },
    {
      icon: Lock,
      title: "Advanced Kill Switch",
      description: "Intelligent network kill switch with DNS leak protection automatically secures your connection if VPN drops unexpectedly.",
      highlight: "Auto-Protection", 
      premium: true
    },
    {
      icon: Smartphone,
      title: "Unlimited Multi-Device",
      description: "Protect unlimited devices simultaneously - phones, tablets, computers, routers, and smart devices with one account.",
      highlight: "All Devices",
      premium: false
    },
    {
      icon: Cpu,
      title: "AI-Powered Optimization",
      description: "Smart server selection with AI-driven routing automatically connects you to the fastest and most secure servers.",
      highlight: "AI Enhanced",
      premium: true
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-4 fire-text alfa-slab-heading">Why Choose Ijaxt VPN?</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Experience the internet without limits. Our advanced features ensure your privacy, 
          security, and freedom online with cutting-edge technology and premium infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="p-6 fire-card hover:scale-105 transition-all duration-300 relative group">
              {feature.premium && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-black text-xs px-2 py-1 rounded-full flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </div>
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-4 fire-effect group-hover:bg-green-500 group-hover:border-green-400 transition-all duration-300">
                  <Icon className="h-8 w-8 text-green-400 group-hover:text-black transition-all duration-300" />
                </div>
                
                <div className="flex items-center mb-2">
                  <h3 className="text-lg text-green-400 alfa-slab-one-regular">{feature.title}</h3>
                </div>
                
                <div className="mb-3">
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                    {feature.highlight}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 fire-card">
          <div className="flex items-center mb-4">
            <Award className="h-8 w-8 text-green-400 mr-3" />
            <h3 className="text-2xl fire-text alfa-slab-one-regular">Industry Recognition</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>Rated #1 VPN by TechRadar 2024</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>Winner: Best Privacy Tool Award</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>5-Star Rating on Trustpilot</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>Independently Security Audited</span>
            </div>
          </div>
        </Card>

        <Card className="p-8 fire-card">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-8 w-8 text-green-400 mr-3" />
            <h3 className="text-2xl fire-text alfa-slab-one-regular">Performance Metrics</h3>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>99.9% Network Uptime Guarantee</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>Sub-20ms Latency Performance</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>Unlimited Bandwidth & Data</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>24/7 Real-time Network Monitoring</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Money-Back Guarantee */}
      <div className="text-center">
        <Card className="p-8 fire-card transition-all duration-300 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mr-4 fire-effect">
              <CheckCircle className="h-8 w-8 text-black" />
            </div>
            <div className="text-left">
              <h3 className="text-3xl fire-text alfa-slab-heading">30-Day Money-Back Guarantee</h3>
              <p className="text-green-400">Risk-free trial with full refund protection</p>
            </div>
          </div>
          
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Try Ijaxt VPN completely risk-free for 30 days. If you're not 100% satisfied with our service, 
            we'll refund your money immediately - no questions asked, no hidden terms, no complicated process. 
            Your satisfaction and privacy are our top priorities.
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-green-400">
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Instant Activation
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              No Setup Fees
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Cancel Anytime
            </span>
            <span className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Full Refund in 24 Hours
            </span>
          </div>
        </Card>
      </div>
    </section>
  );
}