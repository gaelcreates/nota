// Contenu du programme Nota : la structure vit ici, versionnée dans Git.
// Les vidéos et le texte des leçons viendront plus tard (champ `video`).

export type Offer = "nota" | "nota_plus" | "repli";

export const OFFERS: Record<Offer, string> = {
  nota: "Nota",
  nota_plus: "Nota+",
  repli: "Nota",
};

// ─── Le départ : avant le premier appel ─────────────────────
export type Mission = {
  key: string;
  title: string;
  minutes: number;
  body: string;
  group: "jour1" | "semaine1" | "bonus";
  action?: { label: string; setting?: string; href?: string };
};

export const DEPART_GROUPS = [
  { key: "jour1", title: "Jour 1" },
  { key: "semaine1", title: "Semaine 1" },
  { key: "bonus", title: "Si tu as de l'avance" },
] as const;

export const DEPART: Mission[] = [
  {
    key: "d.miro",
    group: "jour1",
    title: "Copie ton Miro",
    minutes: 5,
    body: "Duplique le modèle « Ta marque » sur ton tableau. Tout le module 01 s'y remplit.",
    action: { label: "Ouvrir le modèle", setting: "miro_url" },
  },
  {
    key: "d.trois",
    group: "jour1",
    title: "Le test des trois",
    minutes: 5,
    body: "Envoie à trois personnes qui te suivent : « décris-moi en une phrase ». Les réponses arrivent pendant que tu fais le reste.",
  },
  {
    key: "d.photo",
    group: "jour1",
    title: "Ta photo de départ",
    minutes: 10,
    body: "Capture ton profil et note tes quatre chiffres des trente derniers jours. On refait la même photo à trois et six mois.",
    action: { label: "Noter mes chiffres", href: "/espace/progression" },
  },
  {
    key: "d.questionnaire",
    group: "jour1",
    title: "Le questionnaire",
    minutes: 60,
    body: "Les 52 questions, en deux fois si tu préfères. Partage ta copie avec Gael avant le premier appel.",
    action: { label: "Faire ma copie", setting: "questionnaire_url" },
  },
  {
    key: "d.posts",
    group: "semaine1",
    title: "Tes dix derniers posts",
    minutes: 30,
    body: "Un tableau : sujet, format, accroche, vues, partages, enregistrements, abonnés gagnés.",
  },
  {
    key: "d.verbatims",
    group: "semaine1",
    title: "Ta banque de verbatims",
    minutes: 45,
    body: "Vingt phrases exactes de clients ou de prospects. Classées en trois : douleur, désir, objection.",
  },
  {
    key: "d.preuves",
    group: "semaine1",
    title: "Ta banque de preuves",
    minutes: 30,
    body: "Un dossier, une capture par preuve : avis, résultats, chiffres, avant et après, mentions.",
  },
  {
    key: "d.inconnu",
    group: "semaine1",
    title: "Le parcours de l'inconnu",
    minutes: 20,
    body: "Depuis un téléphone qui ne te suit pas : un post, ton profil, ton lien, jusqu'à pouvoir te parler. Note où ça bloque.",
  },
  {
    key: "d.concurrents",
    group: "bonus",
    title: "Trois concurrents",
    minutes: 40,
    body: "Bio, offre visible, prix s'il est affiché, lien en bio, leurs trois posts les plus vus.",
  },
  {
    key: "d.moodboard",
    group: "bonus",
    title: "Ton moodboard",
    minutes: 30,
    body: "Quinze images sur ton Miro : lieux, lumière, tenues, typos, couleurs.",
  },
];

// ─── Les quatre modules ─────────────────────────────────────
export type Lesson = {
  key: string;
  title: string;
  mission: string;
  livrable: string;
  feeds?: string[]; // missions du départ qui donnent déjà de la matière
  video?: string;
};

export type Module = {
  slug: string;
  number: string;
  title: string;
  livrable: string;
  lessons: Lesson[];
};

