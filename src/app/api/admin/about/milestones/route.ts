import { NextResponse } from "next/server";
import { AboutService } from "@/services/about.service";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const onlyPublished = url.searchParams.get("published") === "true";
    const milestones = await AboutService.getMilestones(onlyPublished);
    return NextResponse.json({ success: true, milestones });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newMilestone = await AboutService.createMilestone(body);
    return NextResponse.json({ success: true, milestone: newMilestone });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
