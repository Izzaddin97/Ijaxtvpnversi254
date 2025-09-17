import { Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin } from "lucide-react";
import newLogoImage from 'figma:asset/3a38e1d7fbacdeadb73c05ce4884be639290250c.png';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black border-t border-green-400/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={newLogoImage}
                alt="Ijaxt VPN"
                className="logo-circular-xs logo-circular-brand-focus"
                draggable={false}
              />
              <span className="text-xl fire-text alfa-slab-one-regular">Ijaxt VPN</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Fast, secure, and private VPN service. Protecting your online privacy 
              with military-grade encryption and global network access.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-green-400 alfa-slab-one-regular">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Home</a></li>
              <li><a href="#features" className="text-muted-foreground hover:text-green-400 transition-colors">Features</a></li>
              <li><a href="#vpn-versions" className="text-muted-foreground hover:text-green-400 transition-colors">VPN Plans</a></li>
              <li><a href="#network-security" className="text-muted-foreground hover:text-green-400 transition-colors">Security</a></li>
              <li><a href="#setup" className="text-muted-foreground hover:text-green-400 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-green-400 alfa-slab-one-regular">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">VPN Protection</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Network Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Privacy Shield</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">IoT Security</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-400 transition-colors">Enterprise</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-green-400 alfa-slab-one-regular">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">support@ijaxt.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">Global Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-muted-foreground">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-400/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 Ijaxt VPN. All rights reserved. | Privacy Policy | Terms of Service
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Shield className="w-4 h-4 text-green-400 mr-1" />
                Secure & Legal
              </span>
              <span>No Logs Policy</span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
