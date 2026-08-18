import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: downloads, error } = await supabaseServer
      .from("digital_products")
      .select(`
        *,
        products (
          id,
          name,
          price
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, downloads }, { status: 200 });
  } catch (error: any) {
    console.error("GET Downloads Error:", error);
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    const { data, error } = await supabaseServer
      .from("digital_products")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, download: data }, { status: 201 });
  } catch (error: any) {
    console.error("POST Download Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create digital product mapping" }, { status: 500 });
  }
}
