import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectToDatabase } from "@/lib/db";
import Payment from "@/models/payment";
import User from "@/models/User";

export const runtime = "nodejs";

const PREMIUM_DURATION_DAYS = 30;

export async function POST(req: NextRequest) {
  const redirectToFailure = () =>
    NextResponse.redirect(new URL("/payment/failed", req.url), {
      status: 303,
    });

  try {
    const formData = await req.formData();

    const paymentId = String(formData.get("razorpay_payment_id") || "");
    const receivedOrderId = String(formData.get("razorpay_order_id") || "");
    const receivedSignature = String(formData.get("razorpay_signature") || "");

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!receivedOrderId || !keySecret || !paymentId || !receivedSignature) {
      return redirectToFailure();
    }

    await connectToDatabase();

    const payment = await Payment.findOne({
      razorpayOrderId: receivedOrderId,
    });

    if (!payment || !payment.razorpayOrderId) {
      return redirectToFailure();
    }

    // Idempotency guard — if this callback fires twice (double submit,
    // back button + refresh), don't re-process or double-extend access.
    if (payment.status === "captured") {
      return NextResponse.redirect(new URL("/payment/success", req.url), {
        status: 303,
      });
    }

    // Always use the order_id from OUR database, never the one the
    // client/browser sent, to prevent a forged order_id in the signature check.
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${payment.razorpayOrderId}|${paymentId}`)
      .digest("hex");

    const signatureIsValid =
      expectedSignature.length === receivedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(receivedSignature)
      );

    if (!signatureIsValid) {
      await Payment.findByIdAndUpdate(payment._id, {
        $set: { status: "failed" },
      });

      return redirectToFailure();
    }

    await Payment.findByIdAndUpdate(payment._id, {
      $set: {
        status: "captured",
        razorpayPaymentId: paymentId,
        razorpaySignature: receivedSignature,
      },
    });

    // Grant 30 days of premium access from now.
    const expiresAt = new Date(
      Date.now() + PREMIUM_DURATION_DAYS * 24 * 60 * 60 * 1000
    );

    await User.findByIdAndUpdate(payment.userId, {
      $set: {
        "subscription.isPremium": true,
        "subscription.purchasedAt": new Date(),
        "subscription.expiresAt": expiresAt,
      },
    });

    return NextResponse.redirect(new URL("/payment/success", req.url), {
      status: 303,
    });
  } catch (error) {
    console.error("Razorpay callback verification error:", error);
    return redirectToFailure();
  }
}