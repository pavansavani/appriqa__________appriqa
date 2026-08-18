import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: orders, error } = await supabaseServer
      .from("orders")
      .select(`
        *,
        profiles!user_id(first_name, last_name, email)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error: any) {
    console.error("GET Orders Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
