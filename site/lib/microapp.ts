// La micro-app, étape par étape, d'après le « Framework Nota » (Google Doc du 28 sept 2026).
// Chaque tâche cochée est une ligne de `completions` (clé ma.*), chaque champ une ligne de `answers`.

export const INFOS_DOC = "https://docs.google.com/document/d/1o3kLjkdTD-aCveXI9JMeN-pugyYLf49K2Sub8Nqv0AI/copy";

export type Task = { key: string; label: string; help?: string; href?: string; level?: 2 };
export type Field = { key: string; label: string; placeholder: string; single?: boolean };
export type MicroStep = {
  title: string;
  who: string; // qui fait le travail
  intro: string;
  how?: string[];
  tasks: Task[];
  fields?: Field[];
  action?: { label: string; href: string };
  tip?: string;
};

export const FLOW = [
  { t: "Elle entre", b: "Quelques infos sur sa situation." },
  { t: "Elle reçoit", b: "Un résultat utile, tout de suite." },
  { t: "Elle laisse", b: "Son e-mail, pour garder son résultat." },
  { t: "Elle découvre", b: "Ton offre, au bon moment." },
];

export const LEVELS = [
  { n: 1, title: "Page-outil", body: "Une seule page, rapide, sans base de données. Ton formulaire d'e-mailing y est intégré.", cost: "0 à 20 $ par mois" },
  { n: 2, title: "Mini-app", body: "Comptes, données, e-mails automatiques. Une IA possible, avec ta propre clé.", cost: "20 à 65 $ par mois, plus l'IA à l'usage" },
];

export const IDEAS = [
  { t: "Le calculateur", b: "Ce que ça coûte, ce que ça rapporte, combien de temps il faut." },
  { t: "Le diagnostic", b: "Cinq à dix questions, un profil ou un score, le point à travailler." },
  { t: "Le générateur", b: "Une idée, un texte, un plan, fait à partir de ses réponses." },
  { t: "La checklist", b: "Une liste personnalisée selon sa situation." },
];

