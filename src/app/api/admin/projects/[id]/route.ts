import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    body.updated_at = new Date().toISOString();
    
    const { data, error } = await supabaseServer
      .from("projects")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/portfolio");
    revalidatePath(`/portfolio/${data.slug}`);

    return NextResponse.json({ success: true, project: data }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Project Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error: fetchError } = await supabaseServer
      .from("projects")
      .select("slug")
      .eq("id", id)
      .single();

    const { error } = await supabaseServer
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    revalidatePath("/portfolio");
    if (data?.slug) revalidatePath(`/portfolio/${data.slug}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Project Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
