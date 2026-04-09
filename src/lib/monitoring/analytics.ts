import { logger } from '@/lib/logger';
import { redisManager } from '@/lib/cache/redis';

// Analytics system for million-user scale
export class AnalyticsEngine {
  private metrics: Map<string, any> = new Map();
  private aggregationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startAggregation();
  }

  private startAggregation() {
    // Aggregate metrics every minute
    this.aggregationInterval = setInterval(() => {
      this.aggregateAndStore();
    }, 60000);
  }

  // Track user activity
  async trackUserActivity(userId: string, action: string, metadata?: any) {
    const event = {
      userId,
      action,
      timestamp: Date.now(),
      metadata
    };

    // Store in Redis for real-time analytics
    await redisManager.set(
      `activity:${userId}:${Date.now()}`,
      JSON.stringify(event),
      86400 // 24 hours
    );

    // Update real-time counters
    await this.updateRealTimeMetrics(action);
  }

  // Track API performance
  async trackAPICall(endpoint: string, responseTime: number, statusCode: number) {
    const metrics = {
      endpoint,
      responseTime,
      statusCode,
      timestamp: Date.now()
    };

    // Store performance metrics
    await redisManager.set(
      `api:${endpoint}:${Date.now()}`,
      JSON.stringify(metrics),
      3600 // 1 hour
    );

    // Update performance counters
    await this.updatePerformanceMetrics(endpoint, responseTime, statusCode);
  }

  // Track business metrics
  async trackBusinessMetric(metric: string, value: number, dimensions?: any) {
    const businessMetric = {
      metric,
      value,
      dimensions,
      timestamp: Date.now()
    };

    await redisManager.set(
      `business:${metric}:${Date.now()}`,
      JSON.stringify(businessMetric),
      86400 // 24 hours
    );
  }

  private async updateRealTimeMetrics(action: string) {
    const key = `realtime:${action}`;
    const current = await redisManager.get(key);
    const count = current ? parseInt(current) : 0;
    await redisManager.set(key, (count + 1).toString(), 300); // 5 minutes
  }

  private async updatePerformanceMetrics(endpoint: string, responseTime: number, statusCode: number) {
    const key = `performance:${endpoint}`;
    const current = await redisManager.get(key);
    
    if (current) {
      const metrics = JSON.parse(current);
      metrics.totalCalls += 1;
      metrics.totalResponseTime += responseTime;
      metrics.averageResponseTime = metrics.totalResponseTime / metrics.totalCalls;
      
      if (statusCode >= 400) {
        metrics.errorCount += 1;
      }
      
      await redisManager.set(key, JSON.stringify(metrics), 3600);
    } else {
      const metrics = {
        totalCalls: 1,
        totalResponseTime: responseTime,
        averageResponseTime: responseTime,
        errorCount: statusCode >= 400 ? 1 : 0
      };
      
      await redisManager.set(key, JSON.stringify(metrics), 3600);
    }
  }

  private async aggregateAndStore() {
    try {
      // Aggregate user activity
      await this.aggregateUserActivity();
      
      // Aggregate API performance
      await this.aggregateAPIPerformance();
      
      // Aggregate business metrics
      await this.aggregateBusinessMetrics();
      
      logger.info('Analytics aggregation completed');
    } catch (error) {
      logger.error('Analytics aggregation failed', { error: String(error) });
    }
  }

  private async aggregateUserActivity() {
    // Get all activity keys
    const activityKeys = await redisManager.getRedis().keys('activity:*');
    
    // Aggregate by action
    const actionCounts: Map<string, number> = new Map();
    
    for (const key of activityKeys) {
      const events = await redisManager.get(key);
      if (events) {
        const event = JSON.parse(events);
        const count = actionCounts.get(event.action) || 0;
        actionCounts.set(event.action, count + 1);
      }
    }
    
    // Store aggregated results
    for (const [action, count] of actionCounts) {
      await redisManager.set(
        `aggregated:activity:${action}:${Math.floor(Date.now() / 60000)}`,
        count.toString(),
        86400
      );
    }
  }

  private async aggregateAPIPerformance() {
    // Get all performance keys
    const performanceKeys = await redisManager.getRedis().keys('performance:*');
    
    for (const key of performanceKeys) {
      const metrics = await redisManager.get(key);
      if (metrics) {
        const parsed = JSON.parse(metrics);
        
        // Store aggregated performance data
        await redisManager.set(
          `aggregated:performance:${key}:${Math.floor(Date.now() / 60000)}`,
          JSON.stringify(parsed),
          86400
        );
      }
    }
  }

  private async aggregateBusinessMetrics() {
    // Get all business metric keys
    const businessKeys = await redisManager.getRedis().keys('business:*');
    
    for (const key of businessKeys) {
      const metrics = await redisManager.get(key);
      if (metrics) {
        const parsed = JSON.parse(metrics);
        
        // Store aggregated business metrics
        await redisManager.set(
          `aggregated:business:${key}:${Math.floor(Date.now() / 60000)}`,
          JSON.stringify(parsed),
          86400
        );
      }
    }
  }

  // Get real-time dashboard data
  async getRealTimeDashboard() {
    const [
      activeUsers,
      totalRevenue,
      activeProperties,
      pendingPayments,
      serverLoad
    ] = await Promise.all([
      this.getActiveUsersCount(),
      this.getTotalRevenue(),
      this.getActivePropertiesCount(),
      this.getPendingPaymentsCount(),
      this.getServerLoad()
    ]);

    return {
      activeUsers,
      totalRevenue,
      activeProperties,
      pendingPayments,
      serverLoad,
      timestamp: Date.now()
    };
  }

  private async getActiveUsersCount(): Promise<number> {
    const keys = await redisManager.getRedis().keys('realtime:user:*');
    let total = 0;
    
    for (const key of keys) {
      const count = await redisManager.get(key);
      if (count) {
        total += parseInt(count);
      }
    }
    
    return total;
  }

  private async getTotalRevenue(): Promise<number> {
    // Simulate revenue calculation
    return Math.floor(Math.random() * 1000000);
  }

  private async getActivePropertiesCount(): Promise<number> {
    // Simulate property count
    return Math.floor(Math.random() * 10000);
  }

  private async getPendingPaymentsCount(): Promise<number> {
    // Simulate pending payments
    return Math.floor(Math.random() * 1000);
  }

  private async getServerLoad(): Promise<number> {
    // Simulate server load
    return Math.random() * 100;
  }

  // Get performance metrics
  async getPerformanceMetrics() {
    const keys = await redisManager.getRedis().keys('performance:*');
    const metrics: any = {};
    
    for (const key of keys) {
      const data = await redisManager.get(key);
      if (data) {
        metrics[key] = JSON.parse(data);
      }
    }
    
    return metrics;
  }

  // Get user activity analytics
  async getUserActivityAnalytics(timeRange: string = '1h') {
    const keys = await redisManager.getRedis().keys(`aggregated:activity:*`);
    const analytics: any = {};
    
    for (const key of keys) {
      const data = await redisManager.get(key);
      if (data) {
        analytics[key] = parseInt(data);
      }
    }
    
    return analytics;
  }

  // Get business metrics
  async getBusinessMetrics() {
    const keys = await redisManager.getRedis().keys('aggregated:business:*');
    const metrics: any = {};
    
    for (const key of keys) {
      const data = await redisManager.get(key);
      if (data) {
        metrics[key] = JSON.parse(data);
      }
    }
    
    return metrics;
  }

  // Generate analytics report
  async generateReport(type: string, timeRange: string) {
    switch (type) {
      case 'user_activity':
        return await this.getUserActivityAnalytics(timeRange);
      case 'performance':
        return await this.getPerformanceMetrics();
      case 'business':
        return await this.getBusinessMetrics();
      case 'dashboard':
        return await this.getRealTimeDashboard();
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  // Cleanup old data
  async cleanup() {
    const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    // Clean up old activity data
    const activityKeys = await redisManager.getRedis().keys('activity:*');
    for (const key of activityKeys) {
      const timestamp = parseInt(key.split(':')[1]);
      if (timestamp < cutoffTime) {
        await redisManager.del(key);
      }
    }
    
    // Clean up old API data
    const apiKeys = await redisManager.getRedis().keys('api:*');
    for (const key of apiKeys) {
      const timestamp = parseInt(key.split(':')[1]);
      if (timestamp < cutoffTime) {
        await redisManager.del(key);
      }
    }
    
    logger.info('Analytics cleanup completed');
  }

  // Graceful shutdown
  shutdown() {
    if (this.aggregationInterval) {
      clearInterval(this.aggregationInterval);
      this.aggregationInterval = null;
    }
    
    logger.info('Analytics engine shut down');
  }
}

// Global analytics instance
export const analyticsEngine = new AnalyticsEngine();