export const MICRO_STEPS: MicroStep[] = [
  {
    title: "Tes infos",
    who: "Toi · 30 min",
    intro: "Un document qui me dit tout ce qu'il faut pour construire ton outil, sans aller-retour.",
    how: [
      "Fais ta copie du Doc infos avec le bouton.",
      "Remplis la colonne de droite. Les sept parties.",
      "Partage ta copie avec gael@notaconsulting.ch, droit de modification.",
      "Colle son lien ci-dessous.",
    ],
    action: { label: "Faire ma copie du Doc infos", href: INFOS_DOC },
    tasks: [
      { key: "ma.doc.copie", label: "J'ai fait ma copie" },
      { key: "ma.doc.rempli", label: "Les sept parties sont remplies" },
      { key: "ma.doc.partage", label: "Je l'ai partagée avec Gael" },
    ],
    fields: [{ key: "ma.doc", label: "Lien de ton Doc infos", placeholder: "https://docs.google.com/…", single: true }],
    tip: "Aucun mot de passe dans ce document. Jamais.",
  },
  {
    title: "Tes comptes",
    who: "Toi · 20 min",
    intro: "Tout est à ton nom. L'outil t'appartient dès le premier jour, et tu ne dépends de personne.",
    how: [
      "Crée chaque compte avec ton adresse e-mail professionnelle.",
      "Active la double authentification sur chacun.",
      "Ne m'envoie aucun mot de passe : je travaille comme collaborateur invité.",
    ],
    tasks: [
      { key: "ma.c.github", label: "GitHub", help: "Là où vit le code de ton outil. Gratuit.", href: "https://github.com/signup" },
      { key: "ma.c.cloudflare", label: "Cloudflare", help: "Met ton outil en ligne. Gratuit, usage commercial autorisé.", href: "https://dash.cloudflare.com/sign-up" },
      { key: "ma.c.emailing", label: "Ton outil d'e-mailing", help: "Celui que tu utilises déjà. Si tu n'en as pas, on le choisit à l'étape 3." },
      { key: "ma.c.claude", label: "Claude Pro, si tu veux modifier ton outil toi-même", help: "20 $ par mois, ou 17 $ en annuel. Facultatif.", href: "https://claude.ai" },
      { key: "ma.c.supabase", label: "Supabase", help: "La base de données et les comptes de ton app. Gratuit au départ.", href: "https://supabase.com/dashboard/sign-up", level: 2 },
      { key: "ma.c.resend", label: "Resend", help: "Les e-mails automatiques. Gratuit jusqu'à 3 000 mails par mois.", href: "https://resend.com/signup", level: 2 },
      { key: "ma.c.anthropic", label: "Console Anthropic, si ton app utilise l'IA", help: "Payée à l'usage. Fixe une limite de dépense dès la création.", href: "https://console.anthropic.com", level: 2 },
    ],
    fields: [{ key: "ma.github", label: "Ton nom d'utilisateur GitHub", placeholder: "ex. camille-studio", single: true }],
  },
  {
    title: "L'idée",
    who: "Toi, puis on valide ensemble",
    intro: "La bonne idée répond à la question que ta cible se pose juste avant d'acheter.",
    how: [
      "Relis la leçon 02·6 et la partie 02 de ton Doc infos.",
      "Écris trois pistes ci-dessous, avec les trois mêmes lignes pour chacune.",
      "Choisis celle qui mène le plus naturellement à ton offre.",
      "On la valide pendant un appel. Je te dis le niveau qu'elle demande.",
    ],
    tasks: [{ key: "ma.idee.valide", label: "L'idée est validée avec Gael" }],
    fields: [
      { key: "ma.idee1", label: "Piste 1", placeholder: "Ce que la personne entre : \nCe qu'elle reçoit : \nPourquoi ça mène à ton offre : " },
      { key: "ma.idee2", label: "Piste 2", placeholder: "Ce que la personne entre : \nCe qu'elle reçoit : \nPourquoi ça mène à ton offre : " },
      { key: "ma.idee3", label: "Piste 3", placeholder: "Ce que la personne entre : \nCe qu'elle reçoit : \nPourquoi ça mène à ton offre : " },
      { key: "ma.retenue", label: "La piste retenue, et pourquoi", placeholder: "Piste n°… parce que…" },
    ],
  },
  {
    title: "La construction",
    who: "Gael construit · toi, tu testes",
    intro: "J'écris d'abord chaque écran et chaque texte. Tu valides, puis je code. Tu reçois un lien de test.",
    tasks: [
      { key: "ma.t.ecrans", label: "J'ai validé les écrans et les textes" },
      { key: "ma.t.mobile", label: "Je l'ai testée sur mon téléphone, jusqu'au résultat" },
      { key: "ma.t.inscription", label: "Je me suis inscrit avec ma propre adresse, et j'ai reçu le premier mail" },
      { key: "ma.t.relu", label: "J'ai relu chaque texte, mot par mot" },
    ],
    fields: [{ key: "ma.retours", label: "Tes retours", placeholder: "Ce qui bloque, ce qui manque, ce que tu changerais. Un retour par ligne." }],
  },
  {
    title: "La mise en ligne",
    who: "Ensemble · 30 min, écran partagé",
    intro: "Ton outil passe sur tes comptes et prend son adresse, sur ton propre domaine.",
    how: [
      "Tu acceptes le transfert du dépôt : GitHub t'envoie un mail.",
      "On relie ton Cloudflare au dépôt, ensemble.",
      "On ajoute le sous-domaine, par exemple outil.tonsite.ch.",
      "Tu ouvres l'adresse : le cadenas s'affiche, c'est en ligne.",
    ],
    tasks: [
      { key: "ma.l.transfert", label: "J'ai accepté le transfert du dépôt" },
      { key: "ma.l.cloudflare", label: "Cloudflare est relié au dépôt" },
      { key: "ma.l.domaine", label: "Mon adresse répond, avec le cadenas" },
    ],
    fields: [{ key: "ma.adresse", label: "L'adresse voulue pour ton outil", placeholder: "outil.tonsite.ch", single: true }],
  },
  {
    title: "La passation",
    who: "Ensemble · 30 min",
    intro: "Tu repars en sachant modifier ton outil seul, sans casser ce qui marche.",
    how: [
      "Tu ouvres claude.ai/code avec ton abonnement et tu connectes ton GitHub.",
      "Tu demandes une modification en français. Claude ouvre une proposition, Cloudflare te montre un aperçu.",
      "Si l'aperçu te va, tu valides. Ton outil se met à jour.",
    ],
    tasks: [
      { key: "ma.p.modif", label: "J'ai fait une vraie modification moi-même, de la demande à la publication" },
      { key: "ma.p.video", label: "J'ai reçu la vidéo : où est quoi, comment modifier, comment publier" },
      { key: "ma.p.fiche", label: "J'ai reçu ma fiche : adresses, comptes, coûts" },
    ],
    tip: "Le formulaire et ses réglages ne se modifient pas sans mon accord. Le reste est à toi.",
  },
];

export const MICRO_TASKS = MICRO_STEPS.flatMap((s) => s.tasks);
