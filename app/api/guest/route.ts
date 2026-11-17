import { NextResponse } from "next/server";
import { callWeddingSheet } from "@/lib/google-rsvp";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";

  if (!token || token.length > 200) {
    return NextResponse.json(
      { error: "A valid invitation token is required." },
      { status: 400 },
    );
  }

  try {
    const result = await callWeddingSheet({ action: "lookup", token });

    if (!result.success || !result.name) {
      return NextResponse.json(
        { error: result.error || "Invitation not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { name: result.name },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to look up invitation", error);
    return NextResponse.json(
      { error: "The guest list is temporarily unavailable." },
      { status: 503 },
    );
  }
}
