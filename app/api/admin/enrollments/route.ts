import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ALLOWED_FIELDS = ["current_stage", "fu_archetype", "prism_posture", "sparks", "notes"] as const;

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  for (const field of ALLOWED_FIELDS) {
    if (field in rest) update[field] = rest[field];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("enrollments")
    .update(update)
    .eq("id", id)
    .select("*, learners(*)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ enrollment: data });
}
