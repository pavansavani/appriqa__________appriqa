import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const FALLBACK_CATEGORIES = [
  { id: "all", label: "All Products", subcategories: [] },
  { id: "3d-printed-products", label: "3D Printed Products", subcategories: ["Name Plates", "Lithophane", "Planters", "Desk Organizers", "Lamps", "Miniatures", "Keychains", "Home Decor"] },
  { id: "3d-printed-designs", label: "3D Printed Designs (STL/CAD)", subcategories: ["Functional Parts", "Art & Sculptures", "Mechanical Models", "Replacement Parts", "Custom Enclosures"] },
  { id: "robotics-toys", label: "Robotics Toys", subcategories: ["Educational Robots", "Programmable Kits", "RC Vehicles", "Smart Toys", "Robotic Arms"] },
  { id: "diy-project-kits", label: "DIY Project Kits", subcategories: ["Arduino Kits", "Raspberry Pi Kits", "IoT Sensor Kits", "Drone DIY Kits", "Solar Power Kits"] },
];

export async function GET(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: true, categories: FALLBACK_CATEGORIES }, { status: 200 });
  }

  try {
    const { data: categories, error } = await supabaseServer
      .from("categories")
      .select("*")
      .eq("status", "active")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !categories || categories.length === 0) {
      return NextResponse.json({ success: true, categories: FALLBACK_CATEGORIES }, { status: 200 });
    }

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
    return NextResponse.json({ success: true, categories: FALLBACK_CATEGORIES }, { status: 200 });
  }
}

