import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: shipments, error } = await supabaseServer
      .from("shipments")
      .select(`
        *,
        orders (
          id,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, shipments }, { status: 200 });
  } catch (error: any) {
    console.error("GET Shipments Error:", error);
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 });
  }
}
