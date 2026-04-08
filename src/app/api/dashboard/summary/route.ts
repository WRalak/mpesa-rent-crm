import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [propertiesCount, tenantsCount, pendingPayments, successPayments] =
    await Promise.all([
      db.property.count({ where: { landlordId: session.user.id } }),
      db.tenant.count({ where: { landlordId: session.user.id } }),
      db.payment.count({
        where: { landlordId: session.user.id, status: "PENDING" },
      }),
      db.payment.aggregate({
        where: { landlordId: session.user.id, status: "SUCCESS" },
        _sum: { amount: true },
      }),
    ]);

  return NextResponse.json({
    propertiesCount,
    tenantsCount,
    pendingPayments,
    totalCollected: Number(successPayments._sum.amount ?? 0),
  });
}
