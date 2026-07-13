"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const INK = "#0d0b12";
const PANEL = "#1a1622";
const BORDER = "#2c2638";
const TEXT = "#f2eefa";
const LILAC = "#b8a6d9";
const courier = "var(--font-courier-prime), ui-monospace, monospace";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("incorrect password");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: INK,
        color: TEXT,
        fontFamily: courier,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          background: PANEL,
          border: `1px solid ${BORDER}`,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontFamily: "var(--font-archivo-black), sans-serif", fontSize: 22 }}>
          PRISM admin
        </div>
        <input
          autoFocus
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${BORDER}`,
            padding: "12px 14px",
            color: TEXT,
            fontSize: 16,
            fontFamily: courier,
            outline: "none",
          }}
        />
        {error && <p style={{ color: "#c96a6a", fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: LILAC,
            border: "none",
            padding: "12px 20px",
            color: INK,
            fontWeight: 700,
            fontSize: 15,
            fontFamily: courier,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "checking…" : "log in"}
        </button>
      </form>
    </div>
  );
}
