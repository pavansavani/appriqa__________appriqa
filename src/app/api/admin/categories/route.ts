import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// GET all categories
export async function GET(request: Request) {
  try {
    const { data: categories, error } = await supabaseServer
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, categories }, { status: 200 });
  } catch (error: any) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST create new category
export async function POST(request: Request) {
  try {
    // 1. Verify caller auth & role
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await supabaseServer.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Checking profile for role (optional but good practice)
    const { data: profile } = await supabaseServer
      .from("profiles")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();

    if (!profile || !["super_admin", "admin", "store_manager"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden - Insufficient permissions" }, { status: 403 });
    }

    // 2. Extract body
    const body = await request.json();
    const { name, slug, description, image, banner_image, parent_id, seo_title, seo_description, status, display_order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and Slug are required" }, { status: 400 });
    }

    // 3. Insert category
    const { data: category, error: insertError } = await supabaseServer
      .from("categories")
      .insert({
        name,
        slug,
        description,
        image,
        banner_image,
        parent_id: parent_id || null,
        seo_title,
        seo_description,
        status: status || 'active',
        display_order: display_order || 0
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
