// Seeds/updates the fu_archetypes and prism_postures reference tables with
// embeddings, used to semantically match facilitator reflections to a
// learner's FU archetype / PRISM posture. Re-run whenever the canon changes
// (e.g. once the Catalyst posture is renamed by teens).
//
// Usage: vercel env pull .env.local --yes && node scripts/seed-archetypes.mjs
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, "")];
    })
);
process.env.VERCEL_OIDC_TOKEN = env.VERCEL_OIDC_TOKEN;

const { embed } = await import("ai");
const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

export const EMBED_MODEL = "google/gemini-embedding-001";
export const EMBED_DIMS = 768;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function embedText(text, attempt = 1) {
  try {
    const { embedding } = await embed({
      model: EMBED_MODEL,
      value: text,
      providerOptions: { google: { outputDimensionality: EMBED_DIMS } },
      maxRetries: 0,
    });
    return embedding;
  } catch (err) {
    const rateLimited = String(err?.message || "").includes("rate-limited") || err?.statusCode === 429;
    if (rateLimited && attempt <= 6) {
      const wait = attempt * 20000;
      console.log(`rate-limited, waiting ${wait / 1000}s (attempt ${attempt})`);
      await sleep(wait);
      return embedText(text, attempt + 1);
    }
    throw err;
  }
}

const fuArchetypes = [
  {
    name: "The Deep",
    tagline: "Still water. Bottomless feeling.",
    description:
      "Move through the world carrying more than most people can see. Emotional life runs beneath the surface — wide, quiet, profound. Others feel safe before they know why. Interoceptive awareness, somatic processing.",
  },
  {
    name: "The Alchemist",
    tagline: "Feelings become fuel. Fuel becomes fire.",
    description:
      "Don't just experience emotions — transform them. Something raw comes in, something real comes out: art, ideas, change, momentum. Expressive transformation, cognitive reappraisal.",
  },
  {
    name: "The Root",
    tagline: "Your body knew before your brain did.",
    description:
      "Listens to signals most people miss. Emotional intelligence is somatic — lives in the nervous system before it becomes language. Nervous system regulation, somatic grounding.",
  },
  {
    name: "The Seeker",
    tagline: "You won't stop pulling the thread.",
    description:
      "Needs to understand before fully trusting a feeling. Curious about their own interior in a way most people aren't. Asks better questions than anyone in the room. Cognitive reappraisal, psychological flexibility.",
  },
  {
    name: "The Signal",
    tagline: "You exist and you will be heard.",
    description:
      "Processes by speaking. Naming, claiming, declaring. Low tolerance for pretense, high capacity for saying the necessary honest thing. Expressive assertion, interpersonal emotion regulation.",
  },
];

const prismPostures = [
  {
    name: "Decoder",
    tagline: "The one who figures out what's really going on.",
    description:
      "Let me read the room, read between the lines. Notices the thing nobody's saying out loud. The pattern-reader. Clocks the subtext, the vibe shift, the real meaning under the words.",
    status: "locked",
  },
  {
    name: "Navigator",
    tagline: "The one who finds the way through.",
    description:
      "Here's how we get there. Maps it, keeps the group on track, knows the next step. The guide. Holds the plan when everyone else is lost.",
    status: "locked",
  },
  {
    name: "Pathfinder",
    tagline: "The one who tries the new way first.",
    description:
      "What if we did it totally different? Tests it, goes off the map and reports back. The experimenter. Hacks a new path instead of taking the given one.",
    status: "locked",
  },
  {
    name: "Expressionist",
    tagline: "The one who says the true thing out loud.",
    description:
      "Puts it into words, art, sound. Feels it big and shows it. The voice. Turns what everyone's feeling into something you can see or hear.",
    status: "locked",
  },
  {
    name: "Catalyst",
    tagline: "The one who makes things HAPPEN.",
    description:
      "The reason the group actually started. Lights the match, gets the group moving, not scared to go first. The starter. The hype. Turns a quiet room into a thing happening.",
    status: "provisional — being renamed by teens",
  },
];

for (const a of fuArchetypes) {
  const embedding = await embedText(`${a.name}. ${a.tagline} ${a.description}`);
  const { error } = await supabase
    .from("fu_archetypes")
    .upsert({ ...a, embedding }, { onConflict: "name" });
  if (error) throw error;
  console.log("seeded FU archetype:", a.name);
}

for (const p of prismPostures) {
  const embedding = await embedText(`${p.name}. ${p.tagline} ${p.description}`);
  const { error } = await supabase
    .from("prism_postures")
    .upsert({ ...p, embedding }, { onConflict: "name" });
  if (error) throw error;
  console.log("seeded PRISM posture:", p.name);
}

const { data: fu } = await supabase.from("fu_archetypes").select("name");
const { data: pp } = await supabase.from("prism_postures").select("name");
console.log("fu_archetypes rows:", fu.map((r) => r.name));
console.log("prism_postures rows:", pp.map((r) => r.name));
