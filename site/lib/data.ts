import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase/server";
import type { Offer } from "@/lib/programme";
import * as demo from "@/lib/demo";

export const DEMO = process.env.NOTA_DEMO === "1" && process.env.NODE_ENV !== "production";

export type Member = {
  id: string;
  user_id: string | null;
  email: string;
  full_name: string;
  role: "member" | "admin";
  offer: Offer;
  start_date: string;
  end_date: string;
  last_seen: string | null;
  created_at: string;
  paid: boolean;
  price: number | null;
  paid_amount: number;
  due_note: string | null;
};
export type Completion = { item_key: string; link: string | null; done_at: string };
export type Answer = { item_key: string; answer: string; updated_at: string };
export type Call = {
  id: string;
  held_on: string;
  title: string;
  recording_url: string | null;
  summary: string | null;
  next_steps: string | null;
};
export type Microapp = { level: 1 | 2; step: number; url: string | null; note: string | null };
export type Delivery = { item_key: string; status: "a_venir" | "en_cours" | "livre"; link: string | null };
export type GroupSession = { id: string; held_on: string; theme_key: string; replay_url: string | null };
export type Settings = Record<string, string>;

export type Bundle = {
  completions: Completion[];
  calls: Call[];
  microapp: Microapp | null;
  deliveries: Delivery[];
  answers: Answer[];
};

// La personne connectée, une seule lecture par requête
export const getRealViewer = cache(async (): Promise<Member | null> => {
  if (DEMO) return process.env.NOTA_DEMO_AS === "membre" ? demo.other : demo.viewer;
  const db = await supabaseServer();
  const { data: auth } = await db.auth.getClaims();
  if (!auth?.claims) return null;
  const { data } = await db.from("members").select("*").eq("user_id", auth.claims.sub).maybeSingle();
  if (data) db.rpc("touch_last_seen").then(() => undefined);
  return (data as Member) ?? null;
});

// L'admin peut entrer dans l'espace d'un membre : le cookie AS_COOKIE porte l'id du membre.
// Il n'est lu que si la vraie personne connectée est admin (et la base le revérifie par RLS).
export const AS_COOKIE = "nota_as";

export const getImpersonator = cache(async (): Promise<Member | null> => {
  const real = await getRealViewer();
  if (real?.role !== "admin") return null;
  const id = (await cookies()).get(AS_COOKIE)?.value;
  if (!id || id === real.id) return null;
  return (await getMember(id)) ? real : null;
});

// La personne dont on affiche l'espace : soi-même, ou le membre ouvert par l'admin
export const getViewer = cache(async (): Promise<Member | null> => {
  const real = await getRealViewer();
  if (!(await getImpersonator())) return real;
  return getMember((await cookies()).get(AS_COOKIE)!.value);
});

export const getBundle = cache(async (memberId: string): Promise<Bundle> => {
  if (DEMO) return demo.bundle(memberId);
  const db = await supabaseServer();
  const [c, k, a, d, w] = await Promise.all([
    db.from("completions").select("item_key, link, done_at").eq("member_id", memberId),
    db.from("calls").select("id, held_on, title, recording_url, summary, next_steps").eq("member_id", memberId).order("held_on", { ascending: false }),
    db.from("microapps").select("level, step, url, note").eq("member_id", memberId).maybeSingle(),
    db.from("deliveries").select("item_key, status, link").eq("member_id", memberId),
    db.from("answers").select("item_key, answer, updated_at").eq("member_id", memberId),
  ]);
  return {
    completions: (c.data as Completion[]) ?? [],
    calls: (k.data as Call[]) ?? [],
    microapp: (a.data as Microapp) ?? null,
    deliveries: (d.data as Delivery[]) ?? [],
    answers: (w.data as Answer[]) ?? [],
  };
});

export const getSettings = cache(async (): Promise<Settings> => {
  if (DEMO) return demo.settings;
  const db = await supabaseServer();
  const { data } = await db.from("settings").select("key, value");
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
});

export const getGroupSessions = cache(async (): Promise<GroupSession[]> => {
  if (DEMO) return demo.sessions;
  const db = await supabaseServer();
  const { data } = await db.from("group_sessions").select("id, held_on, theme_key, replay_url").order("held_on", { ascending: false });
  return (data as GroupSession[]) ?? [];
});

// ─── Admin ──────────────────────────────────────────────────
export type MemberRow = Member & { done: string[]; last_done: string | null; micro_step: number | null; written: number };

export async function listMembers(): Promise<MemberRow[]> {
  if (DEMO) return demo.members;
  const db = await supabaseServer();
  const [{ data: members }, { data: done }, { data: apps }, { data: written }] = await Promise.all([
    db.from("members").select("*").order("created_at", { ascending: false }),
    db.from("completions").select("member_id, item_key, done_at"),
    db.from("microapps").select("member_id, step"),
    db.from("answers").select("member_id, item_key"),
  ]);
  return ((members as Member[]) ?? []).map((m) => {
    const mine = (done ?? []).filter((d) => d.member_id === m.id);
    const last = mine.map((d) => d.done_at).sort().at(-1) ?? null;
    return {
      ...m,
      done: mine.map((d) => d.item_key),
      last_done: last,
      micro_step: (apps ?? []).find((a) => a.member_id === m.id)?.step ?? null,
      written: (written ?? []).filter((w) => w.member_id === m.id).length,
    };
  });
}

export const getMember = cache(async (id: string): Promise<Member | null> => {
  if (DEMO) return demo.members.find((m) => m.id === id) ?? null;
  const db = await supabaseServer();
  const { data } = await db.from("members").select("*").eq("id", id).maybeSingle();
  return (data as Member) ?? null;
});
