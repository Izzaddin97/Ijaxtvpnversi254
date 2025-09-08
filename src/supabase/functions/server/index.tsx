import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Data Transfer API key validation middleware
const validateDataTransferKey = async (c: any, next: any) => {
  const apiKey = c.req.header('X-API-Key');
  const storedKey = await kv.get('data_transfer_api_key');
  
  if (!apiKey || !storedKey || apiKey !== storedKey) {
    return c.json({ error: 'Invalid or missing API key' }, 401);
  }
  
  await next();
};

// Health check endpoint
app.get("/make-server-24b1698c/health", (c) => {
  return c.json({ status: "ok" });
});

// Generate and store a new API key for data transfer
app.post("/make-server-24b1698c/generate-api-key", async (c) => {
  try {
    const apiKey = `ijaxt_${crypto.randomUUID().replace(/-/g, '')}`;
    await kv.set('data_transfer_api_key', apiKey);
    
    return c.json({ 
      success: true, 
      apiKey,
      message: 'API key generated successfully. Store this securely - it will be required for all data transfer operations.'
    });
  } catch (error) {
    console.log('Error generating API key:', error);
    return c.json({ error: 'Failed to generate API key' }, 500);
  }
});

// Get current API key (for verification)
app.get("/make-server-24b1698c/verify-api-key", async (c) => {
  try {
    const apiKey = c.req.header('X-API-Key');
    const storedKey = await kv.get('data_transfer_api_key');
    
    if (!apiKey || !storedKey || apiKey !== storedKey) {
      return c.json({ valid: false, message: 'Invalid API key' }, 401);
    }
    
    return c.json({ 
      valid: true, 
      message: 'API key is valid',
      keyPrefix: apiKey.substring(0, 12) + '...'
    });
  } catch (error) {
    console.log('Error verifying API key:', error);
    return c.json({ error: 'Failed to verify API key' }, 500);
  }
});

// Export all data
app.get("/make-server-24b1698c/export-data", validateDataTransferKey, async (c) => {
  try {
    // Get all data from KV store
    const allData = await kv.getByPrefix('');
    
    // Organize data by categories
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        source: 'Ijaxt VPN'
      },
      vpnStats: allData.filter(item => item.key.startsWith('vpn_stats_')),
      imsiData: allData.filter(item => item.key.startsWith('imsi_')),
      networkData: allData.filter(item => item.key.startsWith('network_')),
      iotDevices: allData.filter(item => item.key.startsWith('iot_device_')),
      securityEvents: allData.filter(item => item.key.startsWith('security_event_')),
      userPreferences: allData.filter(item => item.key.startsWith('user_pref_')),
      systemConfig: allData.filter(item => item.key.startsWith('system_config_')),
      paymentData: allData.filter(item => item.key.startsWith('payment_')),
      rawData: allData
    };
    
    console.log(`Data export completed: ${allData.length} items exported`);
    
    return c.json({
      success: true,
      data: exportData,
      summary: {
        totalItems: allData.length,
        categories: {
          vpnStats: exportData.vpnStats.length,
          imsiData: exportData.imsiData.length,
          networkData: exportData.networkData.length,
          iotDevices: exportData.iotDevices.length,
          securityEvents: exportData.securityEvents.length,
          userPreferences: exportData.userPreferences.length,
          systemConfig: exportData.systemConfig.length,
          paymentData: exportData.paymentData.length
        }
      }
    });
  } catch (error) {
    console.log('Error exporting data:', error);
    return c.json({ error: 'Failed to export data', details: error.message }, 500);
  }
});

