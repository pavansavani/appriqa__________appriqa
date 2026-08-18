import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { data: products, error } = await supabaseServer
      .from("products")
      .select(`
        *,
        categories!category_id (name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Transform relation output to match existing UI
    const formatted = products.map((p: any) => ({
      ...p,
      category: p.categories,
    }));

    return NextResponse.json({ success: true, products: formatted }, { status: 200 });
  } catch (error: any) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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
    
    // Clean up empty UUIDs
    if (body.category_id === "") body.category_id = null;
    if (body.subcategory_id === "") body.subcategory_id = null;

    const { data, error } = await supabaseServer
      .from("products")
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: data }, { status: 201 });
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
