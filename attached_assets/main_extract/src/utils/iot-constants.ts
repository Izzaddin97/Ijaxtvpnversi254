// IoT Dashboard device data and constants
import { 
  Camera, 
  Thermometer, 
  Lightbulb, 
  Monitor, 
  Router, 
  Smartphone 
} from "lucide-react";

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning';
  icon: any;
  security: 'secure' | 'vulnerable' | 'protected';
  lastSeen: string;
  dataUsage: number;
  batteryLevel?: number;
  temperature?: number;
  isProtected: boolean;
}

export const INITIAL_IOT_DEVICES: IoTDevice[] = [
  {
    id: "1",
    name: "Smart Security Camera",
    type: "Camera",
    status: "online",
    icon: Camera,
    security: "protected",
    lastSeen: "2 minutes ago",
    dataUsage: 85,
    batteryLevel: 92,
    isProtected: true
  },
  {
    id: "2", 
    name: "Smart Thermostat",
    type: "Climate Control",
    status: "online",
    icon: Thermometer,
    security: "secure",
    lastSeen: "1 minute ago",
    dataUsage: 45,
    temperature: 24,
    isProtected: true
  },
  {
    id: "3",
    name: "Smart Light Bulbs",
    type: "Lighting",
    status: "online",
    icon: Lightbulb,
    security: "secure",
    lastSeen: "30 seconds ago",
    dataUsage: 12,
    isProtected: false
  },
  {
    id: "4",
    name: "Smart TV",
    type: "Entertainment",
    status: "warning",
    icon: Monitor,
    security: "vulnerable",
    lastSeen: "5 minutes ago",
    dataUsage: 156,
    isProtected: false
  },
  {
    id: "5",
    name: "WiFi Router",
    type: "Network",
    status: "online",
    icon: Router,
    security: "protected",
    lastSeen: "Active",
    dataUsage: 234,
    isProtected: true
  },
  {
    id: "6",
    name: "Mobile Phone",
    type: "Personal Device",
    status: "online",
    icon: Smartphone,
    security: "protected",
    lastSeen: "Now",
    dataUsage: 89,
    batteryLevel: 67,
    isProtected: true
  }
];

export const INITIAL_IOT_STATS = {
  totalDevices: 6,
  onlineDevices: 5,
  secureDevices: 4,
  dataTransfer: 621,
  threatsBlocked: 23
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online': return 'text-green-400';
    case 'offline': return 'text-red-400';
    case 'warning': return 'text-yellow-400';
    default: return 'text-muted-foreground';
  }
};