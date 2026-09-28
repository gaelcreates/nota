import Link from "next/link";
import { Ruler } from "@/components/Ruler";
import { getBundle, getGroupSessions, getSettings, getViewer } from "@/lib/data";
import { DEPART, LESSONS, METRICS, ONE_TO_ONE_WEEKS, THEMES } from "@/lib/programme";
import { fmt, today, weekOf } from "@/lib/time";

export default async function Accueil() {
  const viewer = (await getViewer())!;
  const [{ completions, metrics, calls }, sessions, settings] = await Promise.all([
    getBundle(viewer.id),
    getGroupSessions(),
    getSettings(),
  ]);
  const done = new Set(completions.map((c) => c.item_key));
  const week = weekOf(viewer.start_date);
  const first = viewer.full_name.split(" ")[0] || "toi";

  const core = DEPART.filter((m) => m.group !== "bonus");
  const departDone = DEPART.filter((m) => done.has(m.key)).length;
  const lessonsDone = LESSONS.filter((l) => done.has(l.key)).length;

  const nextDepart = core.find((m) => !done.has(m.key));
  const nextLesson = LESSONS.find((l) => !done.has(l.key));
  const next = nextDepart
    ? { kind: "Le départ", title: nextDepart.title, body: nextDepart.body, href: "/espace/depart", tag: `${nextDepart.minutes} min` }
    : nextLesson
      ? { kind: `Module ${nextLesson.module.number} · ${nextLesson.module.title}`, title: nextLesson.mission, body: nextLesson.title, href: `/espace/programme/${nextLesson.module.slug}`, tag: "Mission" }
      : null;

  const depart = metrics.find((m) => m.period === "depart");
  const upcoming = sessions
    .filter((s) => new Date(s.held_on) >= today())
    .sort((a, b) => a.held_on.localeCompare(b.held_on))[0];
  const theme = upcoming && THEMES.find((t) => t.key === upcoming.theme_key);
  const inOneToOne = week <= ONE_TO_ONE_WEEKS;

  return (
    <div className="rise">
      <section className="hero">
        <div className="hero-text">
          <p className="label">Semaine {week} sur 26</p>
          <h1 className="display">
            Bonjour <span className="hl">{first}</span>.
          </h1>
        </div>
        <div className="hero-week" aria-hidden="true">
          <span className="display">{String(week).padStart(2, "0")}</span>
        </div>
      </section>

      <Ruler week={week} />

      {next ? (
        <Link href={next.href} className="now">
          <div className="now-top">
            <span className="label">Maintenant</span>
            <span className="pill pill-accent">{next.tag}</span>
          </div>
          <p className="now-title display">{next.title}</p>
          <p className="now-body">{next.kind} · {next.body}</p>
          <span className="now-go arrow">Y aller </span>
        </Link>
      ) : (
        <div className="now">
          <span className="label">Maintenant</span>
          <p className="now-title display">Tout est coché.</p>
        </div>
      )}

      <section className="grid-3 tiles">
        <Link href="/espace/depart" className="tile">
          <span className="label">Le départ</span>
          <span className="tile-num num">{departDone}<small>/{DEPART.length}</small></span>
          <div className="bar"><i style={{ width: `${(departDone / DEPART.length) * 100}%` }} /></div>
        </Link>
        <Link href="/espace/programme" className="tile">
          <span className="label">Programme</span>
          <span className="tile-num num">{lessonsDone}<small>/{LESSONS.length}</small></span>
          <div className="bar"><i style={{ width: `${(lessonsDone / LESSONS.length) * 100}%` }} /></div>
        </Link>
        <Link href="/espace/appels" className="tile">
          <span className="label">Appels 1:1</span>
          <span className="tile-num num">{calls.length}</span>
          <span className="tile-foot">
            {inOneToOne && settings.calendly_url ? <span className="arrow">Réserver le prochain </span> : calls[0] ? `Dernier le ${fmt.long(calls[0].held_on)}` : "Aucun pour l'instant"}
          </span>
        </Link>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Ta photo de départ</h2>
          <Link href="/espace/progression" className="link">{depart ? "Voir l'évolution" : "La remplir"}</Link>
        </div>
        <div className="grid-4 figures">
          {METRICS.map((k) => (
            <div key={k.key} className="figure">
              <span className="num figure-num">{depart?.[k.key] != null ? depart[k.key]!.toLocaleString("fr-CH") : "—"}</span>
              <span className="label">{k.label}</span>
            </div>
          ))}
        </div>
      </section>

      {viewer.offer !== "repli" && (
        <section className="section">
          <div className="section-head">
            <h2>Appel de groupe</h2>
            <Link href="/espace/appels#groupe" className="link">Tous les appels</Link>
          </div>
          {upcoming && theme ? (
            <div className="card-flat next-group">
              <div>
                <span className="label">{fmt.long(upcoming.held_on)}</span>
                <p className="next-group-title">{theme.title}</p>
                <p className="muted">{theme.body}</p>
              </div>
              {settings.discord_url && (
                <a className="btn btn-ghost btn-sm" href={settings.discord_url} target="_blank" rel="noopener noreferrer">Discord</a>
              )}
            </div>
          ) : (
            <p className="muted">Le prochain appel arrive bientôt.</p>
          )}
        </section>
      )}
    </div>
  );
}
