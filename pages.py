# Pages annexes de la LP (/confirme après la réservation, /bienvenue après le paiement).
# Même feuille de style, mêmes scripts et même pied de page que la LP : on part de site/public/index.html.
import re

SRC = open("site/public/index.html", encoding="utf-8").read()
HEAD_END = SRC.index('<header class="hero"')
BODY_END = SRC.index('<div class="drawer-bg"')
TAIL = SRC[SRC.index("<footer"):]  # pied de page + scripts, sans le volet sur mesure
FOOT_END = TAIL.index("</footer>")
TAIL = TAIL[:FOOT_END].replace('href="#', 'href="/#') + TAIL[FOOT_END:]  # les ancres du pied de page renvoient vers la LP
HEAD = SRC[:HEAD_END]

# Navigation réduite : retour à l'accueil, connexion
NAV_RE = re.compile(r'<div class="navwrap">.*?</div>\s*</nav>\s*</div>|<div class="navwrap">\s*<nav>.*?</nav>\s*</div>', re.S)
NAV = '''<div class="navwrap">
  <nav>
    <a class="brand" href="/" aria-label="Nota, retour à l'accueil"><svg class="mark"><use href="#nota-mark"/></svg>Nota</a>
    <div class="navlinks"></div>
    <a class="navlogin" href="/connexion" aria-label="Se connecter à l'espace membre"><svg class="ico" aria-hidden="true"><use href="#user"/></svg><span>Se connecter</span></a>
  </nav>
</div>'''

TESTIMONIALS = re.search(r'<section class="sec" id="temoignages">.*?</section>', SRC, re.S).group(0)

CSS = '''<style>
  .xp-hero { padding-top: clamp(130px, 16vw, 180px); padding-bottom: clamp(24px, 4vw, 48px); }
  .xp-hero h1 { font-size: clamp(48px, 8vw, 104px); line-height: 0.95; }
  .xp-hero .lead { margin-top: 20px; max-width: 46ch; }
  .xp-when { display: inline-flex; align-items: center; gap: 10px; margin-top: 26px; padding: 10px 16px; border-radius: 999px; background: var(--soft); font-family: var(--display); font-weight: 500; }
  .xp-when[hidden] { display: none; }
  .xp-when i { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
  .xp-one { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: clamp(24px, 4vw, 56px); align-items: center; position: relative; }
  .xp-one h2 { color: #fff; }
  .xp-one .lead { color: rgba(255,255,255,.72); margin-top: 14px; }
  .xp-one .btn { justify-self: start; }
  .xp-steps { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .xp-steps li { padding: 24px; border-radius: var(--r2, 18px); background: #fff; border: 1px solid var(--line); }
  .xp-steps .n { font-family: var(--display); font-weight: 800; font-size: 40px; line-height: 1; color: var(--accent); }
  .xp-steps h3 { margin-top: 14px; font-size: 20px; line-height: 1.2; }
  .xp-steps p { margin-top: 8px; color: var(--muted); }
  .xp-steps a { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 3px; }
  .btn-accent { background: var(--accent); color: var(--ink); border-color: var(--accent); }
  .xp-note { margin-top: 18px; color: var(--muted); max-width: 62ch; }
  @media (max-width: 860px) { .xp-one, .xp-steps { grid-template-columns: minmax(0, 1fr); } }
</style>'''


def video(src, label):
    return f'''<div class="vp" data-reveal style="--i:3" data-curve="2.2" data-io>
        <video class="vp-video" playsinline preload="metadata" poster="" aria-label="{label}">
          <source src="{src}" type="video/mp4">
        </video>
        <div class="vp-poster" aria-hidden="true"><span class="brandcap brand"><svg class="mark"><use href="#nota-mark"/></svg>Nota</span></div>
        <button class="vp-play" type="button" aria-label="Lire la vidéo"><span class="vp-ring"></span><span class="vp-btn"></span></button>
        <div class="vp-ui" aria-hidden="true"><div class="vp-bar"><i class="vp-fill"></i><span class="vp-marks"></span></div></div>
      </div>'''


def steps(items):
    return '<ol class="xp-steps">' + "".join(
        f'<li data-reveal style="--i:{i + 2}"><span class="n">{i + 1}</span><h3>{t}</h3><p>{p}</p></li>' for i, (t, p) in enumerate(items)) + "</ol>"


