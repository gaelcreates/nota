import re, base64, os

LOGIN = "connexion.html"  # page de connexion Nota ; le formulaire sera branché sur Supabase quand l'espace membre existera

def b64(p): return base64.b64encode(open(p, "rb").read()).decode()

FOOTER = '''<footer class="foot">
  <div class="wrap">
    <div class="ftop">
      <div class="fbrand">
        <a class="brand" href="__HOME__#top" aria-label="Nota"><svg class="mark"><use href="#nota-mark"/></svg>Nota</a>
        <p>Un accompagnement de Gael, directeur créatif, pour les créateurs qui publient déjà.</p>
        <a class="btn btn-ink btn-sm" href="__HOME__#reserver"><span>Réserver ma Lecture</span> <svg class="arr"><use href="#arrow"/></svg></a>
      </div>
      <div class="fcols" role="navigation" aria-label="Pied de page">
        <div><h4>Nota</h4><a href="__HOME__#video">La vidéo</a><a href="__HOME__#construit">Ce que Nota construit</a><a href="__HOME__#micro-app">Ta micro-app</a><a href="__HOME__#niveaux">Nota et Nota<i class="plus"></i></a><a href="__HOME__#temoignages">Ils en parlent</a><a href="__HOME__#faq">Questions</a></div>
        <div><h4>Accès</h4><a href="__HOME__#reserver">La Lecture</a><a href="__LOGIN__">Espace membre</a><a href="https://www.instagram.com/gaelcreates/" target="_blank" rel="noopener">Instagram</a></div>
        <div><h4>Légal</h4><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a><a href="conditions-generales.html">Conditions générales</a></div>
      </div>
    </div>
    <div class="fbot"><span>© 2026 Nota. Tous droits réservés.</span><span>Aucun cookie publicitaire ni de mesure d'audience.</span></div>
  </div>
</footer>'''

def inject(s, home):
    s = (s.replace("__MILLI_XB__", b64("fonts/MilligramMacro-Extrabold.woff2"))
          .replace("__MILLI_MD__", b64("fonts/MilligramMacro-Medium.woff2"))
          .replace("__SHAD__", b64("fonts/Sh-Ad-Grotesk-Regular.woff2"))
          .replace("__QUICK__", b64("fonts/Quicksand-Bold-nota.woff2"))
          .replace("__POD__", b64("pod.jpg"))
          .replace("__FOOTER__", FOOTER.replace("__HOME__", home))
          .replace("__LOGIN__", LOGIN))
    return s

# ---------- Page d'accueil
s = open("src2.html", encoding="utf-8").read()
s = re.sub(r'style="([^"]*)" data-reveal style="([^"]*)"', lambda m: 'data-reveal style="%s;%s"' % (m.group(1), m.group(2)), s)
assert not re.findall(r'<[^>]*style="[^"]*"[^>]*style="', s), "style dupliqué"
s = inject(s, "").replace("__LENIS__", open("vendor-lenis.min.js", encoding="utf-8").read())
assert "__" not in re.sub(r"<script>.*?</script>", "", s, flags=re.S).split("<body>")[1].replace("__proto__", ""), "marqueur non remplacé"
open("index.html", "w", encoding="utf-8").write(s)
a = s.split("<head>")[1]; head, body = a.split("</head>", 1)
head = re.sub(r'<meta[^>]*>', '', head); body = body.replace("<body>", "").replace("</body>", "").replace("</html>", "")
open("nota-lp.html", "w", encoding="utf-8").write(head.strip() + "\n" + body.strip())

