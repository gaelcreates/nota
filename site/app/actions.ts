"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEMO, getViewer } from "@/lib/data";
import { supabaseServer } from "@/lib/supabase/server";

async function me() {
  const viewer = await getViewer();
  if (!viewer) throw new Error("Session expirée");
  return viewer;
}

export async function setMission(key: string, done: boolean) {
  if (DEMO) return;
  const viewer = await me();
  const db = await supabaseServer();
  if (done) {
    await db.from("completions").upsert({ member_id: viewer.id, item_key: key }, { onConflict: "member_id,item_key", ignoreDuplicates: true });
  } else {
    await db.from("completions").delete().eq("member_id", viewer.id).eq("item_key", key);
  }
  revalidatePath("/espace", "layout");
}

export async function setMissionLink(key: string, link: string) {
  if (DEMO) return;
  const viewer = await me();
  const db = await supabaseServer();
  const clean = link.trim() || null;
  await db.from("completions").upsert({ member_id: viewer.id, item_key: key, link: clean }, { onConflict: "member_id,item_key" });
  revalidatePath("/espace", "layout");
}

const toInt = (v: FormDataEntryValue | null) => {
  const n = Number(String(v ?? "").replace(/[^\d]/g, ""));
  return String(v ?? "").trim() === "" || Number.isNaN(n) ? null : n;
};

export async function saveMetrics(period: string, form: FormData) {
  if (DEMO) return;
  const viewer = await me();
  const db = await supabaseServer();
  await db.from("metrics").upsert({
    member_id: viewer.id,
    period,
    views: toInt(form.get("views")),
    messages: toInt(form.get("messages")),
    subscribers: toInt(form.get("subscribers")),
    meetings: toInt(form.get("meetings")),
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/espace", "layout");
}

export async function signOut() {
  if (!DEMO) {
    const db = await supabaseServer();
    await db.auth.signOut();
  }
  redirect("/connexion");
}

export async function saveAnswer(key: string, answer: string) {
  if (DEMO) return;
  const viewer = await me();
  const db = await supabaseServer();
  const text = answer.slice(0, 20000);
  if (text.trim()) {
    await db.from("answers").upsert({ member_id: viewer.id, item_key: key, answer: text, updated_at: new Date().toISOString() });
  } else {
    await db.from("answers").delete().eq("member_id", viewer.id).eq("item_key", key);
  }
  revalidatePath("/espace", "layout");
}

export async function updateMyName(form: FormData) {
  if (DEMO) return;
  await me();
  const db = await supabaseServer();
  await db.rpc("update_my_name", { new_name: String(form.get("full_name") ?? "") });
  revalidatePath("/espace", "layout");
}
