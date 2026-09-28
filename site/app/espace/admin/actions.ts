"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DEMO, getViewer } from "@/lib/data";
import { supabaseServer } from "@/lib/supabase/server";
import { addMonths } from "@/lib/time";

async function admin() {
  const viewer = await getViewer();
  if (viewer?.role !== "admin") throw new Error("Réservé à l'admin");
  return supabaseServer();
}

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opt = (f: FormData, k: string) => str(f, k) || null;

export async function inviteMember(_: string | null, form: FormData): Promise<string | null> {
  if (DEMO) return "Mode démo : rien n'est enregistré";
  const db = await admin();
  const start = str(form, "start_date") || new Date().toISOString().slice(0, 10);
  const { data, error } = await db
    .from("members")
    .insert({
      email: str(form, "email").toLowerCase(),
      full_name: str(form, "full_name"),
      offer: str(form, "offer") || "nota",
      start_date: start,
      end_date: addMonths(start, 6),
    })
    .select("id")
    .single();
  if (error) return error.code === "23505" ? "Cette adresse est déjà invitée." : "L'invitation n'a pas pu être créée.";
  await db.from("microapps").insert({ member_id: data.id });
  revalidatePath("/espace/admin");
  redirect(`/espace/admin/membres/${data.id}`);
}

export async function updateMember(id: string, form: FormData) {
  if (DEMO) return;
  const db = await admin();
  await db
    .from("members")
    .update({
      full_name: str(form, "full_name"),
      offer: str(form, "offer"),
      role: str(form, "role"),
      start_date: str(form, "start_date"),
      end_date: str(form, "end_date"),
    })
    .eq("id", id);
  revalidatePath("/espace", "layout");
}

export async function removeMember(id: string) {
  if (DEMO) return;
  const db = await admin();
  await db.from("members").delete().eq("id", id);
  revalidatePath("/espace/admin");
  redirect("/espace/admin");
}

export async function addCall(memberId: string, form: FormData) {
  if (DEMO) return;
  const db = await admin();
  await db.from("calls").insert({
    member_id: memberId,
    held_on: str(form, "held_on") || new Date().toISOString().slice(0, 10),
    title: str(form, "title"),
    recording_url: opt(form, "recording_url"),
    summary: opt(form, "summary"),
    next_steps: opt(form, "next_steps"),
  });
  revalidatePath("/espace", "layout");
}

export async function deleteCall(memberId: string, callId: string) {
  if (DEMO) return;
  const db = await admin();
  await db.from("calls").delete().eq("id", callId).eq("member_id", memberId);
  revalidatePath("/espace", "layout");
}

export async function saveMicroapp(memberId: string, form: FormData) {
  if (DEMO) return;
  const db = await admin();
  await db.from("microapps").upsert({
    member_id: memberId,
    level: Number(str(form, "level") || 1),
    step: Number(str(form, "step") || 0),
    url: opt(form, "url"),
    note: opt(form, "note"),
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/espace", "layout");
}

export async function saveDelivery(memberId: string, key: string, form: FormData) {
  if (DEMO) return;
  const db = await admin();
  await db.from("deliveries").upsert({ member_id: memberId, item_key: key, status: str(form, "status"), link: opt(form, "link") });
  revalidatePath("/espace", "layout");
}

export async function addSession(form: FormData) {
  if (DEMO) return;
  const db = await admin();
  await db.from("group_sessions").insert({ held_on: str(form, "held_on"), theme_key: str(form, "theme_key"), replay_url: opt(form, "replay_url") });
  revalidatePath("/espace", "layout");
}

export async function updateSession(id: string, form: FormData) {
  if (DEMO) return;
  const db = await admin();
  await db.from("group_sessions").update({ replay_url: opt(form, "replay_url") }).eq("id", id);
  revalidatePath("/espace", "layout");
}

export async function deleteSession(id: string) {
  if (DEMO) return;
  const db = await admin();
  await db.from("group_sessions").delete().eq("id", id);
  revalidatePath("/espace", "layout");
}

export async function saveSettings(form: FormData) {
  if (DEMO) return;
  const db = await admin();
  const rows = ["questionnaire_url", "miro_url", "calendly_url", "discord_url", "whatsapp_url"].map((key) => ({ key, value: str(form, key) }));
  await db.from("settings").upsert(rows);
  revalidatePath("/espace", "layout");
}
