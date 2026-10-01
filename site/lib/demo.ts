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
  paid: true,
  price: 8000,
  paid_amount: 8000,
  due_note: null,
};

export const other: Member = {
  ...viewer,
  id: "demo-2",
  email: "hugo@exemple.ch",
  full_name: "Hugo Exemple",
  role: "member",
  offer: "nota",
  start_date: d(4),
  end_date: d(-178),
  last_seen: null,
  paid: false,
  price: 4000,
  paid_amount: 1400,
  due_note: "Solde de 2 600 € avant le début des appels 1:1.",
};

const done = ["d.miro", "d.trois", "d.photo", "d.questionnaire", "d.posts", "d.verbatims", "d.preuves", "m1.1", "m1.2", "m1.3"];

export const members: MemberRow[] = [
  { ...viewer, role: "member", done, last_done: new Date().toISOString(), micro_step: 2, written: 3 },
  { ...other, done: ["d.miro", "d.trois"], last_done: d(9), micro_step: 0, written: 0 },
];

export function bundle(id: string): Bundle {
  if (id !== viewer.id) return { completions: [{ item_key: "d.miro", link: null, done_at: d(3) }], calls: [], microapp: null, deliveries: [], answers: [] };
  return {
    completions: done.map((k, i) => ({ item_key: k, link: k === "d.posts" ? "https://docs.google.com" : null, done_at: d(28 - i * 2) })),
    calls: [
      { id: "c2", held_on: d(9), title: "Ta conviction et ton ennemi", recording_url: "https://example.com", summary: "On a posé la croyance et trois principes.", next_steps: "Tester la phrase de positionnement sur trois clients." },
      { id: "c1", held_on: d(23), title: "Premier appel", recording_url: "https://example.com", summary: "Lecture reprise en profondeur, plan des trois mois fixé.", next_steps: null },
    ],
    microapp: { level: 1, step: 2, url: null, note: null },
    deliveries: [
      { item_key: "socle", status: "livre", link: "https://example.com" },
      { item_key: "da", status: "en_cours", link: null },
    ],
    answers: [
      { item_key: "d.miro", answer: "https://miro.com/app/board/exemple=/", updated_at: d(29) },
      { item_key: "d.trois", answer: "Personne 1 : elle aide les indépendantes à trouver des clients.\nPersonne 2 : une coach business, je crois.\nPersonne 3 : elle fait des vidéos de conseils.", updated_at: d(28) },
      { item_key: "m1.1", answer: "Perçue aujourd'hui : la coach sympa qui poste des conseils.\nVoulue dans six mois : la référence qui fait passer les indépendantes à leur premier vrai client.", updated_at: d(20) },
      { item_key: "m1.2", answer: "Je voudrais vivre de mon activité, parce que j'ai quitté un salaire pour ça, mais personne ne sait vraiment ce que je fais.", updated_at: d(14) },
      { item_key: "m1.3", answer: "Croyance : on vend mieux en montrant qu'en expliquant.\nPrincipes : la preuve avant la promesse, la régularité avant le volume, la clarté avant le style.\nEnnemi : les conseils génériques.\nFaiblesse : je parle lentement, et je l'assume.", updated_at: d(8) },
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
  miro_url: "https://miro.com/app/board/uXjVEfgXGIQ=/",
  calendly_url: "https://calendly.com",
  beneficiary: "Gael Fischer",
  iban: "CH93 0076 2011 6238 5295 7",
  street: "Rue de l'Exemple 1",
  postal_code: "1110",
  town: "Morges",
  country: "CH",
  currency: "EUR",
  discord_url: "https://discord.com",
  whatsapp_url: "",
};
