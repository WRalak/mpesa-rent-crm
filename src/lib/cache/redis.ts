import Redis from 'ioredis';
import { logger } from '@/lib/logger';

// Redis configuration for million-user scale
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  maxRetriesPerRequest: number;
  retryDelayOnFailover: number;
  lazyConnect: boolean;
  keepAlive: number;
  family: number;
}

// Redis cluster configuration for high availability
const redisConfigs: RedisConfig[] = [
  {
    host: process.env.REDIS_HOST_1 || 'localhost',
    port: parseInt(process.env.REDIS_PORT_1 || '6379'),
    password: process.env.REDIS_PASSWORD_1,
    db: parseInt(process.env.REDIS_DB_1 || '0'),
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4
  },
  {
    host: process.env.REDIS_HOST_2 || 'localhost',
    port: parseInt(process.env.REDIS_PORT_2 || '6379'),
    password: process.env.REDIS_PASSWORD_2,
    db: parseInt(process.env.REDIS_DB_2 || '0'),
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    lazyConnect: true,
    keepAlive: 30000,
    family: 4
  }
];

// Redis manager for high-performance caching
export class RedisManager {
  private primaryRedis!: Redis; // Definite assignment assertion
  private replicaRedis: Redis[] = [];
  private isPrimaryHealthy: boolean = true;

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis() {
    try {
      // Initialize primary Redis
      this.primaryRedis = new Redis(redisConfigs[0]);
      
      // Initialize replica Redis instances
      this.replicaRedis = redisConfigs.slice(1).map(config => new Redis(config));
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Test connections
      await this.testConnections();
      
      logger.info('Redis cluster initialized successfully', {
        primary: redisConfigs[0].host,
        replicas: redisConfigs.slice(1).map(c => c.host)
      });
      
    } catch (error) {
      logger.error('Failed to initialize Redis cluster', { error: String(error) });
      throw error;
    }
  }

  private setupEventListeners() {
    // Primary Redis events
    this.primaryRedis.on('connect', () => {
      logger.info('Primary Redis connected');
      this.isPrimaryHealthy = true;
    });

    this.primaryRedis.on('error', (error) => {
      logger.error('Primary Redis error', { error: String(error) });
      this.isPrimaryHealthy = false;
      this.failoverToReplica();
    });

    this.primaryRedis.on('close', () => {
      logger.warn('Primary Redis connection closed');
      this.isPrimaryHealthy = false;
    });

    // Replica Redis events
    this.replicaRedis.forEach((replica, index) => {
      replica.on('connect', () => {
        logger.info(`Redis replica ${index + 1} connected`);
      });

      replica.on('error', (error) => {
        logger.error(`Redis replica ${index + 1} error`, { error: String(error) });
      });
    });
  }

  private async testConnections() {
    try {
      await this.primaryRedis.ping();
      logger.info('Primary Redis connection test passed');
    } catch (error) {
      logger.error('Primary Redis connection test failed', { error: String(error) });
      throw error;
    }

    for (let i = 0; i < this.replicaRedis.length; i++) {
      try {
        await this.replicaRedis[i].ping();
        logger.info(`Redis replica ${i + 1} connection test passed`);
      } catch (error) {
        logger.error(`Redis replica ${i + 1} connection test failed`, { error: String(error) });
      }
    }
  }

  private failoverToReplica() {
    if (this.replicaRedis.length > 0) {
      logger.warn('Failing over to Redis replica');
      // Promote first replica to primary
      this.primaryRedis = this.replicaRedis[0];
      this.isPrimaryHealthy = true;
    }
  }

  // Get Redis instance (primary or replica)
  public getRedis(): Redis {
    return this.isPrimaryHealthy ? this.primaryRedis : this.replicaRedis[0];
  }

  // Cache operations with automatic failover
  async get(key: string): Promise<string | null> {
    try {
      const redis = this.getRedis();
      const value = await redis.get(key);
      return value;
    } catch (error) {
      logger.error('Redis get operation failed', { key, error: String(error) });
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      const redis = this.getRedis();
      const result = ttl 
        ? await redis.setex(key, ttl, value)
        : await redis.set(key, value);
      return result === 'OK';
    } catch (error) {
      logger.error('Redis set operation failed', { key, error: String(error) });
      return false;
    }
  }

  async del(key: string): Promise<number> {
    try {
      const redis = this.getRedis();
      return await redis.del(key);
    } catch (error) {
      logger.error('Redis del operation failed', { key, error: String(error) });
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const redis = this.getRedis();
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis exists operation failed', { key, error: String(error) });
      return false;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const redis = this.getRedis();
      const result = await redis.expire(key, ttl);
      return result === 1;
    } catch (error) {
      logger.error('Redis expire operation failed', { key, error: String(error) });
      return false;
    }
  }

  // Batch operations for performance
  async mget(keys: string[]): Promise<(string | null)[]> {
    try {
      const redis = this.getRedis();
      return await redis.mget(...keys);
    } catch (error) {
      logger.error('Redis mget operation failed', { keys, error: String(error) });
      return keys.map(() => null);
    }
  }

  async mset(keyValues: Record<string, string>): Promise<boolean> {
    try {
      const redis = this.getRedis();
      const args: string[] = [];
      
      for (const [key, value] of Object.entries(keyValues)) {
        args.push(key, value);
      }
      
      const result = await redis.mset(...args);
      return result === 'OK';
    } catch (error) {
      logger.error('Redis mset operation failed', { keyValues, error: String(error) });
      return false;
    }
  }

