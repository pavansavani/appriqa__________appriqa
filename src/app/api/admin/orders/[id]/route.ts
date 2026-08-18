import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    
    const { data, error } = await supabaseServer
      .from("orders")
      .update({ status: body.status })
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Order Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
