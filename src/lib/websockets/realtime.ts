import { Server } from 'socket.io';
import { logger } from '@/lib/logger';
import { redisManager } from '@/lib/cache/redis';

// Real-time WebSocket manager for million-user scale
export class RealtimeManager {
  private io: Server;
  private connectedClients: Map<string, any> = new Map();
  private rooms: Map<string, Set<string>> = new Map();

  constructor() {
    this.io = new Server({
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling']
    });
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      const clientId = socket.id;
      logger.info('Client connected', { clientId });

      // Join user to personal room
      socket.on('join_user_room', (userId: string) => {
        socket.join(`user:${userId}`);
        this.connectedClients.set(clientId, { userId, socket });
        this.addToRoom(`user:${userId}`, clientId);
      });

      // Join landlord room
      socket.on('join_landlord_room', (landlordId: string) => {
        socket.join(`landlord:${landlordId}`);
        this.addToRoom(`landlord:${landlordId}`, clientId);
      });

      // Real-time payment updates
      socket.on('payment_status', async (data: any) => {
        await this.broadcastPaymentUpdate(data);
      });

      // Real-time notifications
      socket.on('notification', async (data: any) => {
        await this.broadcastNotification(data);
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected', { clientId });
        this.connectedClients.delete(clientId);
        this.removeFromAllRooms(clientId);
      });
    });
  }

  private async broadcastPaymentUpdate(paymentData: any) {
    // Broadcast to landlord room
    this.io.to(`landlord:${paymentData.landlordId}`).emit('payment_update', paymentData);
    
    // Cache payment status
    await redisManager.set(`payment:${paymentData.id}`, paymentData.status, 300);
  }

  private async broadcastNotification(notificationData: any) {
    const targetRoom = notificationData.userId ? 
      `user:${notificationData.userId}` : 
      `landlord:${notificationData.landlordId}`;
    
    this.io.to(targetRoom).emit('notification', notificationData);
  }

  private addToRoom(roomId: string, clientId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(clientId);
  }

  private removeFromAllRooms(clientId: string) {
    for (const [roomId, clients] of this.rooms) {
      clients.delete(clientId);
    }
  }

  public getStats() {
    return {
      connectedClients: this.connectedClients.size,
      activeRooms: this.rooms.size,
      roomSizes: Array.from(this.rooms.entries()).map(([room, clients]) => ({
        room,
        size: clients.size
      }))
    };
  }
}

export const realtimeManager = new RealtimeManager();
