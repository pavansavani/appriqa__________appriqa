import { NextResponse } from "next/server";
import { AboutService } from "@/services/about.service";

export async function GET() {
  try {
    const settings = await AboutService.getAllSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { sectionKey, data } = await req.json();
    if (!sectionKey) return NextResponse.json({ error: "sectionKey is required" }, { status: 400 });
    
    const updated = await AboutService.updateSetting(sectionKey, data);
    return NextResponse.json({ success: true, setting: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
