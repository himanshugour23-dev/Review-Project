import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const timestamp = Number(req.headers.get("x-cld-timestamp"));
    const signature = req.headers.get("x-cld-signature") ?? "";

    const valid = cloudinary.utils.verifyNotificationSignature(
      rawBody,
      timestamp,
      signature
    );
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    if (
      payload.notification_type === "moderation" &&
      payload.moderation_status === "rejected"
    ) {
      const publicId: string = payload.public_id;

      await cloudinary.uploader.destroy(publicId);

      await connectToDatabase();
      await User.updateOne(
        { avatarPublicId: publicId },
        { $unset: { avatar: "", avatarPublicId: "" } } 
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Cloudinary webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}