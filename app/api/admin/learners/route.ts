import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { name, email, phone, notes, programId } = await req.json();

  if (!name || !programId) {
    return NextResponse.json({ error: "Missing name or programId" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { data: learner, error: learnerError } = await supabase
    .from("learners")
    .insert({ name, email: email || null, phone: phone || null, notes: notes || null })
    .select()
    .single();
  if (learnerError) {
    return NextResponse.json({ error: learnerError.message }, { status: 500 });
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .insert({ learner_id: learner.id, program_id: programId })
    .select("*, learners(*)")
    .single();
  if (enrollError) {
    return NextResponse.json({ error: enrollError.message }, { status: 500 });
  }

  return NextResponse.json({ enrollment });
}