# ---------- Pages légales : même feuille de style, mêmes pictogrammes, même pied de page
style = re.search(r"<style>.*?</style>", s, re.S).group(0)
FAV = re.search(r'<link rel="icon" href="([^"]+)"', s).group(1)
sprite = re.search(r'<svg width="0" height="0".*?</svg>', s, re.S).group(0)
NAV = '''<div class="navwrap"><nav>
  <a class="brand" href="./" aria-label="Nota, retour à l'accueil"><svg class="mark"><use href="#nota-mark"/></svg>Nota</a>
  <a class="navlogin" href="__LOGIN__" aria-label="Se connecter à l'espace membre"><svg class="ico" aria-hidden="true"><use href="#user"/></svg><span>Se connecter</span></a>
  <a class="btn btn-ink btn-sm" href="./#reserver"><span>Réserver ma Lecture</span> <svg class="arr"><use href="#arrow"/></svg></a>
</nav></div>'''
LEGAL_CSS = '''<style>
  html, body, * { cursor: auto !important; } a, button, summary { cursor: pointer !important; }
  .legal { display: grid; grid-template-columns: 210px minmax(0, 740px); justify-content: center; gap: clamp(28px, 5vw, 80px); padding-block: 136px clamp(56px, 8vw, 96px); }
  .ltabs { position: sticky; top: 104px; align-self: start; display: grid; gap: 4px; }
  .ltabs .k { font-family: var(--display); font-weight: 500; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 0 0 8px 12px; }
  .ltabs a { padding: 9px 12px; border-radius: 10px; text-decoration: none; color: var(--ink2); font-family: var(--display); font-weight: 500; font-size: 14.5px; white-space: nowrap; transition: background-color 220ms var(--ease), color 220ms var(--ease); }
  .ltabs a:hover { background: var(--soft); color: var(--ink); }
  .ltabs a[aria-current="page"] { background: var(--ink); color: #fff; }
  .legal article h1 { font-size: clamp(40px, 5.2vw, 64px); }
  .legal .upd { margin-top: 12px; color: var(--muted); font-size: 14px; }
  .legal .intro { margin-top: 26px; font-size: 18.5px; line-height: 1.5; color: var(--ink2); max-width: 62ch; }
  .legal .draft { margin-top: 24px; padding: 14px 16px; border-radius: 14px; background: var(--soft); border: 1px solid var(--accent2); font-size: 15px; color: var(--ink); }
  .legal section { padding-block: 28px; border-top: 1px solid var(--line); }
  .legal section:first-of-type { margin-top: 36px; }
  .legal h2 { font-size: 24px; line-height: 1.15; margin-bottom: 12px; }
  .legal section p { color: var(--ink2); max-width: 66ch; }
  .legal section p + p, .legal section .rows + p { margin-top: 10px; }
  .legal article a { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 3px; }
  .legal .facts { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 8px; }
  .legal .facts li { position: relative; padding-left: 18px; color: var(--ink2); }
  .legal .facts li::before { content: ""; position: absolute; left: 0; top: 0.62em; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .legal .rows { display: grid; gap: 10px; margin-top: 6px; }
  .legal .rows .row { display: grid; grid-template-columns: 190px minmax(0, 1fr); gap: 18px; padding: 16px 18px; border: 1px solid var(--line); border-radius: 16px; background: #fff; }
  .legal .rows h3 { font-size: 17px; line-height: 1.3; }
  .todo { background: var(--soft); box-shadow: inset 0 -0.42em 0 var(--accent2); border-radius: 4px; padding: 0 4px; color: var(--ink); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  @media (max-width: 860px) {
    .legal { grid-template-columns: minmax(0, 1fr); padding-top: 108px; }
    .ltabs { position: static; display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; }
    .ltabs .k { display: none; }
    .legal .rows .row { grid-template-columns: minmax(0, 1fr); gap: 6px; }
  }
</style>'''
PAGES = [("mentions-legales", "Mentions légales"), ("confidentialite", "Confidentialité"), ("conditions-generales", "Conditions générales")]
DESCS = {"mentions-legales": "Mentions légales du site notaconsulting.ch, édité par Gael Fischer, directeur créatif.", "confidentialite": "Politique de confidentialité de Nota : quelles données sont collectées, pourquoi, et combien de temps elles sont gardées.", "conditions-generales": "Conditions générales de l'accompagnement Nota et Nota+ : contenu, durée, paiement, fin d'accès."}
for slug, title in PAGES:
    content = open("legal/%s.html" % slug, encoding="utf-8").read()
    content = re.sub(r"^<!--.*?-->\s*", "", content)
    tabs = '<aside class="ltabs" aria-label="Pages légales"><p class="k">Légal</p>' + "".join(
        '<a href="%s.html"%s>%s</a>' % (sl, ' aria-current="page"' if sl == slug else "", t) for sl, t in PAGES) + "</aside>"
    doc = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
           '<title>%s · Nota</title>\n<meta name="description" content="%s">\n<link rel="canonical" href="https://notaconsulting.ch/%s">\n<link rel="icon" href="%s">\n%s\n%s\n</head>\n<body>\n%s\n%s\n<main class="legal wrap">%s<article>\n%s\n</article></main>\n%s\n</body>\n</html>\n') % (
           title, DESCS[slug], slug, FAV, style, LEGAL_CSS, sprite, NAV, tabs, content, FOOTER.replace("__HOME__", "./"))
    doc = doc.replace("__LOGIN__", LOGIN)
    open("%s.html" % slug, "w", encoding="utf-8").write(doc)