def page(slug, title, desc, body):
    head = HEAD
    head = re.sub(r"<title>.*?</title>", f"<title>{title} · Nota</title>", head, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', head)
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="https://notaconsulting.ch/{slug}">', head)
    head = re.sub(r'<meta name="robots" content="[^"]*">', "", head)
    head = head.replace("</head>", '<meta name="robots" content="noindex">\n' + CSS + "\n</head>", 1)
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', "", head, flags=re.S)
    head = NAV_RE.sub(NAV, head, count=1)
    doc = head + body + "\n\n" + TAIL
    open(f"site/public/{slug}.html", "w", encoding="utf-8").write(doc)
    print("ok", slug, len(doc) // 1024, "KB")


CALENDLY_JS = r"""<script>
// Calendly ajoute la date et le prénom à l'adresse de redirection
(function () {
  var q = new URLSearchParams(location.search);
  var name = (q.get("invitee_first_name") || (q.get("invitee_full_name") || "").split(" ")[0] || "").trim();
  var at = q.get("event_start_time");
  if (!at) return;
  var d = new Date(at); if (isNaN(d)) return;
  var day = d.toLocaleDateString("fr-CH", { weekday: "long", day: "numeric", month: "long" });
  var hour = d.toLocaleTimeString("fr-CH", { hour: "2-digit", minute: "2-digit" }).replace(":", " h ");
  var el = document.getElementById("when");
  el.querySelector("span").textContent = (name ? name + ", on se voit " : "On se voit ") + day + " à " + hour + ".";
  el.hidden = false;
})();
</script>"""

STEPS_CONFIRME = steps([
    ("Deux réponses claires", "Ce que tu vends aujourd'hui, et ce que tu voudrais voir changé dans trois mois."),
    ("Au calme, caméra allumée", "Sur un ordinateur. On regarde tes contenus ensemble pendant quarante-cinq minutes."),
    ("Comme tu es", "Je n'ai pas besoin que ton compte soit propre. J'ai besoin qu'il soit vrai."),
])
STEPS_BIENVENUE = steps([
    ("Ouvre ton espace", '<a href="/connexion">notaconsulting.ch/connexion</a>, avec l\'adresse de ton inscription. Pas de mot de passe : un code arrive par mail.'),
    ("Réserve ton premier appel", "Le lien est dans ton espace. Dans les sept jours, pour reprendre ta Lecture et fixer le plan."),
    ("Fais ton départ", "Des missions t'attendent dans ton espace."),
])

# ─── /confirme : après la réservation de la Lecture (la VSC) ───────────
CONFIRME = f'''<header class="sec xp-hero" id="top">
  <div class="wrap" data-io>
    <h1 data-reveal style="--i:1">C'est <span class="hl">réservé</span><span class="dotp">.</span></h1>
    <p class="lead" data-reveal style="--i:2">Merci. Deux minutes pour savoir comment ça va se passer, et la seule chose dont j'ai besoin d'ici là.</p>
    <p class="xp-when" id="when" hidden><i></i><span></span></p>
  </div>
</header>

<section class="sec" id="video">
  <div class="wrap" data-io>
    <div class="vs">
      {video("vsc.mp4", "Vidéo avant ta Lecture")}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap" data-io>
    <div class="panel dark" data-reveal>
      <div class="blob"></div>
      <div class="xp-one">
        <div>
          <h2>Une seule chose à faire<span class="dotp">.</span></h2>
          <p class="lead">Envoie-moi en message privé sur Instagram les statistiques de tes dix derniers posts. Des captures suffisent. Sans elles, je lis à l'aveugle.</p>
        </div>
        <a class="btn btn-accent" href="https://ig.me/m/gaelcreates" target="_blank" rel="noopener" data-magnet><span>Envoyer sur Instagram</span> <svg class="arr"><use href="#arrow"/></svg></a>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap" data-io>
    <div class="sec-head"><h2 data-reveal style="--i:1">Comment venir<span class="dotp">.</span></h2></div>
    {STEPS_CONFIRME}
    <p class="xp-note" data-reveal>La veille, tu reçois un mail. Réponds « Confirmé » pour garder ton créneau, ou déplace-le depuis ce mail.</p>
  </div>
</section>

{TESTIMONIALS}

<section class="sec">
  <div class="wrap" data-io>
    <div class="sec-head"><h2 data-reveal style="--i:1">Ce que je lis avant l'appel<span class="dotp">.</span></h2></div>
    <p class="lead" data-reveal style="--i:2">Tes dix derniers contenus, à travers six maillons. Pendant l'appel, je te donne les trois plus fragiles, avec la preuve dans tes propres posts.</p>
    <div class="chain" data-reveal style="--i:3;margin-top:22px" aria-label="Les six maillons"><span>Le rythme</span><span>Le cadre</span><span>L'accroche</span><span>La signature</span><span>L'intention</span><span>Le passage</span></div>
  </div>
</section>

'''+CALENDLY_JS

page("confirme", "C'est réservé", "Ta Lecture est réservée. La vidéo à regarder avant l'appel, et la seule chose à préparer.", CONFIRME)

# ─── /bienvenue : le document de bienvenue, après le paiement ─────────
BIENVENUE = f'''<header class="sec xp-hero" id="top">
  <div class="wrap" data-io>
    <h1 data-reveal style="--i:1"><span class="hl">Bienvenue</span><span class="dotp">.</span></h1>
    <p class="lead" data-reveal style="--i:2">C'est officiel, on travaille ensemble. Regarde cette vidéo d'abord : tout ce qui suit y est expliqué.</p>
  </div>
</header>

<section class="sec" id="video">
  <div class="wrap" data-io>
    <div class="vs">
      {video("bienvenue.mp4", "Vidéo de bienvenue")}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap" data-io>
    <div class="sec-head"><h2 data-reveal style="--i:1">Ta première semaine<span class="dotp">.</span></h2></div>
    {STEPS_BIENVENUE}
  </div>
</section>

<section class="sec">
  <div class="wrap" data-io>
    <div class="panel dark" data-reveal>
      <div class="blob"></div>
      <div class="xp-one">
        <div>
          <h2>Ton espace t'attend<span class="dotp">.</span></h2>
          <p class="lead">Programme, missions, appels, micro-app et tes chiffres, au même endroit.</p>
        </div>
        <a class="btn btn-accent" href="/connexion" data-magnet><span>Ouvrir mon espace</span> <svg class="arr"><use href="#arrow"/></svg></a>
      </div>
    </div>
  </div>
</section>'''

page("bienvenue", "Bienvenue", "Bienvenue dans Nota : la vidéo à regarder, ta première semaine et l'accès à ton espace.", BIENVENUE)
