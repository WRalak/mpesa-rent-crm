import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createTenantSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10),
  unitNumber: z.string().min(1),
  rentAmount: z.number().positive(),
  propertyId: z.string().min(1),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tenants = await db.tenant.findMany({
    where: { landlordId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      unitNumber: true,
      rentAmount: true,
    },
  });

  return NextResponse.json(
    tenants.map((t) => ({
      ...t,
      rentAmount: Number(t.rentAmount),
    }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createTenantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const property = await db.property.findFirst({
    where: { id: parsed.data.propertyId, landlordId: session.user.id },
    select: { id: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const tenant = await db.tenant.create({
    data: {
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      unitNumber: parsed.data.unitNumber,
      rentAmount: parsed.data.rentAmount,
      propertyId: parsed.data.propertyId,
      landlordId: session.user.id,
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      unitNumber: true,
      rentAmount: true,
    },
  });

  return NextResponse.json(
    { ...tenant, rentAmount: Number(tenant.rentAmount) },
    { status: 201 }
  );
}