# ---------- Page de connexion : même feuille de style, formulaire par lien magique (à brancher sur Supabase)
LOGIN_CSS = """<style>
  html, body, * { cursor: auto !important; } a, button, summary { cursor: pointer !important; } input { cursor: text !important; }
  body { min-height: 100vh; display: grid; grid-template-rows: auto 1fr auto; background: linear-gradient(160deg, #FFFFFF 0%, #FFFDF4 45%, #FFF4C8 100%); background-attachment: fixed; }
  .lg-dots { position: fixed; inset: 0; background-image: radial-gradient(rgba(15,15,15,0.12) 1px, transparent 1px); background-size: 22px 22px; mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 70%); -webkit-mask-image: radial-gradient(circle at 50% 40%, #000 0%, transparent 70%); pointer-events: none; }
  .lg-main { position: relative; display: grid; place-items: center; padding: 120px 16px 56px; }
  .lg-card { width: min(100%, 460px); background: #fff; border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--sh-lg); padding: clamp(26px, 5vw, 40px); display: grid; gap: 18px; }
  .lg-card .chip { justify-self: start; }
  .lg-card h1 { font-size: clamp(32px, 6vw, 42px); line-height: 1.02; }
  .lg-card .sub { color: var(--ink2); }
  .lg-form { display: grid; gap: 10px; margin-top: 4px; }
  .lg-form label { font-family: var(--display); font-weight: 500; font-size: 13px; color: var(--muted); }
  .lg-form input { width: 100%; font: inherit; font-size: 16.5px; color: var(--ink); padding: 15px 16px; border-radius: 14px; border: 1px solid var(--line); background: #FBFBF8; outline: none; transition: border-color 200ms var(--ease), box-shadow 200ms var(--ease), background-color 200ms var(--ease); }
  .lg-form input::placeholder { color: #A9A79C; }
  .lg-form input:focus-visible { border-color: var(--accent); background: #fff; box-shadow: 0 0 0 4px rgba(255,197,8,0.22); }
  .lg-form .btn { width: 100%; justify-content: center; margin-top: 4px; }
  .lg-msg { padding: 14px 16px; border-radius: 14px; background: var(--soft); border: 1px solid var(--accent2); font-size: 15px; color: var(--ink); }
  .lg-msg a, .lg-alt a { text-decoration: underline; text-decoration-color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 3px; }
  .lg-alt { padding-top: 16px; border-top: 1px solid var(--line); font-size: 15px; color: var(--ink2); }
  .lg-foot { position: relative; display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: center; padding: 0 16px 28px; font-size: 13.5px; color: var(--muted); }
  .lg-foot a { color: inherit; text-decoration: none; } .lg-foot a:hover { color: var(--ink); }
</style>"""
LOGIN_NAV = """<div class="navwrap"><nav>
  <a class="brand" href="./" aria-label="Nota, retour à l'accueil"><svg class="mark"><use href="#nota-mark"/></svg>Nota</a>
  <a class="btn btn-ink btn-sm" href="./#reserver"><span>Réserver ma Lecture</span> <svg class="arr"><use href="#arrow"/></svg></a>
</nav></div>"""
LOGIN_BODY = """<div class="lg-dots" aria-hidden="true"></div>
<main class="lg-main">
  <div class="lg-card">
    <span class="chip">Espace membre</span>
    <h1>Ton espace<span class="dotp">.</span></h1>
    <p class="sub">Entre l'e-mail de ton accompagnement. Tu reçois un lien de connexion, sans mot de passe.</p>
    <form class="lg-form" id="lg-form" novalidate>
      <label for="lg-email">Ton e-mail</label>
      <input id="lg-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="prenom@exemple.com" required>
      <button class="btn btn-ink" type="submit"><span>Recevoir mon lien</span> <svg class="arr"><use href="#arrow"/></svg></button>
    </form>
    <p class="lg-msg" id="lg-msg" role="status" hidden></p>
    <p class="lg-alt">Pas encore accompagné ? <a href="./#reserver">Réserve ta Lecture</a>, quarante-cinq minutes, gratuite.</p>
  </div>
</main>
<div class="lg-foot"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a><a href="conditions-generales.html">Conditions générales</a><span>© 2026 Nota</span></div>
<script>
  // Tant que l'espace membre n'est pas branché, SEND reste vide et le formulaire l'annonce clairement.
  // Plus tard : SEND = function (email) { return supabase.auth.signInWithOtp({ email: email }); }
  var SEND = null;
  var form = document.getElementById("lg-form"), msg = document.getElementById("lg-msg"), input = document.getElementById("lg-email");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = input.value.trim(); msg.hidden = false;
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) { msg.textContent = "Cette adresse ne semble pas complète. Vérifie-la et recommence."; input.focus(); return; }
    if (!SEND) { msg.innerHTML = "L'espace membre ouvre bientôt. Si tu es déjà accompagné, écris à <a href=\\"mailto:gael@notaconsulting.ch\\">gael@notaconsulting.ch</a> et je te réponds."; return; }
    msg.textContent = "Envoi en cours.";
    SEND(email).then(function () { msg.textContent = "C'est envoyé. Ouvre le lien reçu à " + email + " pour entrer."; }, function () { msg.textContent = "L'envoi n'a pas abouti. Réessaie dans une minute, ou écris à gael@notaconsulting.ch."; });
  });
</script>"""
doc = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n'
       '<title>Se connecter · Nota</title>\n<link rel="icon" href="%s">\n%s\n%s\n</head>\n<body>\n%s\n%s\n%s\n</body>\n</html>\n') % (FAV, style, LOGIN_CSS, sprite, LOGIN_NAV, LOGIN_BODY)
open("connexion.html", "w", encoding="utf-8").write(doc)

# La LP est servie par le projet Next.js : copie des pages dans site/public
import shutil
for page in ("index", "conditions-generales", "confidentialite", "mentions-legales"):
    shutil.copy("%s.html" % page, "site/public/%s.html" % page)

print("build ok", len(s) // 1024, "KB + 3 pages légales, copiées dans site/public")