// Import data
app.post("/make-server-24b1698c/import-data", validateDataTransferKey, async (c) => {
  try {
    const body = await c.req.json();
    const { data, overwrite = false } = body;
    
    if (!data || !data.rawData) {
      return c.json({ error: 'Invalid data format. Expected data.rawData array.' }, 400);
    }
    
    let imported = 0;
    let skipped = 0;
    let errors = [];
    
    for (const item of data.rawData) {
      try {
        if (!item.key || item.value === undefined) {
          errors.push(`Invalid item format: ${JSON.stringify(item)}`);
          continue;
        }
        
        // Check if key exists and handle overwrite
        if (!overwrite) {
          const existing = await kv.get(item.key);
          if (existing !== null) {
            skipped++;
            continue;
          }
        }
        
        await kv.set(item.key, item.value);
        imported++;
      } catch (itemError) {
        errors.push(`Failed to import ${item.key}: ${itemError.message}`);
      }
    }
    
    console.log(`Data import completed: ${imported} imported, ${skipped} skipped, ${errors.length} errors`);
    
    return c.json({
      success: true,
      summary: {
        imported,
        skipped,
        errors: errors.length,
        totalProcessed: data.rawData.length
      },
      errors: errors.slice(0, 10), // Return first 10 errors
      message: `Import completed successfully. ${imported} items imported.`
    });
  } catch (error) {
    console.log('Error importing data:', error);
    return c.json({ error: 'Failed to import data', details: error.message }, 500);
  }
});

// Clear all data (with confirmation)
app.delete("/make-server-24b1698c/clear-data", validateDataTransferKey, async (c) => {
  try {
    const body = await c.req.json();
    const { confirm } = body;
    
    if (confirm !== 'DELETE_ALL_DATA') {
      return c.json({ 
        error: 'Confirmation required. Send { "confirm": "DELETE_ALL_DATA" } to proceed.' 
      }, 400);
    }
    
    // Get all keys first
    const allData = await kv.getByPrefix('');
    const keys = allData.map(item => item.key);
    
    // Delete all data except the API key
    const keysToDelete = keys.filter(key => key !== 'data_transfer_api_key');
    
    if (keysToDelete.length > 0) {
      await kv.mdel(keysToDelete);
    }
    
    console.log(`Data cleared: ${keysToDelete.length} items deleted`);
    
    return c.json({
      success: true,
      message: `All data cleared successfully. ${keysToDelete.length} items deleted.`,
      deletedCount: keysToDelete.length
    });
  } catch (error) {
    console.log('Error clearing data:', error);
    return c.json({ error: 'Failed to clear data', details: error.message }, 500);
  }
});

// Get data statistics
app.get("/make-server-24b1698c/data-stats", validateDataTransferKey, async (c) => {
  try {
    const allData = await kv.getByPrefix('');
    
    const stats = {
      totalItems: allData.length,
      categories: {
        vpnStats: allData.filter(item => item.key.startsWith('vpn_stats_')).length,
        imsiData: allData.filter(item => item.key.startsWith('imsi_')).length,
        networkData: allData.filter(item => item.key.startsWith('network_')).length,
        iotDevices: allData.filter(item => item.key.startsWith('iot_device_')).length,
        securityEvents: allData.filter(item => item.key.startsWith('security_event_')).length,
        userPreferences: allData.filter(item => item.key.startsWith('user_pref_')).length,
        systemConfig: allData.filter(item => item.key.startsWith('system_config_')).length,
        paymentData: allData.filter(item => item.key.startsWith('payment_')).length,
        other: allData.filter(item => 
          !item.key.startsWith('vpn_stats_') &&
          !item.key.startsWith('imsi_') &&
          !item.key.startsWith('network_') &&
          !item.key.startsWith('iot_device_') &&
          !item.key.startsWith('security_event_') &&
          !item.key.startsWith('user_pref_') &&
          !item.key.startsWith('system_config_') &&
          !item.key.startsWith('payment_') &&
          item.key !== 'data_transfer_api_key'
        ).length
      },
      lastUpdated: new Date().toISOString()
    };
    
    return c.json({
      success: true,
      stats
    });
  } catch (error) {
    console.log('Error getting data stats:', error);
    return c.json({ error: 'Failed to get data statistics', details: error.message }, 500);
  }
});

