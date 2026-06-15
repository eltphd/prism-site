import { NextRequest, NextResponse } from "next/server";

const COHORT_LABELS: Record<string, string> = {
  cohort1: "Cohort 1 (June 15–27)",
  cohort2: "Cohort 2 (July 6–18)",
  either: "Either / Not sure",
};

export async function POST(req: NextRequest) {
  const { name, email, cohort } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const cohortLabel = COHORT_LABELS[cohort] ?? cohort;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "PRISM <prism@feelingsunplugged.com>",
      to: ["drtarttphd@us-squared.org"],
      subject: `New PRISM interest: ${name}`,
      html: `
        <h2>New PRISM interest submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Preferred cohort:</strong> ${cohortLabel}</p>
      `,
      replyTo: email,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
