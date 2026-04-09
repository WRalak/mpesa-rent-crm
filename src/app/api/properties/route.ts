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

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const property = await db.property.create({
    data: {
      name: parsed.data.name,
      location: parsed.data.location,
      unitCount: parsed.data.unitCount,
      landlordId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      location: true,
      unitCount: true,
      createdAt: true,
    },
  });

  return NextResponse.json(property, { status: 201 });
}
