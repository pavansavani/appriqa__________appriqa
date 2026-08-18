import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json({ error: "Identifier and password are required." }, { status: 400 });
    }

    let admin;
    try {
      admin = await AuthService.getAdminByIdentifier(identifier);
    } catch (e) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (admin.status !== "active") {
      return NextResponse.json({ error: "Account is not active." }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Update last login
    await AuthService.updateLastLogin(admin.id);

    // Fetch permissions associated with the role
    const permissions = await AuthService.getRolePermissions(admin.role_id);

    const userToSerialize = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role_id,
      department: admin.department,
      permissions: permissions,
    };

    // Create session (sets the cookie)
    await createSession(userToSerialize);

    return NextResponse.json({
      success: true,
      user: userToSerialize,
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
