// Contenu des leçons, repris du tableau « Programme Nota » et réécrit pour le membre.
// Les exemples privés (prénoms de clients, notes de tournage) sont retirés.

export type LessonContent = { minutes: number; points: string[]; examples: string[] };

export const CONTENT: Record<string, LessonContent> = {
  // ─── 01 La marque
  "m1.1": {
    minutes: 8,
    points: [
      "Le branding, c'est ce que les gens ressentent, pas ce que tu déclares.",
      "Deux images : celle que tu crois donner, celle qu'on reçoit. L'écart, c'est le travail.",
      "Une marque se résume en une phrase, en deux secondes.",
      "Moins mais mieux : une poignée de choix tenus, pas seize.",
    ],
    examples: [
      "Ryanair veut être le moins cher et se moque de lui-même. Voulu et perçu coïncident.",
      "Le créateur qui se voit expert, que ses abonnés décrivent comme « sympa ».",
      "« Ta marque, c'est ce qu'on dit de toi quand tu n'es pas dans la pièce. »",
    ],
  },
  "m1.2": {
    minutes: 12,
    points: [
      "Un insight tient en trois temps : « je voudrais, parce que, mais ».",
      "Les trois tests : « ah oui », « c'est moi », une vraie tension.",
      "Sans clients, on le trouve dans les messages privés et les commentaires.",
      "Le spectateur idéal est nombreux. Le client idéal est celui qui paie.",
    ],
    examples: [
      "Snickers, « tu n'es pas toi-même quand tu as faim » : une tension, pas un bénéfice.",
      "Les deux cercles qui se recouvrent : on crée pour la zone commune.",
    ],
  },
  "m1.3": {
    minutes: 10,
    points: [
      "Une croyance d'abord, une raison d'être ensuite.",
      "Les valeurs se trouvent par leur contraire : ce que tu refuses, ton ennemi.",
      "Tes principes se voient dans tes choix, pas dans une liste.",
      "Une faiblesse assumée vaut plus qu'une qualité déclarée.",
    ],
    examples: [
      "Apple, « Think different » : on achète ce qu'ils croient.",
      "Patagonia, « n'achetez pas cette veste » : une conviction qui coûte, donc crédible.",
      "« Je préfère la qualité au volume, même si ça me coûte des vues. »",
    ],
  },
  "m1.4": {
    minutes: 12,
    points: [
      "Ce que tout le monde fait dans ta niche, ce que toi seul fais.",
      "Trois questions : seul, premier, meilleur.",
      "Une preuve seule ne suffit pas, on les empile : chiffres, histoire, volume de contenu, clients.",
      "Le proof stacking sert deux fois : dans ta marque, et dans chaque script.",
    ],
    examples: [
      "Freitag : des sacs en bâches de camion. La différence se voit avant qu'on l'explique.",
      "Liquid Death : de l'eau en canette, une signature que personne n'a.",
      "Gael : grenadier, vingt et un ans, dix mille abonnés. Trois preuves qui ne vont pas ensemble, et c'est ce qui marque.",
    ],
  },
  "m1.5": {
    minutes: 10,
    points: [
      "La formule : « pour, je suis, qui, parce que ».",
      "Trois promesses candidates, pas une.",
      "Le test : claire, crédible, attractive, distinctive, durable.",
    ],
    examples: [
      "Domino's, « livrée en trente minutes ou offerte » : claire et testable.",
      "Nota : « une marque qui crée avec constance et qui convertit ».",
      "Contre-exemple : « je t'aide à développer ta visibilité ». Ni distinctive, ni crédible.",
    ],
  },
  "m1.6": {
    minutes: 12,
    points: [
      "Trois adjectifs, un archétype au plus.",
      "Les mots oui, les mots non : ton langage interne.",
      "Ne joue pas un rôle. Embellis, n'invente pas : ton masque tomberait.",
      "Ton histoire est la seule chose que personne ne peut copier. Raconte-la comme une transformation.",
    ],
    examples: [
      "Harley-Davidson le hors-la-loi, Nike le héros, Apple le créateur.",
      "La douleur d'hier devient celle de ton audience : c'est elle qui crée le lien.",
      "« 400 abonnés, 0 client, 0 crédibilité » : un point de départ qui se raconte.",
    ],
  },
  "m1.7": {
    minutes: 14,
    points: [
      "Ton monde : lieux, décor, tenue, personnages récurrents. On te reconnaît avant que tu parles.",
      "Les codes découlent du socle : couleur, typo, cadre choisis à partir de tes principes, pas au goût.",
      "Une couleur, une ou deux typos, tenues dans le temps. La mémoire vient de la répétition.",
      "Le test : trois personnes, une seconde, « c'est qui ? ».",
    ],
    examples: [
      "Le jaune de Nota, choisi parce que personne ne l'avait dans la niche.",
      "Une couleur tenue, puis trois nuances : la palette grandit sans se perdre.",
      "Toujours le même lieu et le même étalonnage : rien d'autre, et on reconnaît.",
    ],
  },
  "m1.8": {
    minutes: 12,
    points: [
      "La présence : posture, regard, débit, rythme. Ce que la caméra montre en premier.",
      "Le son : quatre ou cinq musiques à toi, des effets qui correspondent à quelque chose.",
      "Les plans de coupe : trois distances, large, moyen, rapproché, dans chaque vidéo.",
      "Tes références : les comptes que tu aimes, pour savoir ce que tu gardes et ce que tu laisses.",
    ],
    examples: [
      "Casey Neistat : l'énergie et le rythme avant le sujet.",
      "Une musique tenue dans le temps finit par signer à ta place.",
      "Ta banque de départ : six plans par lieu.",
    ],
  },
  // ─── 02 L'offre
  "m2.1": {
    minutes: 10,
    points: [
      "Une offre, c'est un avant et un après, pour une personne précise.",
      "On vend l'arrivée, jamais les moyens.",
      "Le client idéal, pas le spectateur : celui qui paie pour arriver.",
    ],
    examples: [
      "Nota : « il produit, tu diriges » au départ, « une marque qui tient » à l'arrivée.",
      "Le barbier vend « plus de clients de sa ville », pas « des reels ».",
      "Mathis : de quatre cents vues à des demandes qui citent ses vidéos.",
    ],
  },
  "m2.2": {
    minutes: 12,
    points: [
      "Trois briques : le cœur (ce qui transforme), le cadre (durée, rythme, accès), les preuves (ce qu'on repart avec).",
      "Trois niveaux de livraison : tu fais, on fait ensemble, je fais pour toi.",
      "Règle : on fait ensemble ce dont la mauvaise exécution ruine la suite.",
    ],
    examples: [
      "Nota et Nota+ : même cœur, le goulot change. D'abord la direction, puis le temps.",
      "Une onglerie : la prestation, le suivi, le rappel.",
      "Un coach : l'appel, le plan, le groupe.",
    ],
  },
  "m2.3": {
    minutes: 10,
    points: [
      "La promesse d'offre est plus précise que celle de la marque : un résultat, un délai, une condition.",
      "Pas de garantie, une condition d'effort, dite avant.",
      "Les preuves s'empilent : chiffres, avant et après, paroles de clients.",
    ],
    examples: [
      "Domino's : « livrée en trente minutes ou offerte ».",
      "Nota : « la seule garantie, c'est l'effort que tu y mets ».",
    ],
  },
  "m2.4": {
    minutes: 12,
    points: [
      "Le prix dit qui tu es avant que tu parles.",
      "On part de la valeur du résultat, pas du temps passé.",
      "Un prix d'ancrage au-dessus rend le prix principal raisonnable.",
      "Le paiement en plusieurs fois change la décision, pas le prix.",
    ],
    examples: [
      "Apple : le modèle Pro existe pour vendre le modèle standard.",
      "Le salon qui affiche « à partir de » attire ceux qui négocient.",
      "L'indépendant qui facture à l'heure se plafonne lui-même.",
    ],
  },
  "m2.5": {
    minutes: 8,
    points: [
      "Trois étages, jamais plus : une entrée gratuite, une offre principale, une offre au-dessus.",
      "Chaque étage prépare le suivant.",
      "L'offre du dessus se propose à la fin, pas au début.",
    ],
    examples: [
      "Nota : la micro-app, puis la Lecture, puis Nota, puis Nota+.",
      "Un coach : audit gratuit, programme, suivi.",
      "Contre-exemple : sept offres sur la page, personne ne choisit.",
    ],
  },
  "m2.6": {
    minutes: 12,
    points: [
      "Le lien en bio, tout le monde le met, presque personne ne l'exploite.",
      "Un résultat en trente secondes contre un e-mail : c'est une méthode d'acquisition, pas un gadget.",
      "La liste t'appartient : newsletter, service, produit, tout est ouvert.",
      "Le brief : ton client, sa question, le résultat rendu.",
    ],
    examples: [
      "Un simulateur pour un courtier, un diagnostic pour un coach, un devis instantané pour un artisan.",
      "Nota : la Lecture en six maillons.",
    ],
  },
  // ─── 03 Le contenu
  "m3.1": {
    minutes: 12,
    points: [
      "Chaque contenu fait une chose : attirer, faire confiance, donner envie, faire agir.",
      "On ne demande jamais au même post de tout faire.",
      "Les émotions dans l'ordre : curiosité, confiance, désir, action.",
    ],
    examples: [
      "Le tunnel de Nota : micro-app, premier message, Lecture, avec une émotion à chaque étape.",
      "Le post qui fait beaucoup de vues et n'amène rien : de la curiosité sans suite.",
      "Les vidéos qui font écrire « j'ai vu ta vidéo sur… » : c'est là que tout commence.",
    ],
  },
  "m3.2": {
    minutes: 10,
    points: [
      "Le spectateur regarde, engage, revient, n'achète pas. Le client paie et parle moins.",
      "On crée pour la zone commune aux deux.",
      "Les chiffres viennent du spectateur, l'argent du client.",
    ],
    examples: [
      "Le spectateur de Nota : le jeune ambitieux qui n'a pas encore passé le cap.",
      "Le client de Nota : l'activité qui marche, la marque qui ne suit pas.",
    ],
  },
  "m3.3": {
    minutes: 12,
    points: [
      "Trois piliers au plus, tirés du socle de marque.",
      "Chaque pilier sert une étape du tunnel.",
      "La récurrence bat le volume.",
      "Une grille, c'est ne plus décider chaque matin.",
    ],
    examples: [
      "La grille de Gael : journal d'un fondateur (attirer), mécanismes décortiqués (confiance), coulisses (désir).",
      "Le créateur qui poste ce qui lui passe par la tête : trente sujets, aucune mémoire.",
    ],
  },
  "m3.4": {
    minutes: 10,
    points: [
      "Un format, c'est une structure répétable. Une série, c'est un format plus une promesse de retour.",
      "On cumule quand la vidéo douze profite de la onze.",
      "Trois formats suffisent.",
    ],
    examples: [
      "Le journal d'un fondateur, en édition numérotée.",
      "Le portrait de marque : un sujet, une grille d'analyse.",
      "Les edits : le format le plus court, la présence avant le sujet.",
    ],
  },
  "m3.5": {
    minutes: 10,
    points: [
      "Les stories sont le lieu de la conversion, pas de la découverte.",
      "Neuf types de stories, du quotidien à l'appel à l'action.",
      "Une story d'offre par semaine, pas par jour.",
      "La boîte à questions et le sondage font écrire.",
    ],
    examples: [
      "La story d'offre qui déclenche le premier message.",
      "La story coulisses qui prépare la story d'offre.",
    ],
  },
  "m3.6": {
    minutes: 12,
    points: [
      "Pas de structure figée. Trois mécanismes suffisent.",
      "L'accroche : trois secondes, large puis ça trie. Une relance juste après, pour ne pas attirer que des touristes.",
      "Les preuves empilées, juste avant ou juste après l'accroche : chiffres, histoire, volume de contenu.",
      "La boucle ouverte : la meilleure information arrive en dernier, sans l'annoncer.",
      "Règles de base : une vidéo, une idée. Quinze mots par phrase. Un seul appel à l'action, avant la résolution.",
    ],
    examples: ["« 400 abonnés, 0 client, 0 crédibilité. Et là, j'ai changé une seule chose. »"],
  },
  "m3.7": {
    minutes: 10,
    points: [
      "La constance vient du système, pas de la motivation.",
      "Un jour de tournage pour une semaine de contenu.",
      "Une seule règle visuelle : lumière, décor, tenue.",
      "Publier avant d'être prêt, corriger après.",
    ],
    examples: [
      "Semper : le calendrier qui tient le rythme à ta place.",
      "Casey Neistat : le rythme avant la perfection.",
    ],
  },
  // ─── 04 La conversion
  "m4.1": {
    minutes: 10,
    points: [
      "Un appel à l'action par contenu, un seul.",
      "L'aimant rend service avant de demander.",
      "Trois portes : commenter, s'abonner, laisser son e-mail. On mesure laquelle s'ouvre.",
    ],
    examples: [
      "« Lien en bio » contre « réponds LECTURE en commentaire ».",
      "La micro-app comme aimant principal.",
    ],
  },
  "m4.2": {
    minutes: 12,
    points: [
      "Elle est en ligne. Maintenant elle doit être vue : bio, stories, fin de vidéo, signature de mail.",
      "Chaque e-mail récolté est une personne qui t'a fait confiance une fois.",
      "La liste sert à trois choses : une newsletter, un service, un produit.",
      "Les réponses du formulaire sont ta matière : on les relit.",
    ],
    examples: [
      "L'onglerie : le diagnostic qui donne l'e-mail, puis le rappel de rendez-vous.",
      "Le courtier : le simulateur qui qualifie avant l'appel.",
      "Deux cents e-mails contre vingt mille abonnés : ce que tu peux en faire.",
    ],
  },
  "m4.3": {
    minutes: 12,
    points: [
      "Le premier message part de son message, pas de ton offre.",
      "Vocal plutôt qu'écrit.",
      "On développe : objectif, frein. Puis on propose une seule chose.",
      "« Pas intéressé » : on ne force pas, on tague, on revient.",
    ],
    examples: [
      "Le script en quatre temps : approche, développement, proposition, tag.",
      "Les tags « Prospect » et « Marqué » pour savoir où en est chacun.",
    ],
  },
  "m4.4": {
    minutes: 12,
    points: [
      "L'appel donne avant de demander : trois points faibles, preuves à l'appui.",
      "On lit ses contenus avant, pas pendant.",
      "Avant l'appel : le SMS annonce, le mail contient. On confirme douze heures avant.",
      "On parle de l'offre seulement si ça a du sens pour les deux.",
    ],
    examples: [
      "La Lecture de Nota : six maillons, trois rendus.",
      "Une séquence de rappels en cinq moments, de la réservation à l'appel.",
    ],
  },
  "m4.5": {
    minutes: 10,
    points: [
      "L'e-mail est le seul canal qui t'appartient.",
      "Un rythme tenable : une fois par semaine ou par mois, jamais « quand j'ai le temps ».",
      "Quatre chiffres : vues, messages, e-mails, rendez-vous. On regarde la chaîne, pas un chiffre.",
    ],
    examples: [
      "Une newsletter en six formats pour éduquer, informer, convertir.",
      "Ce que dix mille vues valent selon le maillon qui manque.",
    ],
  },
};
