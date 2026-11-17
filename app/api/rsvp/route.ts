import { NextResponse } from "next/server";
import { callWeddingSheet } from "@/lib/google-rsvp";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const attendance = body.attendance;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!token || token.length > 200) return NextResponse.json({ error: "A valid invitation link is required." }, { status: 400 });
    if (attendance !== "joyfully accepts" && attendance !== "regretfully declines") return NextResponse.json({ error: "Please choose an attendance response." }, { status: 400 });
    if (message.length > 500) return NextResponse.json({ error: "Your message is too long." }, { status: 400 });
    const result = await callWeddingSheet({ action: "rsvp", token, attendance, message });
    if (!result.success || !result.saved) return NextResponse.json({ error: result.error || "Unable to save RSVP." }, { status: 400 });
    return NextResponse.json({ saved: true, name: result.name });
  } catch (error) { console.error("Unable to save RSVP", error); return NextResponse.json({ error: "Unable to save RSVP." }, { status: 500 }); }
}
