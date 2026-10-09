import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import { NextResponse, NextRequest } from "next/server";
import { avatarModration, ModerationUnavailableError } from "@/lib/avatarModration";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
    }
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 2MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let allowed: boolean;
    try {
      allowed = await avatarModration(buffer, file.type);
    } catch (err) {
      if (err instanceof ModerationUnavailableError) {
        return NextResponse.json(
          { error: "Image check is busy right now. Please try again in a minute." },
          { status: 503 }
        );
      }
      throw err;
    }
    if (!allowed) {
      return NextResponse.json({ error: "Image not allowed as avatar It may contain Nudity or Sexually explicit content " }, { status: 400 });
    }
    await connectToDatabase();
    const user = await User.findById(token.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `avatars/${token.userId}`,
            resource_type: "image",
            format: "webp", 
            moderation: "aws_rek",
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/cloudinary-webhook`,
            transformation: [
              {
                width: 300,
                height: 300,
                crop: "fill",
                gravity: "face",
                quality: "auto:eco",
                fetch_format: "webp",
              },
            ],
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });


    if (!uploadResult?.secure_url || !uploadResult?.public_id) {
      throw new Error("Cloudinary returned invalid upload result");
    }

    if (uploadResult.moderation?.[0]?.status === "rejected") {
      await cloudinary.uploader.destroy(uploadResult.public_id);
      return NextResponse.json(
        { error: "Image not allowed as avatar" },
        { status: 400 }
      );
    }


    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.error("Old avatar delete failed:", err);
      }
    }

    user.avatar = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
    await user.save();

    return NextResponse.json({
      avatar: user.avatar,
    });
  } catch (error: any) {
    console.error("Avatar upload error:", error);

    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}