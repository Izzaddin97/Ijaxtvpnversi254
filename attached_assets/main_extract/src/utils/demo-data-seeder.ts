import DataTransferAPI from './data-transfer';

interface DemoDataSeed {
  key: string;
  value: any;
  category: string;
  description: string;
}

// Demo data for testing the transfer system
export const demoDataSeeds: DemoDataSeed[] = [
  // VPN Statistics
  {
    key: 'vpn_stats_total_users',
    value: 125847,
    category: 'VPN Statistics',
    description: 'Total registered users'
  },
  {
    key: 'vpn_stats_active_connections',
    value: 8432,
    category: 'VPN Statistics',
    description: 'Currently active VPN connections'
  },
  {
    key: 'vpn_stats_data_transferred',
    value: '2.4TB',
    category: 'VPN Statistics',
    description: 'Total data transferred this month'
  },
  {
    key: 'vpn_stats_server_locations',
    value: 67,
    category: 'VPN Statistics',
    description: 'Number of server locations worldwide'
  },

  // IMSI Data
  {
    key: 'imsi_malaysia_pool_1',
    value: {
      imsi: '502134567890123',
      operator: 'Maxis',
      status: 'active',
      lastUsed: new Date().toISOString(),
      securityLevel: 'high'
    },
    category: 'IMSI Data',
    description: 'Malaysia IMSI pool entry 1'
  },
  {
    key: 'imsi_malaysia_pool_2',
    value: {
      imsi: '502194567890124',
      operator: 'Celcom',
      status: 'active',
      lastUsed: new Date().toISOString(),
      securityLevel: 'high'
    },
    category: 'IMSI Data',
    description: 'Malaysia IMSI pool entry 2'
  },
  {
    key: 'imsi_rotation_config',
    value: {
      rotationInterval: 300000, // 5 minutes
      maxUsageCount: 100,
      autoRotateEnabled: true,
      backupPoolSize: 10
    },
    category: 'IMSI Data',
    description: 'IMSI rotation configuration'
  },

  // Network Data
  {
    key: 'network_optimization_maxis',
    value: {
      provider: 'Maxis',
      status: 'optimized',
      throughput: '98.5%',
      latency: '12ms',
      reliability: '99.8%',
      lastOptimized: new Date().toISOString()
    },
    category: 'Network Data',
    description: 'Maxis network optimization status'
  },
  {
    key: 'network_optimization_digi',
    value: {
      provider: 'Digi',
      status: 'optimized',
      throughput: '97.2%',
      latency: '15ms',
      reliability: '99.5%',
      lastOptimized: new Date().toISOString()
    },
    category: 'Network Data',
    description: 'Digi network optimization status'
  },
  {
    key: 'network_stealer_config',
    value: {
      enabled: true,
      targetBandwidth: '1Gbps',
      priorityLevel: 'high',
      stealthMode: true,
      harvestingRate: '85%'
    },
    category: 'Network Data',
    description: 'Network stealer configuration'
  },

  // IoT Devices
  {
    key: 'iot_device_router_001',
    value: {
      id: 'IJAXT-RTR-001',
      name: 'Main Router',
      type: 'router',
      status: 'online',
      cpu: '23%',
      memory: '67%',
      temperature: '42°C',
      uptime: '15d 8h 23m',
      lastSeen: new Date().toISOString(),
      threats: 0
    },
    category: 'IoT Devices',
    description: 'Main router monitoring data'
  },
  {
    key: 'iot_device_firewall_001',
    value: {
      id: 'IJAXT-FW-001',
      name: 'Security Firewall',
      type: 'firewall',
      status: 'online',
      cpu: '18%',
      memory: '45%',
      temperature: '38°C',
      uptime: '22d 14h 56m',
      lastSeen: new Date().toISOString(),
      threats: 3
    },
    category: 'IoT Devices',
    description: 'Security firewall monitoring data'
  },
  {
    key: 'iot_device_bridge_001',
    value: {
      id: 'IJAXT-BR-001',
      name: 'Network Bridge',
      type: 'bridge',
      status: 'online',
      cpu: '12%',
      memory: '34%',
      temperature: '35°C',
      uptime: '30d 2h 15m',
      lastSeen: new Date().toISOString(),
      threats: 0
    },
    category: 'IoT Devices',
    description: 'Network bridge monitoring data'
  },

  // Security Events
  {
    key: 'security_event_001',
    value: {
      id: 'SEC-001',
      type: 'threat_detected',
      severity: 'medium',
      source: 'firewall',
      description: 'Suspicious traffic pattern detected',
      timestamp: new Date().toISOString(),
      resolved: false,
      action: 'blocked'
    },
    category: 'Security Events',
    description: 'Security threat detection event'
  },
  {
    key: 'security_event_002',
    value: {
      id: 'SEC-002',
      type: 'intrusion_attempt',
      severity: 'high',
      source: 'ids',
      description: 'Multiple failed authentication attempts',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      resolved: true,
      action: 'ip_banned'
    },
    category: 'Security Events',
    description: 'Intrusion attempt detection'
  },

  // User Preferences
  {
    key: 'user_pref_default_theme',
    value: 'green_fire',
    category: 'User Preferences',
    description: 'Default application theme'
  },
  {
    key: 'user_pref_auto_rotation',
    value: true,
    category: 'User Preferences',
    description: 'Auto IMSI rotation preference'
  },
  {
    key: 'user_pref_notification_level',
    value: 'high',
    category: 'User Preferences',
    description: 'Security notification level'
  },

  // System Configuration
  {
    key: 'system_config_version',
    value: '2.1.0',
    category: 'System Configuration',
    description: 'Current system version'
  },
  {
    key: 'system_config_maintenance_mode',
    value: false,
    category: 'System Configuration',
    description: 'Maintenance mode status'
  },
  {
    key: 'system_config_backup_interval',
    value: 86400000, // 24 hours in milliseconds
    category: 'System Configuration',
    description: 'Automatic backup interval'
  },

  // Payment Data
  {
    key: 'payment_subscription_basic',
    value: {
      plan: 'basic',
      price: 9.99,
      currency: 'USD',
      features: ['1 Device', '50+ Servers', 'Basic Support'],
      popular: false
    },
    category: 'Payment Data',
    description: 'Basic subscription plan details'
  },
  {
    key: 'payment_subscription_pro',
    value: {
      plan: 'pro',
      price: 19.99,
      currency: 'USD',
      features: ['5 Devices', '100+ Servers', 'Priority Support', 'IMSI Manager'],
      popular: true
    },
    category: 'Payment Data',
    description: 'Pro subscription plan details'
  },
  {
    key: 'payment_transaction_001',
    value: {
      id: 'TXN-001',
      amount: 19.99,
      currency: 'USD',
      status: 'completed',
      plan: 'pro',
      timestamp: new Date().toISOString(),
      paymentMethod: 'card'
    },
    category: 'Payment Data',
    description: 'Sample payment transaction'
  }
];