// Seed demo data
app.post("/make-server-24b1698c/seed-demo-data", validateDataTransferKey, async (c) => {
  try {
    // Demo data seeds
    const demoData = [
      // VPN Statistics
      { key: 'vpn_stats_total_users', value: 125847 },
      { key: 'vpn_stats_active_connections', value: 8432 },
      { key: 'vpn_stats_data_transferred', value: '2.4TB' },
      { key: 'vpn_stats_server_locations', value: 67 },
      
      // IMSI Data
      { 
        key: 'imsi_malaysia_pool_1', 
        value: {
          imsi: '502134567890123',
          operator: 'Maxis',
          status: 'active',
          lastUsed: new Date().toISOString(),
          securityLevel: 'high'
        }
      },
      { 
        key: 'imsi_malaysia_pool_2', 
        value: {
          imsi: '502194567890124',
          operator: 'Celcom',
          status: 'active',
          lastUsed: new Date().toISOString(),
          securityLevel: 'high'
        }
      },
      {
        key: 'imsi_rotation_config',
        value: {
          rotationInterval: 300000,
          maxUsageCount: 100,
          autoRotateEnabled: true,
          backupPoolSize: 10
        }
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
        }
      },
      {
        key: 'network_stealer_config',
        value: {
          enabled: true,
          targetBandwidth: '1Gbps',
          priorityLevel: 'high',
          stealthMode: true,
          harvestingRate: '85%'
        }
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
        }
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
        }
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
        }
      },
      
      // User Preferences
      { key: 'user_pref_default_theme', value: 'green_fire' },
      { key: 'user_pref_auto_rotation', value: true },
      { key: 'user_pref_notification_level', value: 'high' },
      
      // System Configuration
      { key: 'system_config_version', value: '2.1.0' },
      { key: 'system_config_maintenance_mode', value: false },
      { key: 'system_config_backup_interval', value: 86400000 },
      
      // Payment Data
      {
        key: 'payment_subscription_pro',
        value: {
          plan: 'pro',
          price: 19.99,
          currency: 'USD',
          features: ['5 Devices', '100+ Servers', 'Priority Support', 'IMSI Manager'],
          popular: true
        }
      }
    ];
    
    let seeded = 0;
    const errors = [];
    
    for (const item of demoData) {
      try {
        await kv.set(item.key, item.value);
        seeded++;
      } catch (error) {
        errors.push(`Failed to seed ${item.key}: ${error.message}`);
      }
    }
    
    console.log(`Demo data seeded: ${seeded} items, ${errors.length} errors`);
    
    return c.json({
      success: true,
      seeded,
      errors: errors.length,
      message: `Demo data seeded successfully! ${seeded} items added.`,
      errorDetails: errors.slice(0, 5) // Return first 5 errors if any
    });
  } catch (error) {
    console.log('Error seeding demo data:', error);
    return c.json({ error: 'Failed to seed demo data', details: error.message }, 500);
  }
});

// AI Chat using Cloudflare AI API
app.post("/make-server-24b1698c/ai-chat", async (c) => {
  try {
    const { messages } = await c.req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: 'Invalid messages format' }, 400);
    }

    const cloudflareApiToken = Deno.env.get('CLOUDFLARE_API_TOKEN');
    if (!cloudflareApiToken) {
      return c.json({ error: 'Cloudflare API token not configured' }, 500);
    }

    // Add system context for VPN assistant
    const systemMessage = {
      role: 'system',
      content: `You are an AI assistant for Ijaxt VPN, a professional VPN service. You help users with:
      - VPN setup and configuration
      - Troubleshooting connection issues
      - Explaining VPN security features (AES-256 encryption, no-log policy, kill switch)
      - IMSI management and rotation
      - Network optimization and performance
      - IoT security and device monitoring
      - Subscription plans and billing
      - General VPN and cybersecurity advice
      
      Be helpful, professional, and knowledgeable about VPN technology. Keep responses concise but informative. If asked about competitors, focus on Ijaxt VPN's strengths.`
    };

    const apiMessages = [systemMessage, ...messages];

    const cloudflareAccountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');
    if (!cloudflareAccountId) {
      return c.json({ error: 'Cloudflare account ID not configured' }, 500);
    }

    // Call Cloudflare AI API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cloudflareApiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: apiMessages
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.log('Cloudflare AI API Error:', errorData);
      return c.json({ 
        error: 'AI service temporarily unavailable. Please try again later.' 
      }, 500);
    }

    const result = await response.json();
    
    // Extract response from Cloudflare AI format
    const aiResponse = result.result?.response || result.response || 'I apologize, but I encountered an issue. Please try again.';
    
    console.log('AI Chat - Messages:', messages.length, 'Response length:', aiResponse.length);
    
    return c.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.log('Error in AI chat:', error);
    return c.json({ 
      error: 'AI assistant is temporarily unavailable. Please try again later.',
      details: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);