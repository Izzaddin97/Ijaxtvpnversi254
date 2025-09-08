# Security Configuration Guide

## Environment Variables Setup

### Required Environment Variables

1. **Supabase Configuration**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

2. **Cloudflare AI Configuration**
   ```bash
   CLOUDFLARE_API_TOKEN=your-cloudflare-api-token-here
   CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id-here
   ```

### Security Best Practices

1. **Never Hardcode Credentials**
   - Use environment variables for all sensitive data
   - Store credentials in secure secret management systems
   - Rotate keys regularly

2. **Environment Separation**
   - Use different keys for development, staging, and production
   - Never use production credentials in development

3. **Access Control**
   - Use least-privilege principle for API keys
   - Implement proper authentication and authorization
   - Monitor and log API key usage

### Setting Up Environment Variables

#### For Development (Local)
1. Copy `.env.example` to `.env.local`
2. Fill in your actual values
3. Never commit `.env.local` to version control

#### For Production (Deployment)
1. Use your hosting platform's secret management
2. Set environment variables in your deployment platform
3. Ensure secrets are encrypted at rest

### API Key Security

The system uses secure API key generation with:
- Timestamp-based prefixes
- Random components
- Checksums for validation
- Proper masking in logs

### Current Security Improvements

1. ✅ Fixed hardcoded Cloudflare Account ID
2. ✅ Fixed data export bug in KV store
3. ✅ Added environment variable fallbacks
4. ✅ Created secure configuration management
5. ✅ Added API key masking for logs
6. ✅ Separated browser and server environment handling

### Important Notes

- The provided Supabase Anon Key is safe for client-side use
- Never expose Service Role Keys to browsers
- All sensitive operations are protected by API key validation
- Environment variables are validated on startup