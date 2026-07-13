import { NextRequest, NextResponse } from "next/server";
import { embed, cosineSimilarity } from "ai";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const EMBED_MODEL = "google/gemini-embedding-001";
const EMBED_DIMS = 768;

function bestMatch(embedding: number[], rows: { name: string; embedding: number[] }[]) {
  let best: { name: string; score: number } | null = null;
  for (const row of rows) {
    const score = cosineSimilarity(embedding, row.embedding);
    if (!best || score > best.score) best = { name: row.name, score };
  }
  return best;
}

export async function POST(req: NextRequest) {
  const { enrollmentId, content } = await req.json();

  if (!enrollmentId || !content) {
    return NextResponse.json({ error: "Missing enrollmentId or content" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  let embedding: number[] | null = null;
  let embedError: string | null = null;
  try {
    const result = await embed({
      model: EMBED_MODEL,
      value: content,
      providerOptions: { google: { outputDimensionality: EMBED_DIMS } },
      maxRetries: 1,
    });
    embedding = result.embedding;
  } catch (err) {
    embedError = err instanceof Error ? err.message : "Embedding failed";
    console.error("reflection embed error:", embedError);
  }

  let matchedFu: { name: string; score: number } | null = null;
  let matchedPosture: { name: string; score: number } | null = null;

  if (embedding) {
    const [{ data: fuRows }, { data: postureRows }] = await Promise.all([
      supabase.from("fu_archetypes").select("name, embedding"),
      supabase.from("prism_postures").select("name, embedding"),
    ]);
    if (fuRows?.length) matchedFu = bestMatch(embedding, fuRows as { name: string; embedding: number[] }[]);
    if (postureRows?.length)
      matchedPosture = bestMatch(embedding, postureRows as { name: string; embedding: number[] }[]);
  }

  const { data: reflection, error } = await supabase
    .from("reflections")
    .insert({
      enrollment_id: enrollmentId,
      content,
      embedding,
      matched_fu_archetype: matchedFu?.name ?? null,
      matched_fu_score: matchedFu?.score ?? null,
      matched_prism_posture: matchedPosture?.name ?? null,
      matched_prism_score: matchedPosture?.score ?? null,
    })
    .select("id, content, matched_fu_archetype, matched_fu_score, matched_prism_posture, matched_prism_score, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reflection, embedError });
}
