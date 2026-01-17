import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import User from "@/models/User";

export async function requireAdmin() {
  const token = await getToken({
    req: { headers: { cookie: cookies().toString() } } as any,
  });

  if (!token?.userId) throw new Error("Unauthorized");

  const user = await User.findById(token.userId);
  if (!user || user.role !== "admin") throw new Error("Forbidden");

  return user;
}
