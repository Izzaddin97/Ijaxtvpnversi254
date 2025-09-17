// Network optimization and carrier data constants
export interface CarrierData {
  name: string;
  signal: number;
  dataOptimized: number;
  bandwidth: number;
  status: 'active' | 'optimizing' | 'offline';
  security: 'secure' | 'enhancing' | 'standard';
  lastAccess: string;
  dataUsed: number;
}

export const INITIAL_CARRIERS: CarrierData[] = [
  {
    name: "Network A",
    signal: 95,
    dataOptimized: 2.4,
    bandwidth: 85,
    status: "active",
    security: "secure",
    lastAccess: "2 min ago",
    dataUsed: 1.2
  },
  {
    name: "Network B",
    signal: 88,
    dataOptimized: 1.8,
    bandwidth: 72,
    status: "optimizing",
    security: "secure",
    lastAccess: "1 min ago",
    dataUsed: 0.9
  },
  {
    name: "Network C",
    signal: 76,
    dataOptimized: 0.5,
    bandwidth: 45,
    status: "offline",
    security: "enhancing",
    lastAccess: "5 min ago",
    dataUsed: 0.3
  }
];

export const INITIAL_NETWORK_STATS = {
  totalDataOptimized: 4.7,
  activeConnections: 2,
  optimizedNetworks: 2,
  efficiencyGain: 67.50,
  currentSpeed: 125,
  privacyMode: true
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'text-green-400';
    case 'optimizing': return 'text-yellow-400'; 
    case 'offline': return 'text-red-400';
    default: return 'text-muted-foreground';
  }
};