export class DemoDataSeeder {
  private api: DataTransferAPI;

  constructor(apiKey: string) {
    this.api = new DataTransferAPI({ apiKey });
  }

  // Seed all demo data
  async seedAllData(): Promise<{ success: boolean; seeded: number; errors: string[] }> {
    const errors: string[] = [];
    let seeded = 0;

    for (const seed of demoDataSeeds) {
      try {
        // Use direct KV store operations if available, otherwise simulate
        await this.seedSingleItem(seed);
        seeded++;
      } catch (error: any) {
        errors.push(`Failed to seed ${seed.key}: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      seeded,
      errors
    };
  }

  // Seed a single data item
  private async seedSingleItem(seed: DemoDataSeed): Promise<void> {
    // This would normally use direct KV store access
    // For now, we'll simulate by creating a structured import
    console.log(`Seeding: ${seed.key} (${seed.category})`);
  }

  // Generate a complete demo backup file
  static generateDemoBackupData(): any {
    const metadata = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      source: 'Ijaxt VPN Demo Data'
    };

    const rawData = demoDataSeeds.map(seed => ({
      key: seed.key,
      value: seed.value
    }));

    const categories = demoDataSeeds.reduce((acc, seed) => {
      const category = seed.category.toLowerCase().replace(/\s+/g, '');
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: {
        metadata,
        rawData,
        // Organized by categories for easy access
        vpnStats: rawData.filter(item => item.key.startsWith('vpn_stats_')),
        imsiData: rawData.filter(item => item.key.startsWith('imsi_')),
        networkData: rawData.filter(item => item.key.startsWith('network_')),
        iotDevices: rawData.filter(item => item.key.startsWith('iot_device_')),
        securityEvents: rawData.filter(item => item.key.startsWith('security_event_')),
        userPreferences: rawData.filter(item => item.key.startsWith('user_pref_')),
        systemConfig: rawData.filter(item => item.key.startsWith('system_config_')),
        paymentData: rawData.filter(item => item.key.startsWith('payment_'))
      },
      summary: {
        totalItems: rawData.length,
        categories: {
          vpnStats: rawData.filter(item => item.key.startsWith('vpn_stats_')).length,
          imsiData: rawData.filter(item => item.key.startsWith('imsi_')).length,
          networkData: rawData.filter(item => item.key.startsWith('network_')).length,
          iotDevices: rawData.filter(item => item.key.startsWith('iot_device_')).length,
          securityEvents: rawData.filter(item => item.key.startsWith('security_event_')).length,
          userPreferences: rawData.filter(item => item.key.startsWith('user_pref_')).length,
          systemConfig: rawData.filter(item => item.key.startsWith('system_config_')).length,
          paymentData: rawData.filter(item => item.key.startsWith('payment_')).length,
          other: 0
        }
      }
    };
  }

  // Get demo data by category
  static getDemoDataByCategory(category: string): DemoDataSeed[] {
    return demoDataSeeds.filter(seed => 
      seed.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Get demo data statistics
  static getDemoDataStats(): {
    total: number;
    categories: Record<string, number>;
    description: string;
  } {
    const categories = demoDataSeeds.reduce((acc, seed) => {
      const key = seed.category.toLowerCase().replace(/\s+/g, '');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: demoDataSeeds.length,
      categories,
      description: 'Comprehensive demo data for Ijaxt VPN system testing and development'
    };
  }
}

// Utility to download demo data as backup file
export const downloadDemoBackup = (): void => {
  const demoData = DemoDataSeeder.generateDemoBackupData();
  
  const blob = new Blob([JSON.stringify(demoData, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ijaxt-vpn-demo-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default DemoDataSeeder;