import { NextResponse } from "next/server";
import { AboutService } from "@/services/about.service";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const onlyPublished = url.searchParams.get("published") === "true";
    const members = await AboutService.getTeamMembers(onlyPublished);
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMember = await AboutService.createTeamMember(body);
    return NextResponse.json({ success: true, member: newMember });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
