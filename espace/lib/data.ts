import "server-only";
import { cache } from "react";
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
};
export type Completion = { item_key: string; link: string | null; done_at: string };
export type Metric = {
  period: "depart" | "m3" | "m6";
  views: number | null;
  messages: number | null;
  subscribers: number | null;
  meetings: number | null;
};
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
  metrics: Metric[];
  calls: Call[];
  microapp: Microapp | null;
  deliveries: Delivery[];
};

// La personne connectée, une seule lecture par requête
export const getViewer = cache(async (): Promise<Member | null> => {
  if (DEMO) return demo.viewer;
  const db = await supabaseServer();
  const { data: auth } = await db.auth.getClaims();
  if (!auth?.claims) return null;
  const { data } = await db.from("members").select("*").eq("user_id", auth.claims.sub).maybeSingle();
  if (data) db.rpc("touch_last_seen").then(() => undefined);
  return (data as Member) ?? null;
});

export const getBundle = cache(async (memberId: string): Promise<Bundle> => {
  if (DEMO) return demo.bundle(memberId);
  const db = await supabaseServer();
  const [c, m, k, a, d] = await Promise.all([
    db.from("completions").select("item_key, link, done_at").eq("member_id", memberId),
    db.from("metrics").select("period, views, messages, subscribers, meetings").eq("member_id", memberId),
    db.from("calls").select("id, held_on, title, recording_url, summary, next_steps").eq("member_id", memberId).order("held_on", { ascending: false }),
    db.from("microapps").select("level, step, url, note").eq("member_id", memberId).maybeSingle(),
    db.from("deliveries").select("item_key, status, link").eq("member_id", memberId),
  ]);
  return {
    completions: (c.data as Completion[]) ?? [],
    metrics: (m.data as Metric[]) ?? [],
    calls: (k.data as Call[]) ?? [],
    microapp: (a.data as Microapp) ?? null,
    deliveries: (d.data as Delivery[]) ?? [],
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
export type MemberRow = Member & { done: string[]; last_done: string | null };

export async function listMembers(): Promise<MemberRow[]> {
  if (DEMO) return demo.members;
  const db = await supabaseServer();
  const [{ data: members }, { data: done }] = await Promise.all([
    db.from("members").select("*").order("created_at", { ascending: false }),
    db.from("completions").select("member_id, item_key, done_at"),
  ]);
  return ((members as Member[]) ?? []).map((m) => {
    const mine = (done ?? []).filter((d) => d.member_id === m.id);
    const last = mine.map((d) => d.done_at).sort().at(-1) ?? null;
    return { ...m, done: mine.map((d) => d.item_key), last_done: last };
  });
}

export async function getMember(id: string): Promise<Member | null> {
  if (DEMO) return demo.members.find((m) => m.id === id) ?? null;
  const db = await supabaseServer();
  const { data } = await db.from("members").select("*").eq("id", id).maybeSingle();
  return (data as Member) ?? null;
}
