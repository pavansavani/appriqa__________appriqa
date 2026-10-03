import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// We need to define standard roles array to check against
const ADMIN_ROLES = ["super_admin", "admin", "store_manager", "website_manager"];

export async function GET(request: Request) {
  try {
    // 1. Verify caller is Super Admin
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized - No token" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    
    // Use the anon client or server client to verify token
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
    }

    // Check caller's role in profiles
    const { data: callerProfile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (callerProfile?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Requires super_admin" }, { status: 403 });
    }

    // 2. Fetch managers from profiles
    const { data: managers, error: fetchError } = await supabaseServer
      .from("profiles")
      .select("*")
      .in("role", ADMIN_ROLES)
      .order("created_at", { ascending: false });

    if (fetchError) throw fetchError;

    return NextResponse.json({ success: true, managers }, { status: 200 });
  } catch (error: any) {
    console.error("GET Managers Error:", error);
    return NextResponse.json({ error: "Failed to fetch managers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify caller is Super Admin
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: callerProfile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (callerProfile?.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Requires super_admin" }, { status: 403 });
    }

    // 2. Extract body
    const body = await request.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // 3. Check if user already exists
    const { data: existingProfile } = await supabaseServer
      .from("profiles")
      .select("id, auth_user_id")
      .eq("email", email.trim())
      .single();

    if (existingProfile) {
      // User already exists, just update their role
      const { error: updateError } = await supabaseServer
        .from("profiles")
        .update({ role })
        .eq("auth_user_id", existingProfile.auth_user_id);
        
      if (updateError) {
        throw updateError;
      }
      
      return NextResponse.json({ success: true, updated: true }, { status: 200 });
    }

    // 4. Create user in auth.users via admin invite
    const { data: inviteData, error: inviteError } = await supabaseServer.auth.admin.inviteUserByEmail(
      email.trim(),
      { data: { full_name: name } }
    );

    let newUserId;

    if (inviteError) {
      if (inviteError.message.includes("already been registered")) {
        // Edge case: User exists in auth.users but their profiles row was deleted!
        // We need to fetch their ID and just recreate the profile row.
        const { data: listData } = await supabaseServer.auth.admin.listUsers();
        const existingUser = listData?.users.find((u: any) => u.email === email.trim());
        
        if (existingUser) {
          newUserId = existingUser.id;
        } else {
          return NextResponse.json({ error: "User exists but could not be resolved." }, { status: 400 });
        }
      } else {
        console.error("Supabase Admin Invite User Error:", inviteError);
        return NextResponse.json({ error: inviteError.message }, { status: 400 });
      }
    } else {
      newUserId = inviteData.user.id;
    }

    // Wait briefly to ensure trigger completes
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { error: updateError } = await supabaseServer
      .from("profiles")
      .update({ role })
      .eq("auth_user_id", newUserId);

    if (updateError) {
      // If the row didn't exist yet, insert it manually just in case
      await supabaseServer.from("profiles").insert({
        auth_user_id: newUserId,
        email: inviteData.user?.email ?? email,
        full_name: name,
        first_name: name.split(" ")[0],
        last_name: name.split(" ").slice(1).join(" "),
        role: role
      });
    }

    return NextResponse.json({ success: true, user: inviteData.user ?? { email }, invited: true }, { status: 201 });
  } catch (error: any) {
    console.error("POST Managers Error:", error);
    return NextResponse.json({ error: "Failed to invite/update manager" }, { status: 500 });
  }
}
