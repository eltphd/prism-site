import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

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
          <h2>New PRISM art week interest submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        `,
        replyTo: email,
      }),

      // Confirmation + community invite to submitter
      resend.emails.send({
        from: "PRISM <prism@feelingsunplugged.com>",
        to: [email],
        subject: "you're on our radar — PRISM ✧",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0b12;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#f2eefa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0b12;">
    <tr><td>
      <div style="max-width:520px;margin:0 auto;padding:40px 24px;">

        <!-- beam -->
        <div style="height:6px;display:flex;margin-bottom:32px;">
          <div style="flex:1;background:#a05656;"></div><div style="flex:1;background:#a5804f;"></div><div style="flex:1;background:#9aa055;"></div><div style="flex:1;background:#5a9070;"></div><div style="flex:1;background:#5a7ba0;"></div><div style="flex:1;background:#8a64a8;"></div>
        </div>

        <h1 style="font-size:32px;font-weight:900;letter-spacing:0.02em;margin:0 0 8px;color:#f2eefa;">PRISM</h1>
        <p style="color:#9c92b0;font-size:14px;letter-spacing:0.12em;margin:0 0 28px;">FREE ART WEEK FOR TEENS</p>

        <p style="font-size:16px;line-height:1.6;color:#f2eefa;margin:0 0 16px;">
          hey ${firstName} ✧
        </p>
        <p style="font-size:16px;line-height:1.6;color:#f2eefa;margin:0 0 16px;">
          you're on our radar. we'll send a reminder before it starts.
        </p>
        <p style="font-size:16px;line-height:1.6;color:#9c92b0;margin:0 0 28px;">
          no homework, no prep — just show up when the time comes. or don't. just come.
        </p>

        <!-- reminder block -->
        <div style="background:#1a1622;border:1px solid #2c2638;padding:20px 20px;margin-bottom:28px;">
          <p style="margin:0 0 10px;font-size:13px;color:#d9b96a;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">quick reminder</p>
          <p style="margin:0 0 6px;font-size:15px;color:#f2eefa;">JUL 13–17 · MON–FRI · 11AM–2PM</p>
          <p style="margin:0 0 6px;font-size:15px;color:#f2eefa;">David's United Church of Christ, Canal Winchester, OH</p>
          <p style="margin:0;font-size:15px;color:#f2eefa;">everyone gets a free journal · attending = entry for $50</p>
        </div>

        <!-- community invite -->
        <div style="background:#1a1622;border:1px solid #2c2638;padding:24px;margin-bottom:28px;text-align:center;">
          <p style="margin:0 0 10px;font-size:17px;font-weight:700;color:#f2eefa;">want to go deeper?</p>
          <p style="margin:0 0 16px;font-size:15px;color:#9c92b0;line-height:1.6;">
            the Feelings Unplugged community app has tools for understanding your emotions, finding your archetype, and connecting with others who get it. free, built for teens.
          </p>
          <a href="https://app.feelingsunplugged.space/quiz"
             style="display:inline-block;background:#b8a6d9;padding:14px 28px;color:#0d0b12;font-weight:700;font-size:15px;text-decoration:none;">
            discover your archetype →
          </a>
        </div>

        <p style="font-size:13px;color:#574f66;margin:0 0 4px;">questions? reply to this email or reach us at:</p>
        <p style="font-size:13px;color:#b8a6d9;margin:0 0 24px;">
          <a href="mailto:drtarttphd@us-squared.org" style="color:#b8a6d9;text-decoration:none;">drtarttphd@us-squared.org</a>
          &nbsp;·&nbsp;
          <a href="tel:6146474554" style="color:#b8a6d9;text-decoration:none;">614-647-4554</a>
        </p>

        <div style="height:6px;display:flex;">
          <div style="flex:1;background:#a05656;"></div><div style="flex:1;background:#a5804f;"></div><div style="flex:1;background:#9aa055;"></div><div style="flex:1;background:#5a9070;"></div><div style="flex:1;background:#5a7ba0;"></div><div style="flex:1;background:#8a64a8;"></div>
        </div>

        <p style="font-size:12px;color:#3d3650;margin:16px 0 0;text-align:center;">
          PRISM · a FeelingsUnplugged program · <a href="https://prism.feelingsunplugged.com" style="color:#3d3650;">prism.feelingsunplugged.com</a>
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
