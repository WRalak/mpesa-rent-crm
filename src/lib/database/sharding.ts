import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

// Database shard configuration
interface ShardConfig {
  id: string;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  maxConnections: number;
  region: string;
}

// Shard management for million-user scale
export class DatabaseShardManager {
  private shards: Map<string, PrismaClient> = new Map();
  private shardConfigs: ShardConfig[] = [];
  private connectionPools: Map<string, any> = new Map();

  constructor() {
    this.initializeShards();
  }

  private async initializeShards() {
    // Initialize multiple database shards for horizontal scaling
    this.shardConfigs = [
      {
        id: 'shard-1',
        host: process.env.DB_SHARD_1_HOST || 'localhost',
        port: parseInt(process.env.DB_SHARD_1_PORT || '5432'),
        database: process.env.DB_SHARD_1_DATABASE || 'mpesa_rent_shard_1',
        user: process.env.DB_SHARD_1_USER || 'postgres',
        password: process.env.DB_SHARD_1_PASSWORD || '',
        maxConnections: 50,
        region: 'us-east-1'
      },
      {
        id: 'shard-2',
        host: process.env.DB_SHARD_2_HOST || 'localhost',
        port: parseInt(process.env.DB_SHARD_2_PORT || '5432'),
        database: process.env.DB_SHARD_2_DATABASE || 'mpesa_rent_shard_2',
        user: process.env.DB_SHARD_2_USER || 'postgres',
        password: process.env.DB_SHARD_2_PASSWORD || '',
        maxConnections: 50,
        region: 'us-west-2'
      },
      {
        id: 'shard-3',
        host: process.env.DB_SHARD_3_HOST || 'localhost',
        port: parseInt(process.env.DB_SHARD_3_PORT || '5432'),
        database: process.env.DB_SHARD_3_DATABASE || 'mpesa_rent_shard_3',
        user: process.env.DB_SHARD_3_USER || 'postgres',
        password: process.env.DB_SHARD_3_PASSWORD || '',
        maxConnections: 50,
        region: 'eu-west-1'
      }
    ];

    // Initialize connection pools for each shard
    for (const config of this.shardConfigs) {
      await this.initializeShard(config);
    }
  }

  private async initializeShard(config: ShardConfig) {
    try {
      const connectionString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}?connection_limit=${config.maxConnections}&pool_timeout=30&sslmode=require`;
      
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: connectionString
          }
        }
      });

      // Test connection
      await prisma.$connect();
      
      this.shards.set(config.id, prisma);
      logger.info(`Database shard ${config.id} initialized successfully`, { 
        shardId: config.id, 
        region: config.region 
      });
      
    } catch (error) {
      logger.error(`Failed to initialize shard ${config.id}`, { error: String(error) });
      throw error;
    }
  }

  // Get shard for user based on consistent hashing
  getShardForUser(userId: string): PrismaClient {
    const shardIndex = this.hashUserId(userId) % this.shardConfigs.length;
    const shardId = this.shardConfigs[shardIndex].id;
    const shard = this.shards.get(shardId);
    
    if (!shard) {
      throw new Error(`Shard ${shardId} not available`);
    }
    
    return shard;
  }

  // Get shard for property based on landlord ID
  getShardForProperty(landlordId: string): PrismaClient {
    return this.getShardForUser(landlordId);
  }

  // Get shard for payment based on tenant ID
  getShardForPayment(tenantId: string): PrismaClient {
    return this.getShardForUser(tenantId);
  }

  // Consistent hash function for user distribution
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Health check for all shards
  async healthCheck(): Promise<{ shardId: string; healthy: boolean; latency: number }[]> {
    const results: { shardId: string; healthy: boolean; latency: number }[] = [];
    
    for (const [shardId, prisma] of this.shards) {
      try {
        const start = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        const latency = Date.now() - start;
        
        results.push({ shardId, healthy: true, latency });
      } catch (error) {
        results.push({ shardId, healthy: false, latency: 0 });
        logger.error(`Shard health check failed for ${shardId}`, { error: String(error) });
      }
    }
    
    return results;
  }

  // Get shard statistics
  async getShardStats(): Promise<{ shardId: string; connections: number; queries: number }[]> {
    const stats: { shardId: string; connections: number; queries: number }[] = [];
    
    for (const [shardId, prisma] of this.shards) {
      try {
        const result = await prisma.$queryRaw`SELECT count(*) as connections FROM pg_stat_activity WHERE state = 'active'`;
        const connections = (result as any)[0]?.connections || 0;
        
        stats.push({ 
          shardId, 
          connections,
          queries: Math.floor(Math.random() * 1000) // Placeholder for query count
        });
      } catch (error) {
        logger.error(`Failed to get stats for shard ${shardId}`, { error: String(error) });
        stats.push({ shardId, connections: 0, queries: 0 });
      }
    }
    
    return stats;
  }

  // Graceful shutdown
  async shutdown(): Promise<void> {
    logger.info('Shutting down database shards...');
    
    for (const [shardId, prisma] of this.shards) {
      try {
        await prisma.$disconnect();
        logger.info(`Shard ${shardId} disconnected successfully`);
      } catch (error) {
        logger.error(`Error disconnecting shard ${shardId}`, { error: String(error) });
      }
    }
    
    this.shards.clear();
    logger.info('All database shards shut down');
  }
}

// Global shard manager instance
export const shardManager = new DatabaseShardManager();

// Database factory for getting the right shard
export function getDatabaseForUser(userId: string) {
  return shardManager.getShardForUser(userId);
}

export function getDatabaseForProperty(landlordId: string) {
  return shardManager.getShardForProperty(landlordId);
}

export function getDatabaseForPayment(tenantId: string) {
  return shardManager.getShardForPayment(tenantId);
}
