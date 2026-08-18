import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { data: categories, error } = await supabaseServer
      .from("categories")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    // We structure this for the ProductCatalog
    const formattedCategories = [
      { id: "all", label: "All Products", subcategories: [] },
      ...(categories || []).map(c => ({
        id: c.slug,
        label: c.name,
        subcategories: [] 
      }))
    ];

    return NextResponse.json({ success: true, categories: formattedCategories }, { status: 200 });
  } catch (error: any) {
    console.error("GET Public Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
