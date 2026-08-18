import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: reviews, error } = await supabaseServer
      .from("reviews")
      .select(`
        *,
        products(name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error: any) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