export const MODULES: Module[] = [
  {
    slug: "marque",
    number: "01",
    title: "La marque",
    livrable: "Ton socle de marque et ta charte, deux pages, sur ton Miro",
    lessons: [
      { key: "m1.1", title: "Marque perçue et marque voulue", mission: "Écris ta phrase perçue et ta phrase voulue", livrable: "Ta phrase perçue aujourd'hui, ta phrase voulue dans six mois", feeds: ["d.trois", "d.photo"] },
      { key: "m1.2", title: "Ta cible et sa tension", mission: "Trouve ton insight, fais-le valider par trois personnes", livrable: "Une phrase d'insight validée par trois personnes", feeds: ["d.verbatims"] },
      { key: "m1.3", title: "Ta conviction, tes principes, ton ennemi", mission: "Pose une croyance, trois principes, un ennemi, une faiblesse", livrable: "Une croyance, trois principes, un ennemi, une faiblesse assumée" },
      { key: "m1.4", title: "Ta différence et tes preuves", mission: "Remplis ton tableau de différence, empile cinq preuves", livrable: "Ton tableau de différence et cinq preuves empilées", feeds: ["d.preuves", "d.concurrents"] },
      { key: "m1.5", title: "Ta promesse et ton positionnement", mission: "Écris ta phrase de positionnement et teste-la", livrable: "Une phrase de positionnement testée" },
      { key: "m1.6", title: "Ta personnalité, ton ton, ton histoire", mission: "Écris ta fiche de personnalité et ton histoire en une page", livrable: "Ta fiche de personnalité, tes mots oui et non, ton histoire en une page" },
      { key: "m1.7", title: "Ton monde et ton identité visuelle", mission: "Fais ta charte en une page, applicable par un monteur", livrable: "Ta charte en une page : monde, couleur, typos, cadre", feeds: ["d.moodboard"] },
      { key: "m1.8", title: "Ta présence et ton son", mission: "Écris ta règle de tournage, lance ta banque de départ", livrable: "Ta règle de tournage et ta banque de départ" },
    ],
  },
  {
    slug: "offre",
    number: "02",
    title: "L'offre",
    livrable: "Ton offre écrite, prix compris, et le brief de ta micro-app",
    lessons: [
      { key: "m2.1", title: "La transformation et pour qui", mission: "Écris ta transformation : de A à B, pour qui", livrable: "Une phrase : de A à B, pour qui", feeds: ["d.verbatims"] },
      { key: "m2.2", title: "La structure de l'offre", mission: "Structure ton offre en trois briques, sur une page", livrable: "Ton offre en trois briques, une page" },
      { key: "m2.3", title: "La promesse et ses preuves", mission: "Écris ta promesse d'offre avec trois preuves", livrable: "Ta promesse d'offre et trois preuves", feeds: ["d.preuves"] },
      { key: "m2.4", title: "Le prix", mission: "Fixe ton prix, ton ancrage, ton mode de paiement", livrable: "Un prix, un ancrage, un mode de paiement", feeds: ["d.concurrents"] },
      { key: "m2.5", title: "La gamme", mission: "Dessine ta gamme en trois étages et le chemin entre eux", livrable: "Ta gamme en trois étages, avec le chemin entre eux" },
      { key: "m2.6", title: "Ta micro-app, l'offre d'appel", mission: "Remplis le brief de ta micro-app, niveau 1 ou 2", livrable: "Ton brief de micro-app rempli" },
    ],
  },
  {
    slug: "contenu",
    number: "03",
    title: "Le contenu",
    livrable: "Ta grille, ta semaine type et trois scripts écrits",
    lessons: [
      { key: "m3.1", title: "Le tunnel par émotions", mission: "Dessine ton tunnel en quatre étapes, un format par étape", livrable: "Ton tunnel en quatre étapes, un format par étape" },
      { key: "m3.2", title: "Le client idéal et le viewer idéal", mission: "Écris tes deux fiches : client idéal et viewer idéal", livrable: "Tes deux fiches, une page chacune", feeds: ["d.verbatims"] },
      { key: "m3.3", title: "Ta grille éditoriale", mission: "Construis ta grille : piliers × étapes du tunnel", livrable: "Ta grille : piliers × étapes du tunnel", feeds: ["d.posts"] },
      { key: "m3.4", title: "Les formats et les séries", mission: "Choisis tes trois formats, filme un exemple de chacun", livrable: "Tes trois formats, un exemple filmé pour chacun", feeds: ["d.posts"] },
      { key: "m3.5", title: "Le système de stories", mission: "Écris ta semaine de stories type", livrable: "Ta semaine de stories type" },
      { key: "m3.6", title: "Accroche, preuves, boucle", mission: "Écris trois scripts : accroche, preuves, boucle ouverte", livrable: "Trois scripts écrits" },
      { key: "m3.7", title: "Produire avec constance", mission: "Pose ta semaine type, jour de tournage compris", livrable: "Ta semaine type, jour de tournage compris" },
    ],
  },
  {
    slug: "conversion",
    number: "04",
    title: "La conversion",
    livrable: "Ton chemin vers le rendez-vous, installé et mesuré",
    lessons: [
      { key: "m4.1", title: "Appels à l'action et aimant", mission: "Écris tes trois appels à l'action, un par étape du tunnel", livrable: "Tes trois appels à l'action, écrits" },
      { key: "m4.2", title: "Exploiter ta micro-app", mission: "Fais ton plan de diffusion et ta première relance", livrable: "Ton plan de diffusion et ta première relance" },
      { key: "m4.3", title: "Du message privé au rendez-vous", mission: "Écris ton script de message et tes tags", livrable: "Ton script de message et tes tags", feeds: ["d.inconnu"] },
      { key: "m4.4", title: "L'appel de vente, la Lecture", mission: "Écris ta trame d'appel et ta séquence de rappels", livrable: "Ta trame d'appel et ta séquence de rappels" },
      { key: "m4.5", title: "L'e-mail et la mesure", mission: "Envoie ton premier e-mail, remplis ton tableau à quatre chiffres", livrable: "Ton premier e-mail et ton tableau à quatre chiffres", feeds: ["d.photo"] },
    ],
  },
];

