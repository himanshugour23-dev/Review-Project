import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";
import { connectToDatabase } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import Payment from "@/models/payment";

export const runtime = "nodejs";

// Single fixed price — no plan selection needed.
const PREMIUM_PRICE_PAISE = 9900; // ₹99

export async function POST(req: NextRequest) {
  try {
    const session = await getToken({ req });
    if (!session?.userId) {
      return NextResponse.json(
        { error: "Please log in first." },
        { status: 401 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay keys not found." },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount: PREMIUM_PRICE_PAISE,
      currency: "INR",
      receipt: `premium-${Date.now()}`,
      notes: {
        userId: session.userId,
        purpose: "VaultGG premium purchase (1 month)",
      },
    });

    await connectToDatabase();

    await Payment.create({
      userId: session.userId,
      razorpayOrderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      status: "created",
    });

    return NextResponse.json({
      order,
      keyId,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return NextResponse.json(
      { error: "Could not create Razorpay order." },
      { status: 500 }
    );
  }
}