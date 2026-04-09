import { logger } from '@/lib/logger';

// Load balancer configuration for million-user scale
interface ServerInstance {
  id: string;
  host: string;
  port: number;
  region: string;
  weight: number;
  connections: number;
  maxConnections: number;
  healthy: boolean;
  lastHealthCheck: Date;
  responseTime: number;
}

// Load balancing strategies
enum LoadBalanceStrategy {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  WEIGHTED_ROUND_ROBIN = 'weighted_round_robin',
  RESPONSE_TIME = 'response_time',
  IP_HASH = 'ip_hash'
}

// Advanced load balancer for high traffic
export class LoadBalancer {
  private servers: ServerInstance[] = [];
  private currentServerIndex: number = 0;
  private strategy: LoadBalanceStrategy = LoadBalanceStrategy.RESPONSE_TIME;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private metrics: Map<string, any> = new Map();

  constructor() {
    this.initializeServers();
    this.startHealthChecks();
  }

  private initializeServers() {
    // Initialize server instances for horizontal scaling
    this.servers = [
      {
        id: 'server-1',
        host: process.env.SERVER_1_HOST || 'localhost',
        port: parseInt(process.env.SERVER_1_PORT || '3001'),
        region: 'us-east-1',
        weight: 3,
        connections: 0,
        maxConnections: 1000,
        healthy: true,
        lastHealthCheck: new Date(),
        responseTime: 50
      },
      {
        id: 'server-2',
        host: process.env.SERVER_2_HOST || 'localhost',
        port: parseInt(process.env.SERVER_2_PORT || '3002'),
        region: 'us-west-2',
        weight: 2,
        connections: 0,
        maxConnections: 1000,
        healthy: true,
        lastHealthCheck: new Date(),
        responseTime: 75
      },
      {
        id: 'server-3',
        host: process.env.SERVER_3_HOST || 'localhost',
        port: parseInt(process.env.SERVER_3_PORT || '3003'),
        region: 'eu-west-1',
        weight: 2,
        connections: 0,
        maxConnections: 1000,
        healthy: true,
        lastHealthCheck: new Date(),
        responseTime: 100
      },
      {
        id: 'server-4',
        host: process.env.SERVER_4_HOST || 'localhost',
        port: parseInt(process.env.SERVER_4_PORT || '3004'),
        region: 'ap-southeast-1',
        weight: 1,
        connections: 0,
        maxConnections: 1000,
        healthy: true,
        lastHealthCheck: new Date(),
        responseTime: 150
      }
    ];

    logger.info('Load balancer initialized with servers', {
      serverCount: this.servers.length,
      strategy: this.strategy
    });
  }

