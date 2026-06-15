"use client";

import { useState } from "react";

const RAYS = [
  "#e05252", // red
  "#e8843a", // orange
  "#d4a843", // gold
  "#5aab6e", // green
  "#4a90d9", // blue
  "#7c5cbf", // purple
  "#d95a8e", // pink
];

function PrismRays() {
  return (
    <svg
      width="80"
      height="60"
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {RAYS.map((color, i) => {
        const angle = 200 + i * 12;
        const rad = (angle * Math.PI) / 180;
        const x2 = 5 + Math.cos(rad) * 70;
        const y2 = 50 + Math.sin(rad) * 70;
        return (
          <line
            key={i}
            x1="5"
            y1="50"
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function RainbowBar() {
  return (
    <div
      style={{
        height: 5,
        background: `linear-gradient(to right, ${RAYS.join(", ")})`,
      }}
    />
  );
}

function InterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cohort, setCohort] = useState("either");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, cohort }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="text-center py-8">
        <div style={{ fontSize: 48 }}>✨</div>
        <p
          style={{
            color: "#d4a843",
            fontWeight: 700,
            fontSize: 22,
            marginTop: 8,
          }}
        >
          You&apos;re on our radar!
        </p>
        <p style={{ color: "#b0a8d0", marginTop: 6 }}>
          We&apos;ll be in touch before the cohort starts.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <input
        required
        type="text"
        placeholder="Name (first is fine)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: "14px 16px",
          color: "#f0eeff",
          fontSize: 16,
          outline: "none",
        }}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: "14px 16px",
          color: "#f0eeff",
          fontSize: 16,
          outline: "none",
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { val: "cohort1", label: "June 15–27" },
          { val: "cohort2", label: "July 6–18" },
          { val: "either", label: "Either / Not sure" },
        ].map((opt) => (
          <button
            key={opt.val}
            type="button"
            onClick={() => setCohort(opt.val)}
            style={{
              flex: 1,
              padding: "10px 6px",
              borderRadius: 10,
              border: "1.5px solid",
              borderColor: cohort === opt.val ? "#d4a843" : "rgba(255,255,255,0.15)",
              background: cohort === opt.val ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.05)",
              color: cohort === opt.val ? "#d4a843" : "#b0a8d0",
              fontSize: 13,
              fontWeight: cohort === opt.val ? 700 : 400,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {status === "error" && (
        <p style={{ color: "#e05252", fontSize: 14, margin: 0 }}>
          Something went wrong — email us at{" "}
          <a href="mailto:drtarttphd@us-squared.org" style={{ color: "#e05252" }}>
            drtarttphd@us-squared.org
          </a>
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          background: "linear-gradient(135deg, #7c5cbf, #d95a8e)",
          border: "none",
          borderRadius: 12,
          padding: "16px",
          color: "#fff",
          fontSize: 17,
          fontWeight: 700,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
          letterSpacing: "0.02em",
        }}
      >
        {status === "loading" ? "Sending…" : "I'm interested →"}
      </button>
      <p style={{ color: "#6b6480", fontSize: 13, textAlign: "center", margin: 0 }}>
        No spam. We&apos;ll only reach out about PRISM.
      </p>
    </form>
  );
}

export default function PrismPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f0e1a" }}>
      <RainbowBar />

      {/* HERO — everything above fold on mobile */}
      <section
        style={{
          padding: "40px 24px 32px",
          maxWidth: 500,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            letterSpacing: "0.18em",
            fontSize: 13,
            color: "#b0a8d0",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Summer 2026
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: -8 }}>
          <PrismRays />
        </div>

        <h1
          style={{
            fontSize: "clamp(72px, 22vw, 110px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            margin: 0,
            lineHeight: 0.9,
            background: "linear-gradient(135deg, #fff 40%, #b0a8d0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PRISM
        </h1>

        <p
          style={{
            fontStyle: "italic",
            fontSize: 20,
            color: "#b0a8d0",
            margin: "14px 0 24px",
            lineHeight: 1.4,
          }}
        >
          Revealing what was always there.
        </p>

        {/* KEY INFO PILLS — visible immediately */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <div
            style={{
              background: "rgba(212,168,67,0.15)",
              border: "1.5px solid #d4a843",
              borderRadius: 14,
              padding: "12px 20px",
              color: "#d4a843",
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            FREE · Ages 13–19 · No sign-up needed
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "12px 20px",
              color: "#f0eeff",
              fontSize: 15,
            }}
          >
            📅 Mon–Fri · 10am – 3pm
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "12px 20px",
              color: "#f0eeff",
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "#7c5cbf", fontWeight: 700 }}>Cohort 1:</span> June 15–27
            <br />
            <span style={{ color: "#4a90d9", fontWeight: 700 }}>Cohort 2:</span> July 6–18
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 14,
              padding: "12px 20px",
              color: "#f0eeff",
              fontSize: 15,
              lineHeight: 1.5,
            }}
          >
            📍 David&apos;s United Church of Christ
            <br />
            <span style={{ color: "#b0a8d0" }}>Canal Winchester, Ohio</span>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: 14,
            padding: "12px 20px",
            fontWeight: 700,
            fontSize: 15,
            color: "#f0eeff",
          }}
        >
          Just show up — open to all
        </div>
      </section>

      {/* WHAT IS PRISM */}
      <section
        style={{
          padding: "32px 24px",
          maxWidth: 500,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#f0eeff",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          What is PRISM?
        </h2>
        <p style={{ color: "#b0a8d0", fontSize: 17, lineHeight: 1.7, margin: 0 }}>
          PRISM is a free summer wellness space where teens can actually breathe —
          a place to talk, feel things, make sense of the world, and be seen for
          exactly who they are. No pressure, no judgment. Just space to exist
          and figure yourself out alongside people who get it.
        </p>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
          }}
        >
          {[
            "🏳️‍🌈 LGBTQIA+ affirming",
            "🤝 Everyone welcome",
            "🗣️ Talk it out",
            "🧠 Mental wellness",
            "✨ Be yourself",
          ].map((tag) => (
            <span
              key={tag}
              style={{
                background: "rgba(124,92,191,0.2)",
                border: "1px solid rgba(124,92,191,0.4)",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 14,
                color: "#d0c8f0",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* INTEREST FORM */}
      <section
        id="interested"
        style={{
          padding: "32px 24px",
          maxWidth: 500,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#f0eeff",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Stay in the loop
        </h2>
        <p
          style={{
            color: "#b0a8d0",
            fontSize: 16,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Drop your name and email — we&apos;ll send reminders and updates
          before each cohort. Zero commitment.
        </p>
        <InterestForm />
      </section>

      {/* WHAT TO EXPECT */}
      <section
        style={{
          padding: "32px 24px",
          maxWidth: 500,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#f0eeff",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          What to expect
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              icon: "🧘",
              title: "Wellness activities",
              desc: "Mindfulness, movement, creative expression — whatever helps you feel more like you.",
            },
            {
              icon: "💬",
              title: "Real conversations",
              desc: "Group and individual space to talk about the stuff that actually matters.",
            },
            {
              icon: "🎨",
              title: "Creative space",
              desc: "Art, journaling, music — express yourself without needing to explain it.",
            },
            {
              icon: "🌱",
              title: "Guided by Dr. Tartt",
              desc: "Led by a licensed psychologist who actually listens and won't diagnose you over lunch.",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                gap: 16,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                padding: "16px",
              }}
            >
              <span style={{ fontSize: 28, lineHeight: 1 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: "#f0eeff", margin: "0 0 4px", fontSize: 16 }}>
                  {item.title}
                </p>
                <p style={{ color: "#b0a8d0", margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SPONSOR A TEEN */}
      <section
        style={{
          padding: "32px 24px",
          maxWidth: 500,
          margin: "0 auto",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(90,171,110,0.15), rgba(74,144,217,0.15))",
            border: "1.5px solid rgba(90,171,110,0.3)",
            borderRadius: 20,
            padding: "28px 24px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>💚</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0eeff", margin: "0 0 10px" }}>
            Sponsor a teen
          </h2>
          <p style={{ color: "#b0a8d0", fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>
            PRISM is free because someone believed it should be. If you&apos;re in a
            position to help keep it that way, your support directly funds a
            teen&apos;s access to this space. Every dollar stays local.
          </p>
          <a
            href="https://buy.stripe.com/4gM14mfm46B478g9A94Rq0e"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "rgba(90,171,110,0.25)",
              border: "1.5px solid #5aab6e",
              borderRadius: 12,
              padding: "14px 28px",
              color: "#5aab6e",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
            }}
          >
            Donate $25 — sponsor a teen's journal
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "32px 24px 40px",
          maxWidth: 500,
          margin: "0 auto",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p style={{ color: "#b0a8d0", fontSize: 14, marginBottom: 6 }}>
          LGBTQIA+ affirming · everyone welcome
        </p>
        <p style={{ color: "#f0eeff", fontWeight: 700, fontSize: 17, marginBottom: 16 }}>
          prism.feelingsunplugged.com
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <a
            href="mailto:drtarttphd@us-squared.org"
            style={{ color: "#7c5cbf", fontSize: 14, textDecoration: "none" }}
          >
            drtarttphd@us-squared.org
          </a>
          <a
            href="tel:6146474554"
            style={{ color: "#7c5cbf", fontSize: 14, textDecoration: "none" }}
          >
            call or text 614-647-4554
          </a>
        </div>
      </footer>

      <RainbowBar />
    </div>
  );
}
