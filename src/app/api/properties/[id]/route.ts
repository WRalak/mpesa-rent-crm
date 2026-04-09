import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generalRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";
import { propertySchema, PropertyInput } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const property = await db.property.findFirst({
      where: { 
        id: params.id,
        landlordId: session.user.id 
      },
      include: {
        _count: {
          select: { tenants: true },
        },
        tenants: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            unitNumber: true,
            rentAmount: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    logger.api('GET', `/api/properties/${params.id}`, 200, undefined, {
      userId: session.user.id,
      propertyId: property.id,
    });

    return NextResponse.json(property);
  } catch (error) {
    logger.error('Failed to fetch property', { error: String(error) });
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if property exists and belongs to user
    const existingProperty = await db.property.findFirst({
      where: { 
        id: params.id,
        landlordId: session.user.id 
      },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const property = await db.property.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        _count: {
          select: { tenants: true },
        },
      },
    });

    logger.api('PUT', `/api/properties/${params.id}`, 200, undefined, {
      userId: session.user.id,
      propertyId: property.id,
      propertyName: property.name,
    });

    return NextResponse.json(property);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Failed to update property', { 
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
      { error: `Failed to update property: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if property exists and belongs to user
    const existingProperty = await db.property.findFirst({
      where: { 
        id: params.id,
        landlordId: session.user.id 
      },
    });

    if (!existingProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Delete property (this will also delete related tenants and payments due to cascade)
    await db.property.delete({
      where: { id: params.id },
    });

    logger.api('DELETE', `/api/properties/${params.id}`, 200, undefined, {
      userId: session.user.id,
      propertyId: params.id,
      propertyName: existingProperty.name,
    });

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    logger.error('Failed to delete property', { error: String(error) });
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
