import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const createPropertySchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  unitCount: z.number().int().min(0),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const properties = await db.property.findMany({
    where: { landlordId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      location: true,
      unitCount: true,
      createdAt: true,
    },
  });

  return NextResponse.json(properties);
}

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
