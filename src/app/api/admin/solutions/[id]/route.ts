import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    body.updated_at = new Date().toISOString();
    
    const { data, error } = await supabaseServer
      .from("solutions")
      .update(body)
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/solutions");
    revalidatePath(`/solutions/${data.slug}`);

    return NextResponse.json({ success: true, solution: data }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Solution Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update solution" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error: fetchError } = await supabaseServer
      .from("solutions")
      .select("slug")
      .eq("id", params.id)
      .single();

    const { error } = await supabaseServer
      .from("solutions")
      .delete()
      .eq("id", params.id);

    if (error) throw error;
    
    revalidatePath("/solutions");
    if (data?.slug) revalidatePath(`/solutions/${data.slug}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Solution Error:", error);
    return NextResponse.json({ error: "Failed to delete solution" }, { status: 500 });
  }
}