  private startHealthChecks() {
    // Health check every 30 seconds
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000);
  }

  private async performHealthChecks() {
    const healthCheckPromises = this.servers.map(server => 
      this.checkServerHealth(server)
    );

    try {
      const results = await Promise.allSettled(healthCheckPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.servers[index].healthy = false;
          logger.error(`Server ${this.servers[index].id} health check failed`, {
            error: result.reason
          });
        } else {
          this.servers[index].healthy = true;
          this.servers[index].lastHealthCheck = new Date();
        }
      });
    } catch (error) {
      logger.error('Health check batch failed', { error: String(error) });
    }
  }

  private async checkServerHealth(server: ServerInstance): Promise<boolean> {
    try {
      const startTime = Date.now();
      
      // Simulate health check - in production, this would be an actual HTTP request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`http://${server.host}:${server.port}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      server.responseTime = responseTime;
      
      return response.ok;
    } catch (error) {
      logger.error(`Health check failed for server ${server.id}`, { 
        error: String(error) 
      });
      return false;
    }
  }

  // Get best server based on strategy
  public getServer(clientIP?: string): ServerInstance | null {
    const healthyServers = this.servers.filter(server => 
      server.healthy && 
      server.connections < server.maxConnections
    );

    if (healthyServers.length === 0) {
      logger.error('No healthy servers available');
      return null;
    }

    switch (this.strategy) {
      case LoadBalanceStrategy.ROUND_ROBIN:
        return this.getRoundRobinServer(healthyServers);
      
      case LoadBalanceStrategy.LEAST_CONNECTIONS:
        return this.getLeastConnectionsServer(healthyServers);
      
      case LoadBalanceStrategy.WEIGHTED_ROUND_ROBIN:
        return this.getWeightedRoundRobinServer(healthyServers);
      
      case LoadBalanceStrategy.RESPONSE_TIME:
        return this.getBestResponseTimeServer(healthyServers);
      
      case LoadBalanceStrategy.IP_HASH:
        return clientIP ? this.getIPHashServer(healthyServers, clientIP) : 
                      this.getRoundRobinServer(healthyServers);
      
      default:
        return this.getRoundRobinServer(healthyServers);
    }
  }

  private getRoundRobinServer(servers: ServerInstance[]): ServerInstance {
    const server = servers[this.currentServerIndex % servers.length];
    this.currentServerIndex++;
    return server;
  }

  private getLeastConnectionsServer(servers: ServerInstance[]): ServerInstance {
    return servers.reduce((prev, current) => 
      prev.connections < current.connections ? prev : current
    );
  }

  private getWeightedRoundRobinServer(servers: ServerInstance[]): ServerInstance {
    const totalWeight = servers.reduce((sum, server) => sum + server.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const server of servers) {
      random -= server.weight;
      if (random <= 0) {
        return server;
      }
    }
    
    return servers[0];
  }

  private getBestResponseTimeServer(servers: ServerInstance[]): ServerInstance {
    return servers.reduce((prev, current) => 
      prev.responseTime < current.responseTime ? prev : current
    );
  }

  private getIPHashServer(servers: ServerInstance[], clientIP: string): ServerInstance {
    const hash = this.hashIP(clientIP);
    const index = Math.abs(hash) % servers.length;
    return servers[index];
  }

  private hashIP(ip: string): number {
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      const char = ip.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  // Increment connection count for server
  public addConnection(serverId: string): boolean {
    const server = this.servers.find(s => s.id === serverId);
    if (server && server.connections < server.maxConnections) {
      server.connections++;
      this.updateMetrics(serverId, 'connection_added');
      return true;
    }
    return false;
  }

  // Decrement connection count for server
  public removeConnection(serverId: string): boolean {
    const server = this.servers.find(s => s.id === serverId);
    if (server && server.connections > 0) {
      server.connections--;
      this.updateMetrics(serverId, 'connection_removed');
      return true;
    }
    return false;
  }

  // Update server metrics
  private updateMetrics(serverId: string, event: string): void {
    if (!this.metrics.has(serverId)) {
      this.metrics.set(serverId, {
        connections: 0,
        requests: 0,
        errors: 0,
        responseTime: 0,
        lastUpdated: new Date()
      });
    }

    const metrics = this.metrics.get(serverId)!;
    
    switch (event) {
      case 'connection_added':
        metrics.connections++;
        break;
      case 'connection_removed':
        metrics.connections--;
        break;
      case 'request':
        metrics.requests++;
        break;
      case 'error':
        metrics.errors++;
        break;
    }
    
    metrics.lastUpdated = new Date();
  }

  // Get load balancer statistics
  public getStats(): {
    totalConnections: number;
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    healthyServers: number;
    unhealthyServers: number;
    servers: ServerInstance[];
  } {
    const totalConnections = this.servers.reduce((sum, server) => sum + server.connections, 0);
    const healthyServers = this.servers.filter(server => server.healthy).length;
    const unhealthyServers = this.servers.length - healthyServers;
    
    let totalRequests = 0;
    let totalErrors = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;

    for (const metrics of this.metrics.values()) {
      totalRequests += metrics.requests || 0;
      totalErrors += metrics.errors || 0;
      if (metrics.responseTime) {
        totalResponseTime += metrics.responseTime;
        responseTimeCount++;
      }
    }

    const averageResponseTime = responseTimeCount > 0 ? 
      totalResponseTime / responseTimeCount : 0;

    return {
      totalConnections,
      totalRequests,
      totalErrors,
      averageResponseTime,
      healthyServers,
      unhealthyServers,
      servers: this.servers
    };
  }

  // Change load balancing strategy
  public setStrategy(strategy: LoadBalanceStrategy): void {
    this.strategy = strategy;
    logger.info('Load balancer strategy changed', { strategy });
  }

  // Add new server dynamically
  public addServer(server: ServerInstance): void {
    this.servers.push(server);
    logger.info('New server added to load balancer', { 
      serverId: server.id,
      host: server.host,
      port: server.port
    });
  }

  // Remove server
  public removeServer(serverId: string): boolean {
    const index = this.servers.findIndex(s => s.id === serverId);
    if (index !== -1) {
      const removed = this.servers.splice(index, 1)[0];
      this.metrics.delete(serverId);
      logger.info('Server removed from load balancer', { 
        serverId: removed.id 
      });
      return true;
    }
    return false;
  }

  // Graceful shutdown
  public shutdown(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    logger.info('Load balancer shut down');
  }
}

