// Données d'exemple pour regarder l'interface sans base (NOTA_DEMO=1, en local seulement).
import type { Bundle, GroupSession, Member, MemberRow, Settings } from "@/lib/data";

const d = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

export const viewer: Member = {
  id: "demo-1",
  user_id: "u1",
  email: "camille@exemple.ch",
  full_name: "Camille Exemple",
  role: "admin",
  offer: "nota_plus",
  start_date: d(30),
  end_date: d(-152),
  last_seen: new Date().toISOString(),
  created_at: d(31),
};

const other: Member = {
  ...viewer,
  id: "demo-2",
  email: "hugo@exemple.ch",
  full_name: "Hugo Exemple",
  role: "member",
  offer: "nota",
  start_date: d(4),
  end_date: d(-178),
  last_seen: null,
};

const done = ["d.miro", "d.trois", "d.photo", "d.questionnaire", "d.posts", "d.verbatims", "d.preuves", "m1.1", "m1.2", "m1.3"];

export const members: MemberRow[] = [
  { ...viewer, role: "member", done, last_done: new Date().toISOString() },
  { ...other, done: ["d.miro", "d.trois"], last_done: new Date().toISOString() },
];

export function bundle(id: string): Bundle {
  if (id !== viewer.id) return { completions: [{ item_key: "d.miro", link: null, done_at: d(3) }], metrics: [], calls: [], microapp: null, deliveries: [] };
  return {
    completions: done.map((k, i) => ({ item_key: k, link: k === "d.posts" ? "https://docs.google.com" : null, done_at: d(28 - i * 2) })),
    metrics: [{ period: "depart", views: 18400, messages: 12, subscribers: 0, meetings: 1 }],
    calls: [
      { id: "c2", held_on: d(9), title: "Ta conviction et ton ennemi", recording_url: "https://example.com", summary: "On a posé la croyance et trois principes.", next_steps: "Tester la phrase de positionnement sur trois clients." },
      { id: "c1", held_on: d(23), title: "Premier appel", recording_url: "https://example.com", summary: "Lecture reprise en profondeur, plan des trois mois fixé.", next_steps: null },
    ],
    microapp: { level: 1, step: 2, url: null, note: null },
    deliveries: [
      { item_key: "socle", status: "livre", link: "https://example.com" },
      { item_key: "da", status: "en_cours", link: null },
    ],
  };
}

export const sessions: GroupSession[] = [
  { id: "g3", held_on: d(-3), theme_key: "hooks", replay_url: null },
  { id: "g2", held_on: d(4), theme_key: "strategie", replay_url: "https://example.com" },
  { id: "g1", held_on: d(11), theme_key: "compte", replay_url: "https://example.com" },
];

export const settings: Settings = {
  questionnaire_url: "https://docs.google.com/document/d/1TdX_A1tDLW--BbYJjaLO5EMfjAlYZxfQ45vvtsDmCSU/copy",
  miro_url: "",
  calendly_url: "https://calendly.com",
  discord_url: "https://discord.com",
  whatsapp_url: "",
};
