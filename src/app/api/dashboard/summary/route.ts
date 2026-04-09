import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limiter";
import { SecurityUtils } from "@/lib/security";

export async function GET(request: Request) {
  try {
    // Rate limiting
    const rateLimitResult = generalRateLimit.check(request as any);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || '',
          }
        }
      );
    }

    // Authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Validate user ID format
    if (!/^[a-z0-9]{24,25}$/.test(session.user.id)) {
      console.error("Invalid user ID format:", session.user.id);
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      );
    }

    // Fetch dashboard data with optimized queries
    const [propertiesCount, tenantsCount, pendingPayments, successPayments] =
      await Promise.all([
        db.property.count({ 
          where: { landlordId: session.user.id }
        }),
        db.tenant.count({ 
          where: { landlordId: session.user.id }
        }),
        db.payment.count({
          where: { 
            landlordId: session.user.id, 
            status: "PENDING",
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
        }),
        db.payment.aggregate({
          where: { 
            landlordId: session.user.id, 
            status: "SUCCESS",
            paidAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
            }
          },
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

    const response = NextResponse.json({
      propertiesCount,
      tenantsCount,
      pendingPayments,
      totalCollected: Number(successPayments._sum.amount ?? 0),
      successfulPayments: successPayments._count.id || 0,
      period: "last_30_days",
    });

    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining?.toString() || '0');
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime?.toString() || '');
    
    return response;

  } catch (error) {
    console.error("Dashboard API error:", error);
    
    // Handle database errors gracefully
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