// Auto-scaling manager
export class AutoScaler {
  private loadBalancer: LoadBalancer;
  private scalingThresholds = {
    maxConnectionsPerServer: 800,
    minConnectionsPerServer: 100,
    scaleUpCooldown: 300000, // 5 minutes
    scaleDownCooldown: 600000, // 10 minutes
    maxServers: 10,
    minServers: 2
  };
  private lastScaleUp: number = 0;
  private lastScaleDown: number = 0;

  constructor(loadBalancer: LoadBalancer) {
    this.loadBalancer = loadBalancer;
    this.startMonitoring();
  }

  private startMonitoring() {
    setInterval(() => {
      this.checkScalingNeeded();
    }, 60000); // Check every minute
  }

  private checkScalingNeeded(): void {
    const stats = this.loadBalancer.getStats();
    const now = Date.now();

    // Check scale up conditions
    if (this.shouldScaleUp(stats, now)) {
      this.scaleUp();
      this.lastScaleUp = now;
    }

    // Check scale down conditions
    if (this.shouldScaleDown(stats, now)) {
      this.scaleDown();
      this.lastScaleDown = now;
    }
  }

  private shouldScaleUp(stats: any, now: number): boolean {
    const averageConnections = stats.totalConnections / stats.servers.length;
    
    return (
      averageConnections > this.scalingThresholds.maxConnectionsPerServer &&
      now - this.lastScaleUp > this.scalingThresholds.scaleUpCooldown &&
      stats.servers.length < this.scalingThresholds.maxServers
    );
  }

  private shouldScaleDown(stats: any, now: number): boolean {
    const averageConnections = stats.totalConnections / stats.servers.length;
    
    return (
      averageConnections < this.scalingThresholds.minConnectionsPerServer &&
      now - this.lastScaleDown > this.scalingThresholds.scaleDownCooldown &&
      stats.servers.length > this.scalingThresholds.minServers
    );
  }

  private scaleUp(): void {
    logger.info('Auto-scaling up - adding new server');
    
    // In production, this would provision new server instances
    const newServer: ServerInstance = {
      id: `server-${Date.now()}`,
      host: 'new-server-host',
      port: 3000 + this.loadBalancer.getStats().servers.length,
      region: 'us-east-1',
      weight: 1,
      connections: 0,
      maxConnections: 1000,
      healthy: true,
      lastHealthCheck: new Date(),
      responseTime: 100
    };

    this.loadBalancer.addServer(newServer);
  }

  private scaleDown(): void {
    logger.info('Auto-scaling down - removing least used server');
    
    const stats = this.loadBalancer.getStats();
    const leastUsedServer = stats.servers
      .filter(s => s.connections === 0)
      .sort((a, b) => b.responseTime - a.responseTime)[0];

    if (leastUsedServer) {
      this.loadBalancer.removeServer(leastUsedServer.id);
    }
  }

  public getScalingStats(): {
    lastScaleUp: number;
    lastScaleDown: number;
    thresholds: any;
  } {
    return {
      lastScaleUp: this.lastScaleUp,
      lastScaleDown: this.lastScaleDown,
      thresholds: this.scalingThresholds
    };
  }
}

// Global instances
export const loadBalancer = new LoadBalancer();
export const autoScaler = new AutoScaler(loadBalancer);
