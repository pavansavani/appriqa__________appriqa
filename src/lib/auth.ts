import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET || "default_super_secret_key_appriqa_admin";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createSession(adminData: any) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
  const session = await encrypt({ ...adminData, expires });

  const cookieStore = await cookies();
  cookieStore.set("admin_session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session) return null;
  
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest, response: NextResponse) {
  const session = request.cookies.get("admin_session")?.value;
  if (!session) return response;

  try {
    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    parsed.expires = expires;
    const res = await encrypt(parsed);

    response.cookies.set({
      name: "admin_session",
      value: res,
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (error) {
    // Invalid session, ignore
    return response;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
