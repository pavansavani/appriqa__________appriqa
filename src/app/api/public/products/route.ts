import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");
    
    // Fetch products that are 'active'
    let query = supabaseServer
      .from("products")
      .select(`
        *,
        category_rel:categories!category_id(id, slug, name),
        subcategory_rel:categories!subcategory_id(id, slug, name)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });
      
    const { data: dbProducts, error } = await query;
    
    if (error) throw error;
    
    // Map database fields to the structure expected by the frontend catalog
    let formattedProducts = (dbProducts || []).map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price) || 0,
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
      shortDescription: p.short_description || p.description?.substring(0, 100) || "",
      description: p.description || "",
      thumbnail: p.featured_image || p.image_url || "/images/placeholder.png", // fallback
      images: p.featured_image ? [p.featured_image] : [],
      category: p.category_rel?.slug || "uncategorized",
      categoryLabel: p.category_rel?.name || "Uncategorized",
      subcategory: p.subcategory_rel?.name || "General",
      rating: 5,
      reviews: [],
      features: p.tags || [],
      stock: p.stock || 0,
      type: "physical", // Assuming all physical for now unless specified
      tags: p.tags || []
    }));

    if (categoryFilter && categoryFilter !== "all") {
      formattedProducts = formattedProducts.filter(p => p.category === categoryFilter);
    }
    
    return NextResponse.json({ success: true, products: formattedProducts }, { status: 200 });
  } catch (error: any) {
    console.error("GET Public Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
