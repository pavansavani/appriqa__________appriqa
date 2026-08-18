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
      .from("contact_messages")
      .update({ status: body.status }) 
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: data }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Contact Message Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update contact message" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await supabaseServer
      .from("contact_messages")
      .delete()
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Contact Message Error:", error);
    return NextResponse.json({ error: "Failed to delete contact message" }, { status: 500 });
  }
}
