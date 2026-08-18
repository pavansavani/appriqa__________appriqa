import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: solutions, error } = await supabaseServer
      .from("solutions")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, solutions }, { status: 200 });
  } catch (error: any) {
    console.error("GET Solutions Error:", error);
    return NextResponse.json({ error: "Failed to fetch solutions" }, { status: 500 });
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
      .from("solutions")
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/solutions");
    revalidatePath(`/solutions/${data.slug}`);

    return NextResponse.json({ success: true, solution: data }, { status: 201 });
  } catch (error: any) {
    console.error("POST Solution Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create solution" }, { status: 500 });
  }
}
