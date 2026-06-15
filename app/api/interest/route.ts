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

  const firstName = name.split(" ")[0];

  try {
    await Promise.all([
      // Notify Dr. Tartt
      resend.emails.send({
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
      }),

      // Confirmation + community invite to submitter
      resend.emails.send({
        from: "Dr. Tartt @ PRISM <prism@feelingsunplugged.com>",
        to: [email],
        subject: "You're on our radar — welcome to PRISM ✨",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0e1a;font-family:system-ui,-apple-system,sans-serif;color:#f0eeff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0e1a;">
    <tr><td>
      <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

        <!-- Rainbow bar -->
        <div style="height:4px;background:linear-gradient(to right,#e05252,#e8843a,#d4a843,#5aab6e,#4a90d9,#7c5cbf,#d95a8e);border-radius:4px;margin-bottom:32px;"></div>

        <h1 style="font-size:36px;font-weight:900;letter-spacing:-0.03em;margin:0 0 8px;color:#fff;">PRISM</h1>
        <p style="color:#b0a8d0;font-size:15px;margin:0 0 28px;">A free summer wellness space for teens</p>

        <p style="font-size:17px;line-height:1.6;color:#f0eeff;margin:0 0 16px;">
          Hey ${firstName} 👋
        </p>
        <p style="font-size:17px;line-height:1.6;color:#f0eeff;margin:0 0 16px;">
          We got your info — you're officially on our radar for <strong style="color:#d4a843;">${cohortLabel}</strong>.
        </p>
        <p style="font-size:17px;line-height:1.6;color:#b0a8d0;margin:0 0 28px;">
          We'll reach out before your cohort starts with everything you need to know.
          In the meantime, no homework, no prep — just show up when the time comes.
        </p>

        <!-- Reminder block -->
        <div style="background:rgba(255,255,255,0.05);border-radius:14px;padding:20px 20px;margin-bottom:28px;">
          <p style="margin:0 0 10px;font-size:14px;color:#d4a843;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Quick reminder</p>
          <p style="margin:0 0 6px;font-size:15px;color:#f0eeff;">📅 Mon–Fri · 10am – 3pm</p>
          <p style="margin:0 0 6px;font-size:15px;color:#f0eeff;">📍 David's United Church of Christ, Canal Winchester, OH</p>
          <p style="margin:0;font-size:15px;color:#f0eeff;">🎉 Free · No sign-up needed to just show up</p>
        </div>

        <!-- Community invite -->
        <div style="background:linear-gradient(135deg,rgba(124,92,191,0.2),rgba(217,90,142,0.2));border:1.5px solid rgba(124,92,191,0.4);border-radius:16px;padding:24px;margin-bottom:28px;text-align:center;">
          <p style="margin:0 0 10px;font-size:18px;font-weight:800;color:#f0eeff;">Want to go deeper?</p>
          <p style="margin:0 0 16px;font-size:15px;color:#b0a8d0;line-height:1.6;">
            The Feelings Unplugged community app has tools for understanding your emotions, finding your archetype, and connecting with others who get it. It's free and built for teens.
          </p>
          <a href="https://app.feelingsunplugged.space/quiz"
             style="display:inline-block;background:linear-gradient(135deg,#7c5cbf,#d95a8e);border-radius:12px;padding:14px 28px;color:#fff;font-weight:700;font-size:16px;text-decoration:none;letter-spacing:0.02em;">
            Discover your archetype →
          </a>
        </div>

        <p style="font-size:14px;color:#6b6480;margin:0 0 4px;">Questions? Reply to this email or reach us at:</p>
        <p style="font-size:14px;color:#7c5cbf;margin:0 0 24px;">
          <a href="mailto:drtarttphd@us-squared.org" style="color:#7c5cbf;text-decoration:none;">drtarttphd@us-squared.org</a>
          &nbsp;·&nbsp;
          <a href="tel:6146474554" style="color:#7c5cbf;text-decoration:none;">614-647-4554</a>
        </p>

        <!-- Rainbow bar -->
        <div style="height:4px;background:linear-gradient(to right,#e05252,#e8843a,#d4a843,#5aab6e,#4a90d9,#7c5cbf,#d95a8e);border-radius:4px;"></div>

        <p style="font-size:12px;color:#3d3650;margin:16px 0 0;text-align:center;">
          LGBTQIA+ affirming · everyone welcome · <a href="https://prism.feelingsunplugged.com" style="color:#3d3650;">prism.feelingsunplugged.com</a>
        </p>

      </div>
    </td></tr>
  </table>
</body>
</html>
        `,
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
