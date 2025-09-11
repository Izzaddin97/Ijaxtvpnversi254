// app.js
const CloudflareAPI = require('./cloudflare-api');

async function main() {
    try {
        const cloudflare = new CloudflareAPI();
        
        // Get all zones
        const zones = await cloudflare.getZones();
        console.log('Zones:', zones.result);
        
        // If you have a specific zone ID
        if (zones.result.length > 0) {
            const zoneId = zones.result[0].id;
            const dnsRecords = await cloudflare.getDNSRecords(zoneId);
            console.log('DNS Records:', dnsRecords.result);
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();