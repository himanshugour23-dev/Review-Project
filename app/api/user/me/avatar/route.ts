import cloudinary from "@/lib/cloudinary";
import { connectToDatabase } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    
    const token = await getToken({ req });
    
    if (!token?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 2MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    await connectToDatabase();

    
    const user = await User.findById(token.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `avatars/${token.userId}`,
          resource_type: "image",
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
      ).end(buffer);
    });

    
    user.avatar = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
    await user.save();

    return NextResponse.json({
      avatar: user.avatar,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
