import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requestStkPush } from "@/lib/mpesa/stkpush";
import { hasMpesaCredentials } from "@/lib/mpesa/config";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const payloadSchema = z.object({
  tenantId: z.string().min(1),
  amount: z.number().positive(),
  phone: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!hasMpesaCredentials()) {
    return NextResponse.json(
      { error: "M-Pesa credentials are not configured." },
      { status: 500 }
    );
  }

  const { tenantId, amount, phone } = parsed.data;
  const tenant = await db.tenant.findFirst({
    where: { id: tenantId, landlordId: session.user.id },
  });

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found." }, { status: 404 });
  }

  const payment = await db.payment.create({
    data: {
      amount,
      phoneNumber: phone,
      tenantId: tenant.id,
      landlordId: session.user.id,
      status: "PENDING",
    },
  });

  try {
    const stk = await requestStkPush({
      amount,
      phone,
      accountReference: tenant.unitNumber,
      transactionDesc: `Rent payment for ${tenant.fullName}`,
    });

    return NextResponse.json({
      paymentId: payment.id,
      checkoutRequestId: stk.CheckoutRequestID,
      customerMessage: stk.CustomerMessage,
    });
  } catch (error) {
    await db.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "STK push failed." },
      { status: 500 }
    );
  }
}
