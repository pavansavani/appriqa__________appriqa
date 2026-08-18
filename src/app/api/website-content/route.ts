import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    
    let query = supabase.from("website_content").select("*").eq("status", "published");
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
    console.error("GET Public Website Content Error:", error);
    return NextResponse.json({ error: "Failed to fetch website content" }, { status: 500 });
  }
}