export const LESSONS = MODULES.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m })));

export const EXTRAS = [
  { title: "IA et contenu", body: "Le module annexe, en complément." },
  { title: "Production et montage", body: "Ressources et appel dédié." },
  { title: "Ressources", body: "Structures de script, charte audiovisuelle, matériel." },
];

// ─── Appels de groupe ───────────────────────────────────────
export const THEMES = [
  { key: "compte", title: "Analyse de compte", body: "Un membre, son compte en direct." },
  { key: "strategie", title: "Stratégie", body: "Ta grille contre ton tunnel : où ça fuit." },
  { key: "hooks", title: "Hooks", body: "Trois accroches réécrites en direct." },
  { key: "script", title: "Script", body: "Accroche, preuves empilées, boucle ouverte." },
  { key: "offre", title: "Offre", body: "Une offre relue à voix haute." },
  { key: "microapp", title: "Micro-app", body: "Une micro-app de membre, en démo." },
  { key: "messages", title: "Messages et Lecture", body: "Du premier message à l'appel." },
  { key: "chiffres", title: "Chiffres", body: "Tes quatre chiffres, le maillon qui casse." },
];

// ─── Micro-app ──────────────────────────────────────────────
export const MICROAPP_STEPS = [
  { title: "Tes infos", body: "Le Doc infos, rempli." },
  { title: "Tes comptes", body: "Créés à ton nom." },
  { title: "L'idée", body: "Trois pistes, une retenue." },
  { title: "La construction", body: "Gael construit, tu testes." },
  { title: "La mise en ligne", body: "Sur ton domaine." },
  { title: "La passation", body: "Elle t'appartient." },
];

// ─── Nota+ : ce que Gael livre ──────────────────────────────
export const DELIVERIES = [
  { key: "socle", title: "L'architecture de ta marque" },
  { key: "da", title: "Ta direction artistique" },
  { key: "strategie", title: "Ta stratégie de contenu" },
  { key: "tunnel", title: "Ton tunnel d'acquisition" },
  { key: "page", title: "Ta page de vente" },
  { key: "emails", title: "Ta séquence d'e-mails" },
  { key: "journee", title: "Notre journée ensemble" },
];

export const DELIVERY_STATUS = {
  a_venir: "À venir",
  en_cours: "En cours",
  livre: "Livré",
} as const;

// ─── Les quatre chiffres ────────────────────────────────────
export const METRICS = [
  { key: "views", label: "Vues" },
  { key: "messages", label: "Messages" },
  { key: "subscribers", label: "Inscrits e-mail" },
  { key: "meetings", label: "Rendez-vous" },
] as const;

export const PERIODS = [
  { key: "depart", label: "Départ", week: 1 },
  { key: "m3", label: "3 mois", week: 13 },
  { key: "m6", label: "6 mois", week: 26 },
] as const;

export const TOTAL_WEEKS = 26;
export const ONE_TO_ONE_WEEKS = 13;