  // Hash operations for complex data structures
  async hget(key: string, field: string): Promise<string | null> {
    try {
      const redis = this.getRedis();
      return await redis.hget(key, field);
    } catch (error) {
      logger.error('Redis hget operation failed', { key, field, error: String(error) });
      return null;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      const redis = this.getRedis();
      return await redis.hset(key, field, value);
    } catch (error) {
      logger.error('Redis hset operation failed', { key, field, error: String(error) });
      return 0;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      const redis = this.getRedis();
      return await redis.hgetall(key);
    } catch (error) {
      logger.error('Redis hgetall operation failed', { key, error: String(error) });
      return {};
    }
  }

  // Set operations for managing collections
  async sadd(key: string, member: string): Promise<number> {
    try {
      const redis = this.getRedis();
      return await redis.sadd(key, member);
    } catch (error) {
      logger.error('Redis sadd operation failed', { key, member, error: String(error) });
      return 0;
    }
  }

  async smembers(key: string): Promise<string[]> {
    try {
      const redis = this.getRedis();
      return await redis.smembers(key);
    } catch (error) {
      logger.error('Redis smembers operation failed', { key, error: String(error) });
      return [];
    }
  }

  async srem(key: string, member: string): Promise<number> {
    try {
      const redis = this.getRedis();
      return await redis.srem(key, member);
    } catch (error) {
      logger.error('Redis srem operation failed', { key, member, error: String(error) });
      return 0;
    }
  }

  // Health check
  async healthCheck(): Promise<{ primary: boolean; replicas: boolean[] }> {
    const results = {
      primary: false,
      replicas: [] as boolean[]
    };

    try {
      await this.primaryRedis.ping();
      results.primary = true;
    } catch (error) {
      logger.error('Primary Redis health check failed', { error: String(error) });
    }

    for (let i = 0; i < this.replicaRedis.length; i++) {
      try {
        await this.replicaRedis[i].ping();
        results.replicas.push(true);
      } catch (error) {
        logger.error(`Redis replica ${i + 1} health check failed`, { error: String(error) });
        results.replicas.push(false);
      }
    }

    return results;
  }

  // Get Redis statistics
  async getStats(): Promise<{ primary: any; replicas: any[] }> {
    const stats = {
      primary: null as any,
      replicas: [] as any[]
    };

    try {
      stats.primary = await this.primaryRedis.info();
    } catch (error) {
      logger.error('Failed to get primary Redis stats', { error: String(error) });
    }

    for (let i = 0; i < this.replicaRedis.length; i++) {
      try {
        const replicaStats = await this.replicaRedis[i].info();
        stats.replicas.push(replicaStats);
      } catch (error) {
        logger.error(`Failed to get replica ${i + 1} stats`, { error: String(error) });
        stats.replicas.push(null);
      }
    }

    return stats;
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    logger.info('Shutting down Redis cluster...');
    
    try {
      await this.primaryRedis.quit();
      logger.info('Primary Redis disconnected');
    } catch (error) {
      logger.error('Error disconnecting primary Redis', { error: String(error) });
    }

    for (let i = 0; i < this.replicaRedis.length; i++) {
      try {
        await this.replicaRedis[i].quit();
        logger.info(`Redis replica ${i + 1} disconnected`);
      } catch (error) {
        logger.error(`Error disconnecting replica ${i + 1}`, { error: String(error) });
      }
    }

    logger.info('Redis cluster shut down');
  }
}

// Global Redis manager instance
export const redisManager = new RedisManager();

// Cache helper functions for common operations
export class CacheService {
  private static readonly DEFAULT_TTL = 3600; // 1 hour
  private static readonly SHORT_TTL = 300; // 5 minutes
  private static readonly LONG_TTL = 86400; // 24 hours

  // Cache user session
  static async cacheUserSession(userId: string, sessionData: any): Promise<boolean> {
    const key = `session:${userId}`;
    return await redisManager.set(key, JSON.stringify(sessionData), this.LONG_TTL);
  }

  static async getUserSession(userId: string): Promise<any> {
    const key = `session:${userId}`;
    const cached = await redisManager.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache property data
  static async cacheProperty(propertyId: string, propertyData: any): Promise<boolean> {
    const key = `property:${propertyId}`;
    return await redisManager.set(key, JSON.stringify(propertyData), this.DEFAULT_TTL);
  }

  static async getProperty(propertyId: string): Promise<any> {
    const key = `property:${propertyId}`;
    const cached = await redisManager.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // Cache payment status
  static async cachePaymentStatus(paymentId: string, status: string): Promise<boolean> {
    const key = `payment:${paymentId}`;
    return await redisManager.set(key, status, this.SHORT_TTL);
  }

  static async getPaymentStatus(paymentId: string): Promise<string | null> {
    const key = `payment:${paymentId}`;
    return await redisManager.get(key);
  }

  // Cache analytics data
  static async cacheAnalytics(landlordId: string, analyticsData: any): Promise<boolean> {
    const key = `analytics:${landlordId}`;
    return await redisManager.set(key, JSON.stringify(analyticsData), this.SHORT_TTL);
  }

  static async getAnalytics(landlordId: string): Promise<any> {
    const key = `analytics:${landlordId}`;
    const cached = await redisManager.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  // Invalidate cache patterns
  static async invalidatePattern(pattern: string): Promise<number> {
    try {
      const redis = redisManager.getRedis();
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        return await redis.del(...keys);
      }
      return 0;
    } catch (error) {
      logger.error('Failed to invalidate cache pattern', { pattern, error: String(error) });
      return 0;
    }
  }

  // Rate limiting
  static async checkRateLimit(identifier: string, limit: number, window: number): Promise<boolean> {
    const key = `rate_limit:${identifier}`;
    const current = await redisManager.get(key);
    
    if (!current) {
      await redisManager.set(key, '1', window);
      return true;
    }
    
    const count = parseInt(current);
    if (count >= limit) {
      return false;
    }
    
    await redisManager.set(key, (count + 1).toString(), window);
    return true;
  }
}
