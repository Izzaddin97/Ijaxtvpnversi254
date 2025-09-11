// cloudflare-api.js
class CloudflareAPI {
    constructor() {
        this.apiToken = process.env.CLOUDFLARE_API_TOKEN;
        this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        this.baseURL = 'https://api.cloudflare.com/client/v4';
        
        if (!this.apiToken || !this.accountId) {
            throw new Error('Cloudflare API token and Account ID are required');
        }
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.apiToken}`,
                'Content-Type': 'application/json',
            },
            ...options,
        };

        try {
            const response = await fetch(url, defaultOptions);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(`Cloudflare API Error: ${data.errors[0].message}`);
            }
            
            return data;
        } catch (error) {
            console.error('Cloudflare API Request Failed:', error);
            throw error;
        }
    }

    // Example: Get Zone Information
    async getZones() {
        return await this.makeRequest('/zones');
    }

    // Example: Get DNS Records for a Zone
    async getDNSRecords(zoneId) {
        return await this.makeRequest(`/zones/${zoneId}/dns_records`);
    }

    // Example: Create DNS Record
    async createDNSRecord(zoneId, recordData) {
        return await this.makeRequest(`/zones/${zoneId}/dns_records`, {
            method: 'POST',
            body: JSON.stringify(recordData),
        });
    }
}

// Export the class
module.exports = CloudflareAPI;