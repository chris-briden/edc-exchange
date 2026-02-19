import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username } = body;

    if (!email || !username) {
      return NextResponse.json(
        { error: "Email and username are required" },
        { status: 400 }
      );
    }

    // Fire-and-forget — send welcome email
    sendWelcomeEmail({
      email: email.toLowerCase().trim(),
      username,
    }).catch((err) => console.error("Welcome email failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email API error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}
