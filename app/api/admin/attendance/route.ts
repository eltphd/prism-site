import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { enrollmentId, date } = await req.json();

  if (!enrollmentId || !date) {
    return NextResponse.json({ error: "Missing enrollmentId or date" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("attended_on", date)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("attendance").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ present: false });
  }

  const { error: insertError } = await supabase
    .from("attendance")
    .insert({ enrollment_id: enrollmentId, attended_on: date });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("first_arrival, last_seen")
    .eq("id", enrollmentId)
    .single();

  const firstArrival =
    !enrollment?.first_arrival || date < enrollment.first_arrival ? date : enrollment.first_arrival;
  const lastSeen =
    !enrollment?.last_seen || date > enrollment.last_seen ? date : enrollment.last_seen;

  await supabase
    .from("enrollments")
    .update({ first_arrival: firstArrival, last_seen: lastSeen })
    .eq("id", enrollmentId);

  return NextResponse.json({ present: true });
}
