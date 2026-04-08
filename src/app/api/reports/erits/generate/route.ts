import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateMonthlyRentalIncomeTax } from "@/lib/kra/calculator";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);

  const successfulPayments = await db.payment.findMany({
    where: {
      landlordId: session.user.id,
      status: "SUCCESS",
      paidAt: {
        gte: start,
        lt: end,
      },
    },
  });

  const grossRent = successfulPayments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  const summary = calculateMonthlyRentalIncomeTax(grossRent);

  return NextResponse.json({
    month: start.toISOString().slice(0, 7),
    successfulPayments: successfulPayments.length,
    ...summary,
  });
}
