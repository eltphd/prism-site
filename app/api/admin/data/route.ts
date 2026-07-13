import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  const programSlug = req.nextUrl.searchParams.get("program") ?? "art-week-2026-07";

  const [{ data: programs }, { data: program }, { data: signups }] = await Promise.all([
    supabase.from("programs").select("*").order("start_date", { ascending: false }),
    supabase.from("programs").select("*").eq("slug", programSlug).single(),
    supabase.from("signups").select("*").order("created_at", { ascending: false }),
  ]);

  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, learners(*)")
    .eq("program_id", program.id)
    .order("created_at", { ascending: true });

  const enrollmentIds = (enrollments ?? []).map((e) => e.id);
  const { data: attendance } = enrollmentIds.length
    ? await supabase
        .from("attendance")
        .select("*")
        .in("enrollment_id", enrollmentIds)
        .order("attended_on", { ascending: true })
    : { data: [] };

  const { data: reflections } = enrollmentIds.length
    ? await supabase
        .from("reflections")
        .select("id, enrollment_id, content, matched_fu_archetype, matched_fu_score, matched_prism_posture, matched_prism_score, created_at")
        .in("enrollment_id", enrollmentIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return NextResponse.json({
    programs: programs ?? [],
    program,
    enrollments: enrollments ?? [],
    attendance: attendance ?? [],
    reflections: reflections ?? [],
    signups: signups ?? [],
  });
}
