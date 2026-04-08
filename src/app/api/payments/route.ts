import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payments = await db.payment.findMany({
    where: { landlordId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { tenant: { select: { fullName: true, unitNumber: true } } },
  });

  return NextResponse.json(
    payments.map((p) => ({
      id: p.id,
      amount: Number(p.amount),
      phoneNumber: p.phoneNumber,
      status: p.status,
      mpesaReceipt: p.mpesaReceipt,
      paidAt: p.paidAt,
      tenantName: p.tenant.fullName,
      unitNumber: p.tenant.unitNumber,
    }))
  );
}
