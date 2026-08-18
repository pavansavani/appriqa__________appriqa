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

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    
    let query = supabaseServer.from("website_content").select("*");
    if (page) {
      query = query.eq("page", page);
    }
    
    const { data: content, error } = await query;

    if (error) throw error;

    // Convert array into a key-value object for easy lookup on frontend
    const contentMap = content.reduce((acc: any, item: any) => {
      acc[item.content_key] = item;
      return acc;
    }, {});

    return NextResponse.json({ success: true, content: contentMap }, { status: 200 });
  } catch (error: any) {
    console.error("GET Admin Website Content Error:", error);
    return NextResponse.json({ error: "Failed to fetch website content" }, { status: 500 });
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
    
    // We expect an array of content updates or a single object
    const updates = Array.isArray(body) ? body : [body];
    
    const timestamp = new Date().toISOString();
    
    for (const item of updates) {
      const payload = {
        page: item.page,
        content_key: item.content_key,
        content_type: item.content_type || 'text',
        content_value: item.content_value,
        media_url: item.media_url,
        alt_text: item.alt_text,
        status: item.status || 'draft',
        updated_by: user.id,
        updated_at: timestamp,
        ...(item.status === 'published' ? { published_at: timestamp } : {})
      };
      
      const { error } = await supabaseServer
        .from("website_content")
        .upsert(payload, { onConflict: 'content_key' });
        
      if (error) throw error;
      
      // If publishing, revalidate the specific page
      if (item.status === 'published') {
        const pageRoute = item.page === 'home' ? '/' : `/${item.page}`;
        revalidatePath(pageRoute);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("POST Admin Website Content Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update content" }, { status: 500 });
  }
}
