/**
 * Environment Configuration for Ijaxt VPN
 * Securely manages environment variables and API keys
 */

export interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  cloudflare: {
    apiToken?: string;
    accountId?: string;
  };
  app: {
    environment: 'development' | 'staging' | 'production';
    apiBaseUrl: string;
  };
}

/**
 * Gets environment configuration with secure defaults
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  // Check if we're in browser or server environment
  const isBrowser = typeof window !== 'undefined';
  
  return {
    supabase: {
      url: getEnvVar('VITE_SUPABASE_URL') || getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || `https://ecjuilkiworwehktwnxe.supabase.co`,
      anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY') || getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjanVpbGtpd29yd2Voa3R3bnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzQwMDgsImV4cCI6MjA3MjIxMDAwOH0.F_UlSqn6QXXgQL-IYyhTMURY0XDNxGEK6Ft01sN6Z0o',
      serviceRoleKey: !isBrowser ? getEnvVar('SUPABASE_SERVICE_ROLE_KEY') : undefined
    },
    cloudflare: {
      apiToken: !isBrowser ? getEnvVar('CLOUDFLARE_API_TOKEN') : undefined,
      accountId: !isBrowser ? getEnvVar('CLOUDFLARE_ACCOUNT_ID') : undefined
    },
    app: {
      environment: (getEnvVar('MODE') || getEnvVar('NODE_ENV') as any) || 'development',
      apiBaseUrl: getEnvVar('VITE_API_BASE_URL') || getEnvVar('NEXT_PUBLIC_API_BASE_URL') || 'https://ecjuilkiworwehktwnxe.supabase.co/functions/v1/make-server-24b1698c'
    }
  };
}

/**
 * Safely gets environment variable for Vite environment
 */
function getEnvVar(key: string): string | undefined {
  // Handle browser environment
  if (typeof window !== 'undefined') {
    // Check if variable is available on window object
    return (window as any)[key];
  }
  
  // Handle Vite environment
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // Convert Next.js style env vars to Vite style
    const viteKey = key.replace('NEXT_PUBLIC_', 'VITE_').replace('NODE_ENV', 'MODE');
    return import.meta.env[viteKey] || import.meta.env[key];
  }
  
  // Handle Node.js/server environment (Supabase functions)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // Handle Deno environment (Supabase Edge Functions)
  if (typeof Deno !== 'undefined' && Deno.env) {
    return Deno.env.get(key);
  }
  
  return undefined;
}

/**
 * Validates that required environment variables are present
 */
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const required = [
    { vite: 'VITE_SUPABASE_URL', next: 'NEXT_PUBLIC_SUPABASE_URL' },
    { vite: 'VITE_SUPABASE_ANON_KEY', next: 'NEXT_PUBLIC_SUPABASE_ANON_KEY' }
  ];
  
  const missing: string[] = [];
  
  for (const keyPair of required) {
    const viteValue = getEnvVar(keyPair.vite);
    const nextValue = getEnvVar(keyPair.next);
    
    if (!viteValue && !nextValue) {
      missing.push(`${keyPair.vite} or ${keyPair.next}`);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Masks sensitive values for logging
 */
export function maskSensitiveValue(value: string, visibleChars: number = 4): string {
  if (!value || value.length <= visibleChars * 2) {
    return '***';
  }
  
  const start = value.substring(0, visibleChars);
  const end = value.substring(value.length - visibleChars);
  const middle = '*'.repeat(Math.max(0, value.length - (visibleChars * 2)));
  
  return `${start}${middle}${end}`;
}

/**
 * Secure API key generator
 */
export function generateSecureApiKey(): string {
  const prefix = 'ijaxt_';
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const checksum = btoa(timestamp + random).substring(0, 8);
  
  return `${prefix}${timestamp}_${random}_${checksum}`;
}

// Export singleton instance
export const env = getEnvironmentConfig();
