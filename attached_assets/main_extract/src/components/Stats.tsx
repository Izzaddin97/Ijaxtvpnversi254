import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { Activity, Zap, Server, Users } from "lucide-react";

export function Stats() {
  const [stats, setStats] = useState({
    speed: 0,
    uptime: 0,
    servers: 0,
    users: 0
  });

  const [displayStats, setDisplayStats] = useState({
    speed: "0",
    uptime: "0.0",
    servers: "0",
    users: "0"
  });

  useEffect(() => {
    // Simulate real-time data updates
    const updateStats = () => {
      const newStats = {
        speed: 45 + Math.random() * 15, // 45-60 Gbps
        uptime: 99.85 + Math.random() * 0.14, // 99.85-99.99%
        servers: 1247 + Math.floor(Math.random() * 100), // 1247-1347 servers
        users: 12500000 + Math.floor(Math.random() * 1000000) // 12.5M-13.5M users
      };
      
      setStats(newStats);
      
      // Format display values
      setDisplayStats({
        speed: `${Math.round(newStats.speed)}+`,
        uptime: newStats.uptime.toFixed(2),
        servers: `${Math.round(newStats.servers/100)*100}+`,
        users: `${(newStats.users/1000000).toFixed(1)}M+`
      });
    };

    // Initial load with animation
    const timer = setTimeout(() => {
      updateStats();
    }, 500);

    // Update every 5 seconds for real-time feel
    const interval = setInterval(updateStats, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 fire-text">Trusted by Millions</h2>
          <p className="text-muted-foreground text-lg">
            Real-time performance metrics that speak for themselves
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 text-center fire-card hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-3">
              <Zap className="h-8 w-8 text-green-400 group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl text-green-400 fire-text mb-2 font-bold">
              {displayStats.speed}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              Gbps Speed
            </div>
            <div className="mt-2 text-xs text-green-300/70">
              Ultra-fast connections
            </div>
          </Card>

          <Card className="p-6 text-center fire-card hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-3">
              <Activity className="h-8 w-8 text-green-400 group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl text-green-400 fire-text mb-2 font-bold">
              {displayStats.uptime}%
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              Uptime
            </div>
            <div className="mt-2 text-xs text-green-300/70">
              99.9% availability
            </div>
          </Card>

          <Card className="p-6 text-center fire-card hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-3">
              <Server className="h-8 w-8 text-green-400 group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl text-green-400 fire-text mb-2 font-bold">
              {displayStats.servers}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              Servers
            </div>
            <div className="mt-2 text-xs text-green-300/70">
              Global network
            </div>
          </Card>

          <Card className="p-6 text-center fire-card hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-8 w-8 text-green-400 group-hover:animate-pulse" />
            </div>
            <div className="text-3xl md:text-4xl text-green-400 fire-text mb-2 font-bold">
              {displayStats.users}
            </div>
            <div className="text-sm text-muted-foreground uppercase tracking-wide">
              Active Users
            </div>
            <div className="mt-2 text-xs text-green-300/70">
              Trusted worldwide
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}