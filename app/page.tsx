"use client";

import { useState } from "react";

const INK = "#0d0b12";
const PANEL = "#1a1622";
const BORDER = "#2c2638";
const TEXT = "#f2eefa";
const TEXT_SECONDARY = "#cfc8de";
const MUTED = "#9c92b0";
const MUTED2 = "#574f66";
const LILAC = "#b8a6d9";
const GOLD = "#d9b96a";
const BEAM = ["#a05656", "#a5804f", "#9aa055", "#5a9070", "#5a7ba0", "#8a64a8"];

const archivo = "var(--font-archivo-black), sans-serif";
const courier = "var(--font-courier-prime), ui-monospace, monospace";

function Beam() {
  return (
    <div style={{ height: 8, display: "flex", flexShrink: 0 }}>
      {BEAM.map((c) => (
        <div key={c} style={{ flex: 1, background: c }} />
      ))}
    </div>
  );
}

function InterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ name, email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <p style={{ color: GOLD, fontWeight: 700, fontSize: 20, margin: 0 }}>
          ✧ you&apos;re on our radar ✧
        </p>
        <p style={{ color: MUTED, marginTop: 8, fontSize: 15 }}>
          or don&apos;t wait — just show up.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}
    >
      <input
        required
        type="text"
        placeholder="name (first is fine)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          padding: "14px 16px",
          color: TEXT,
          fontSize: 16,
          fontFamily: courier,
          outline: "none",
        }}
      />
      <input
        required
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${BORDER}`,
          padding: "14px 16px",
          color: TEXT,
          fontSize: 16,
          fontFamily: courier,
          outline: "none",
        }}
      />
      {status === "error" && (
        <p style={{ color: "#c96a6a", fontSize: 14, margin: 0 }}>
          something went wrong — text us instead → 614-647-4554
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          background: LILAC,
          border: "none",
          padding: "14px 26px",
          color: INK,
          fontSize: 16,
          fontWeight: 700,
          fontFamily: courier,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? "sending…" : "keep me posted →"}
      </button>
    </form>
  );
}

export default function PrismPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: INK,
        fontFamily: courier,
        color: TEXT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Beam />

      {/* nav */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px clamp(20px, 6vw, 64px)",
          fontSize: 14,
          letterSpacing: "0.12em",
          color: MUTED,
        }}
      >
        <div style={{ fontFamily: archivo, fontSize: 20, color: TEXT, letterSpacing: "0.02em" }}>
          PRISM
        </div>
        <div>by FeelingsUnplugged</div>
      </div>

      {/* hero */}
      <div
        style={{
          padding: "clamp(24px,6vw,40px) clamp(20px,6vw,64px) clamp(48px,8vw,80px)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          maxWidth: 900,
        }}
      >
        <div style={{ fontSize: 15, color: LILAC, letterSpacing: "0.2em" }}>
          ✧ FREE · AGES 13–19 · NO SIGN-UP NEEDED ✧
        </div>
        <div
          style={{
            fontFamily: archivo,
            fontSize: "clamp(64px, 14vw, 160px)",
            lineHeight: 0.88,
            color: TEXT,
          }}
        >
          PRISM
        </div>
        <div style={{ fontSize: "clamp(18px,3vw,26px)", fontStyle: "italic", color: MUTED }}>
          do <span style={{ textDecoration: "line-through" }}>nothing</span> art this summer.
        </div>
        <div
          style={{
            fontSize: "clamp(16px,2.4vw,20px)",
            color: TEXT_SECONDARY,
            lineHeight: 1.6,
            marginTop: 6,
          }}
        >
          JUL 13–17 · MON–FRI · 11AM–2PM
          <br />
          David&apos;s UCC · Canal Winchester
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 12, alignItems: "center" }}>
          <a
            href="sms:6146474554"
            style={{
              textDecoration: "none",
              background: LILAC,
              color: INK,
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 26px",
              display: "inline-block",
            }}
          >
            text to join → 614-647-4554
          </a>
          <div style={{ fontSize: 15, color: MUTED2, fontStyle: "italic" }}>
            or don&apos;t. just show up.
          </div>
        </div>
      </div>

      {/* activities */}
      <div style={{ padding: "40px clamp(20px,6vw,64px)", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 14, color: "#8f86a0", letterSpacing: "0.18em", marginBottom: 20 }}>
          WHAT&apos;S THERE
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 34px", maxWidth: 820 }}>
          {["photography", "leathermaking", "gaming", "watercolor", "creative writing", "culture talks"].map(
            (item) => (
              <span key={item} style={{ fontSize: "clamp(18px,2.6vw,24px)" }}>
                ☐ {item}
              </span>
            )
          )}
          <span style={{ fontSize: "clamp(18px,2.6vw,24px)", fontWeight: 700 }}>☑ art fights ⚔</span>
        </div>
      </div>

      {/* prize / journal */}
      <div
        style={{
          padding: "40px clamp(20px,6vw,64px)",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: PANEL,
            border: `1px solid ${BORDER}`,
            padding: 26,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 15, color: "#8f86a0", letterSpacing: "0.16em" }}>
            EVERYONE WHO SHOWS UP GETS
          </div>
          <div style={{ fontSize: 24, color: TEXT }}>a free FeelingsUnplugged journal</div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 260,
            background: PANEL,
            border: `1px solid ${BORDER}`,
            padding: 26,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 15, color: "#8f86a0", letterSpacing: "0.16em" }}>
            ATTENDING = ENTERED TO WIN
          </div>
          <div style={{ fontSize: 24, color: TEXT }}>
            a shot at{" "}
            <span style={{ background: GOLD, color: INK, fontWeight: 700, padding: "2px 10px" }}>
              $50
            </span>
          </div>
        </div>
      </div>

      {/* stay in the loop */}
      <div style={{ padding: "40px clamp(20px,6vw,64px)", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 14, color: "#8f86a0", letterSpacing: "0.18em", marginBottom: 16 }}>
          KEEP ME POSTED
        </div>
        <p style={{ color: MUTED, fontSize: 15, margin: "0 0 20px", maxWidth: 420, lineHeight: 1.6 }}>
          drop your name and email — we&apos;ll send a reminder before it starts. zero commitment.
        </p>
        <InterestForm />
      </div>

      {/* artfight teaser */}
      <div
        style={{
          padding: "44px clamp(20px,6vw,64px)",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          alignItems: "center",
          background: "#14111a",
        }}
      >
        <div style={{ flex: 1, minWidth: 260, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 15, color: LILAC, letterSpacing: "0.16em" }}>
            ✧ COMING THIS FALL ✧
          </div>
          <div style={{ fontFamily: archivo, fontSize: "clamp(32px,5vw,52px)", lineHeight: 0.95, color: TEXT }}>
            ARTFIGHT
          </div>
          <div style={{ fontSize: 16, fontStyle: "italic", color: MUTED }}>
            the art is hiding around town. go find it. go fight it.
          </div>
          <div style={{ fontSize: 15, color: TEXT_SECONDARY, marginTop: 4 }}>
            no app. no sign-up. just eyes. clues + start date coming soon.
          </div>
        </div>
        <a
          href="sms:6146474554"
          style={{
            textDecoration: "none",
            border: `1px solid ${LILAC}`,
            color: LILAC,
            fontSize: 15,
            padding: "12px 22px",
            whiteSpace: "nowrap",
          }}
        >
          get clues first →
        </a>
      </div>

      {/* footer */}
      <div
        style={{
          marginTop: "auto",
          padding: "28px clamp(20px,6vw,64px)",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 13,
          color: MUTED2,
        }}
      >
        <div>PRISM · a FeelingsUnplugged program</div>
        <div>David&apos;s UCC · Canal Winchester, OH · 614-647-4554</div>
      </div>
    </div>
  );
}
