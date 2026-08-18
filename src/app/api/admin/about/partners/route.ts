import { NextResponse } from "next/server";
import { AboutService } from "@/services/about.service";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const onlyPublished = url.searchParams.get("published") === "true";
    const partners = await AboutService.getPartners(onlyPublished);
    return NextResponse.json({ success: true, partners });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPartner = await AboutService.createPartner(body);
    return NextResponse.json({ success: true, partner: newPartner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
