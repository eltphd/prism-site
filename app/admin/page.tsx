"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const INK = "#0d0b12";
const PANEL = "#1a1622";
const BORDER = "#2c2638";
const TEXT = "#f2eefa";
const MUTED = "#9c92b0";
const LILAC = "#b8a6d9";
const GOLD = "#d9b96a";
const courier = "var(--font-courier-prime), ui-monospace, monospace";
const archivo = "var(--font-archivo-black), sans-serif";

const STAGES = [
  "Stage 0 — Arrival",
  "Stage 1 — Brilliance",
  "Stage 2 — Emotion Naming",
  "Stage 3 — Emotion Map",
  "Stage 4 — Decoding",
  "Stage 5 — Boundaries",
  "INWARD WRAP",
  "Stage 6 — Voice",
  "Stage 7 — Self-Empathy/Tools",
  "Stage 8 — Connection",
  "Stage 9 — Capstone",
  "Stage 10 — PRISM Code",
];

type Learner = { id: string; name: string; email: string | null; phone: string | null; notes: string | null };
type Enrollment = {
  id: string;
  learner_id: string;
  program_id: string;
  current_stage: string;
  fu_archetype: string | null;
  prism_posture: string | null;
  sparks: number;
  first_arrival: string | null;
  last_seen: string | null;
  notes: string | null;
  learners: Learner;
};
type Attendance = { id: string; enrollment_id: string; attended_on: string };
type Reflection = {
  id: string;
  enrollment_id: string;
  content: string;
  matched_fu_archetype: string | null;
  matched_fu_score: number | null;
  matched_prism_posture: string | null;
  matched_prism_score: number | null;
  created_at: string;
};
type Signup = { id: string; name: string; email: string; created_at: string };
type Program = { id: string; slug: string; name: string; start_date: string; end_date: string };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function input(width?: number): React.CSSProperties {
  return {
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${BORDER}`,
    padding: "8px 10px",
    color: TEXT,
    fontSize: 14,
    fontFamily: courier,
    outline: "none",
    width,
  };
}

function button(active = true): React.CSSProperties {
  return {
    background: active ? LILAC : "rgba(255,255,255,0.06)",
    border: `1px solid ${active ? LILAC : BORDER}`,
    color: active ? INK : TEXT,
    fontWeight: 700,
    fontSize: 13,
    fontFamily: courier,
    padding: "8px 14px",
    cursor: "pointer",
  };
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [program, setProgram] = useState<Program | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [date, setDate] = useState(todayISO());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newLearner, setNewLearner] = useState({ name: "", email: "", phone: "" });
  const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});
  const [reflectionStatus, setReflectionStatus] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/data");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Failed to load");
      setLoading(false);
      return;
    }
    setProgram(data.program);
    setEnrollments(data.enrollments);
    setAttendance(data.attendance);
    setReflections(data.reflections);
    setSignups(data.signups);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleAttendance(enrollmentId: string) {
    const res = await fetch("/api/admin/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, date }),
    });
    if (res.ok) load();
  }

  async function addLearner(e: React.FormEvent) {
    e.preventDefault();
    if (!newLearner.name || !program) return;
    const res = await fetch("/api/admin/learners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newLearner, programId: program.id }),
    });
    if (res.ok) {
      setNewLearner({ name: "", email: "", phone: "" });
      load();
    }
  }

  async function patchEnrollment(id: string, fields: Partial<Enrollment>) {
    await fetch("/api/admin/enrollments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...fields }),
    });
    load();
  }

  async function submitReflection(enrollmentId: string) {
    const content = reflectionDrafts[enrollmentId];
    if (!content) return;
    setReflectionStatus((s) => ({ ...s, [enrollmentId]: "saving…" }));
    const res = await fetch("/api/admin/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, content }),
    });
    const data = await res.json();
    if (res.ok) {
      setReflectionDrafts((d) => ({ ...d, [enrollmentId]: "" }));
      setReflectionStatus((s) => ({
        ...s,
        [enrollmentId]: data.embedError ? "saved (match unavailable right now)" : "saved",
      }));
      load();
    } else {
      setReflectionStatus((s) => ({ ...s, [enrollmentId]: data.error ?? "error" }));
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: INK, color: MUTED, fontFamily: courier, padding: 40 }}>
        loading…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: INK, color: "#c96a6a", fontFamily: courier, padding: 40 }}>
        {error}
      </div>
    );
  }

  const attendedIdsForDate = new Set(
    attendance.filter((a) => a.attended_on === date).map((a) => a.enrollment_id)
  );
  const reflectionsByEnrollment = reflections.reduce<Record<string, Reflection[]>>((acc, r) => {
    (acc[r.enrollment_id] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: INK, color: TEXT, fontFamily: courier }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px clamp(16px,4vw,48px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ fontFamily: archivo, fontSize: 20 }}>PRISM admin</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: MUTED, fontSize: 13 }}>{program?.name}</span>
          <button onClick={logout} style={button(false)}>
            log out
          </button>
        </div>
      </div>

      <div style={{ padding: "24px clamp(16px,4vw,48px)", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Attendance */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, letterSpacing: "0.1em", color: MUTED, margin: 0 }}>ATTENDANCE</h2>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input()} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {enrollments.map((en) => (
              <label
                key={en.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: PANEL,
                  border: `1px solid ${BORDER}`,
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={attendedIdsForDate.has(en.id)}
                  onChange={() => toggleAttendance(en.id)}
                />
                <span>{en.learners.name}</span>
                <span style={{ color: MUTED, fontSize: 12 }}>{en.current_stage}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Add walk-in */}
        <section>
          <h2 style={{ fontSize: 16, letterSpacing: "0.1em", color: MUTED, marginBottom: 16 }}>ADD WALK-IN</h2>
          <form onSubmit={addLearner} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="name (required)"
              value={newLearner.name}
              onChange={(e) => setNewLearner((s) => ({ ...s, name: e.target.value }))}
              style={input(180)}
            />
            <input
              placeholder="email (optional)"
              value={newLearner.email}
              onChange={(e) => setNewLearner((s) => ({ ...s, email: e.target.value }))}
              style={input(220)}
            />
            <input
              placeholder="phone (optional)"
              value={newLearner.phone}
              onChange={(e) => setNewLearner((s) => ({ ...s, phone: e.target.value }))}
              style={input(160)}
            />
            <button type="submit" style={button(true)}>
              add
            </button>
          </form>
        </section>

        {/* Roster */}
        <section>
          <h2 style={{ fontSize: 16, letterSpacing: "0.1em", color: MUTED, marginBottom: 16 }}>ROSTER</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {enrollments.map((en) => {
              const isOpen = expanded === en.id;
              const learnerReflections = reflectionsByEnrollment[en.id] ?? [];
              return (
                <div key={en.id} style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
                  <div
                    onClick={() => setExpanded(isOpen ? null : en.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      cursor: "pointer",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <strong>{en.learners.name}</strong>
                      <span style={{ color: MUTED, fontSize: 13 }}>{en.current_stage}</span>
                      {en.fu_archetype && (
                        <span style={{ color: LILAC, fontSize: 12 }}>{en.fu_archetype}</span>
                      )}
                      {en.prism_posture && (
                        <span style={{ color: "#8fbf9f", fontSize: 12 }}>{en.prism_posture}</span>
                      )}
                      <span style={{ color: GOLD, fontSize: 12 }}>✧ {en.sparks}</span>
                    </div>
                    <span style={{ color: MUTED, fontSize: 12 }}>
                      last seen {en.last_seen ?? "—"} {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {isOpen && (
                    <div
                      style={{
                        padding: "0 16px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        borderTop: `1px solid ${BORDER}`,
                      }}
                    >
                      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 13, color: MUTED, marginTop: 12 }}>
                        {en.learners.email && <span>{en.learners.email}</span>}
                        {en.learners.phone && <span>{en.learners.phone}</span>}
                        {!en.learners.email && !en.learners.phone && <span>no contact info on file</span>}
                      </div>

                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: MUTED }}>
                          stage
                          <select
                            value={en.current_stage}
                            onChange={(e) => patchEnrollment(en.id, { current_stage: e.target.value })}
                            style={input(220)}
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: MUTED }}>
                          FU archetype
                          <input
                            defaultValue={en.fu_archetype ?? ""}
                            onBlur={(e) => patchEnrollment(en.id, { fu_archetype: e.target.value })}
                            style={input(160)}
                          />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: MUTED }}>
                          PRISM posture
                          <input
                            defaultValue={en.prism_posture ?? ""}
                            onBlur={(e) => patchEnrollment(en.id, { prism_posture: e.target.value })}
                            style={input(160)}
                          />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: MUTED }}>
                          Sparks
                          <input
                            type="number"
                            defaultValue={en.sparks}
                            onBlur={(e) => patchEnrollment(en.id, { sparks: Number(e.target.value) })}
                            style={input(80)}
                          />
                        </label>
                      </div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: MUTED }}>
                        notes
                        <textarea
                          defaultValue={en.notes ?? ""}
                          onBlur={(e) => patchEnrollment(en.id, { notes: e.target.value })}
                          rows={2}
                          style={{ ...input(), width: "100%", resize: "vertical" }}
                        />
                      </label>

                      <div>
                        <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>
                          add reflection (suggests FU archetype / PRISM posture match)
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <textarea
                            value={reflectionDrafts[en.id] ?? ""}
                            onChange={(e) =>
                              setReflectionDrafts((d) => ({ ...d, [en.id]: e.target.value }))
                            }
                            rows={2}
                            placeholder="what did they say / write today?"
                            style={{ ...input(), flex: 1, resize: "vertical" }}
                          />
                          <button onClick={() => submitReflection(en.id)} style={button(true)}>
                            save
                          </button>
                        </div>
                        {reflectionStatus[en.id] && (
                          <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{reflectionStatus[en.id]}</div>
                        )}
                        {learnerReflections.length > 0 && (
                          <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                            {learnerReflections.map((r) => (
                              <div key={r.id} style={{ fontSize: 12, color: MUTED, borderLeft: `2px solid ${BORDER}`, paddingLeft: 10 }}>
                                <div style={{ color: TEXT }}>{r.content}</div>
                                <div>
                                  {r.matched_fu_archetype && (
                                    <span style={{ color: LILAC }}>
                                      → {r.matched_fu_archetype} ({(r.matched_fu_score! * 100).toFixed(0)}%)
                                    </span>
                                  )}
                                  {r.matched_prism_posture && (
                                    <span style={{ color: "#8fbf9f", marginLeft: 10 }}>
                                      → {r.matched_prism_posture} ({(r.matched_prism_score! * 100).toFixed(0)}%)
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Signups */}
        <section>
          <h2 style={{ fontSize: 16, letterSpacing: "0.1em", color: MUTED, marginBottom: 16 }}>
            INTEREST FORM SIGNUPS ({signups.length})
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {signups.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 13,
                  padding: "6px 12px",
                  background: PANEL,
                  border: `1px solid ${BORDER}`,
                }}
              >
                <span>{s.name}</span>
                <span style={{ color: MUTED }}>{s.email}</span>
                <span style={{ color: MUTED, marginLeft: "auto" }}>
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {signups.length === 0 && <span style={{ color: MUTED, fontSize: 13 }}>none yet</span>}
          </div>
        </section>
      </div>
    </div>
  );
}
