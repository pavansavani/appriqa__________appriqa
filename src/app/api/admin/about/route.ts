import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseServer
      .from("about_page")
      .select("content")
      .eq("id", 1)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, content: data.content }, { status: 200 });
  } catch (error: any) {
    console.error("GET About Page Error:", error);
    return NextResponse.json({ error: "Failed to fetch about page content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    const { data, error } = await supabaseServer
      .from("about_page")
      .update({ content: body.content, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, content: data.content }, { status: 200 });
  } catch (error: any) {
    console.error("PUT About Page Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update about page content" }, { status: 500 });
  }
}
