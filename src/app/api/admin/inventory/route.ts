import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: products, error } = await supabaseServer
      .from("products")
      .select("id, name, sku, stock, price, category_id, categories(name)")
      .order("stock", { ascending: true }); // Lowest stock first

    if (error) throw error;

    return NextResponse.json({ success: true, inventory: products }, { status: 200 });
  } catch (error: any) {
    console.error("GET Inventory Error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}
