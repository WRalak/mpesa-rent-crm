import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import { propertySchema, PropertyInput } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const rateLimitResult = generalRateLimit.check(request as any);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = {
      landlordId: session.user.id,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { tenants: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.property.count({ where }),
    ]);

    logger.api('GET', '/api/properties', 200, undefined, {
      userId: session.user.id,
      page,
      limit,
      search,
      total,
    });

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch properties', { error: String(error) });
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: any;
  
  try {
    const rateLimitResult = generalRateLimit.check(request as any);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    
    const validatedData = propertySchema.parse(body) as PropertyInput;

    const property = await db.property.create({
      data: {
        ...validatedData,
        landlordId: session.user.id,
      },
      include: {
        _count: {
          select: { tenants: true },
        },
      },
    });

    logger.api('POST', '/api/properties', 201, undefined, {
      userId: session.user.id,
      propertyId: property.id,
      propertyName: property.name,
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Failed to create property', { 
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: body || 'undefined'
    });
    
    if (error instanceof Error && error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to create property: ${errorMessage}` },
      { status: 500 }
    );
  }
}
