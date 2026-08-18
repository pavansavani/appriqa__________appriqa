import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Ensure they are admin
    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile || !["super_admin", "admin", "store_manager"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch customers
    const { data: customers, error } = await supabaseServer
      .from("profiles")
      .select("*")
      .eq("role", "customer")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, customers }, { status: 200 });
  } catch (error: any) {
    console.error("GET Customers Error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
