import { NextRequest } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export class RateLimiter {
  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15 minutes
    private maxRequests: number = 100
  ) {}

  check(request: NextRequest): { success: boolean; resetTime?: number; remaining?: number } {
    const identifier = this.getIdentifier(request);
    const now = Date.now();
    
    // Clean up expired entries
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key);
      }
    }

    const existing = store.get(identifier);
    
    if (!existing) {
      store.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return { success: true, remaining: this.maxRequests - 1 };
    }

    if (now > existing.resetTime) {
      // Reset the window
      existing.count = 1;
      existing.resetTime = now + this.windowMs;
      return { success: true, remaining: this.maxRequests - 1 };
    }

    if (existing.count >= this.maxRequests) {
      return { 
        success: false, 
        resetTime: existing.resetTime,
        remaining: 0 
      };
    }

    existing.count++;
    return { success: true, remaining: this.maxRequests - existing.count };
  }

  private getIdentifier(request: NextRequest): string {
    // Try to get IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    return ip;
  }
}

export const authRateLimit = new RateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes for auth
export const generalRateLimit = new RateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
